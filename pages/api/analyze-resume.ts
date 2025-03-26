import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { analyzeResume, saveResumeAnalysis, ResumeAnalysisResult } from '../../lib/claude';
import { parseFile } from '../../lib/fileParser';

// Create a Supabase admin client with service role key for API routes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      persistSession: false, // API routes don't need persistent sessions
      autoRefreshToken: false,
    }
  }
);

// Type definition for expected request body
interface AnalyzeResumeRequest extends NextApiRequest {
  body: {
    resumeId: string;
    jobRole?: string;
    industry?: string;
    experienceLevel?: string;
  };
}

// Helper function to validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export default async function handler(
  req: AnalyzeResumeRequest,
  res: NextApiResponse
) {
  console.group('API: Resume analysis request received');
  
  // Log Supabase connection details to diagnose issues
  console.log('API: Supabase connection details:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    nodeEnv: process.env.NODE_ENV
  });
  
  console.log('Request method:', req.method);
  console.log('Request body:', {
    resumeId: req.body?.resumeId,
    hasJobRole: Boolean(req.body?.jobRole),
    hasIndustry: Boolean(req.body?.industry),
    hasExperienceLevel: Boolean(req.body?.experienceLevel),
  });
  
  // Only allow POST method
  if (req.method !== 'POST') {
    console.error('Method not allowed:', req.method);
    console.groupEnd();
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('API: Extracting auth token and verifying user');
    // Extract authorization token
    const authHeader = req.headers.authorization;
    let userResponse;

    // Track auth method for debugging
    let authMethod = 'none';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Use the token from Authorization header
      authMethod = 'bearer';
      const token = authHeader.substring(7);
      console.log('API: Using Bearer token authentication, token length:', token.length);
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      userResponse = { data, error };
    } else {
      // Fallback to session cookie
      authMethod = 'cookie';
      console.log('API: No Bearer token found, falling back to cookie authentication');
      userResponse = await supabaseAdmin.auth.getUser();
    }

    const { data: { user }, error: authError } = userResponse;
    
    if (authError) {
      console.error(`API: Authentication error (method: ${authMethod}):`, authError);
      console.groupEnd();
      return res.status(401).json({ 
        error: 'Unauthorized', 
        details: authError.message,
        authMethod
      });
    }
    
    if (!user) {
      console.error(`API: No user found after authentication (method: ${authMethod})`);
      console.groupEnd();
      return res.status(401).json({ 
        error: 'Unauthorized', 
        details: 'No user found in session',
        authMethod
      });
    }

    console.log(`API: User authenticated successfully. User ID: ${user.id.slice(0, 8)}...`);

    const { resumeId, jobRole, industry, experienceLevel } = req.body;

    if (!resumeId) {
      console.error('API: No resume ID provided in request');
      console.groupEnd();
      return res.status(400).json({ error: 'Resume ID is required' });
    }
    
    // Log the exact resume ID format
    console.log('API: Resume ID details:', {
      id: resumeId,
      length: resumeId.length,
      type: typeof resumeId
    });

    // Validate UUID format
    if (!isValidUUID(resumeId)) {
      console.error('API: Invalid UUID format:', resumeId);
      console.groupEnd();
      return res.status(400).json({ 
        error: 'Invalid resume ID format',
        details: 'Resume ID must be a valid UUID'
      });
    }

    console.log(`API: Processing resume analysis for resume ID: ${resumeId}`);

    // Get resume details from database using single() to improve debugging
    console.log('API: Querying database for resume');
    const { data: singleResumeData, error: singleError } = await supabaseAdmin
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();
    
    // Variable to hold the final resume data
    let resume: any = null;
    
    // If single() fails, try without using single() for better error reporting
    if (singleError) {
      console.log('API: Single query failed, checking if multiple or zero records');
      const { data: multipleResumes, error: multiError } = await supabaseAdmin
        .from('resumes')
        .select('*')  // Select all fields to match the single() query
        .eq('id', resumeId);
      
      if (multiError) {
        console.error('API: Error in fallback query:', multiError);
        console.groupEnd();
        return res.status(500).json({
          error: 'Database query error',
          details: multiError.message
        });
      }
      
      if (!multipleResumes || multipleResumes.length === 0) {
        console.error('API: No resume found with ID:', resumeId);
        
        // Try finding closest match for debugging (similar IDs)
        console.log('API: Searching for similar resume IDs...');
        const idWithoutHyphens = resumeId.replace(/-/g, '');
        
        // First try to match by the first segment of the UUID
        const firstSegment = resumeId.split('-')[0];
        const { data: similarByPrefix } = await supabaseAdmin
          .from('resumes')
          .select('*')  // Get all fields to maintain consistency
          .ilike('id', `${firstSegment}%`);
          
        if (similarByPrefix && similarByPrefix.length > 0) {
          console.log('API: Found resumes with matching prefix:', 
            similarByPrefix.map(r => ({
              id: r.id,
              fileName: r.file_name,
              similarity: calculateSimilarity(resumeId, r.id)
            }))
          );
          
          // Find the most similar ID
          const mostSimilar = similarByPrefix.reduce((prev, current) => {
            const prevScore = calculateSimilarity(resumeId, prev.id);
            const currentScore = calculateSimilarity(resumeId, current.id);
            return currentScore > prevScore ? current : prev;
          }, similarByPrefix[0]);
          
          // If we find a very similar ID (> 90% match), use it instead
          if (calculateSimilarity(resumeId, mostSimilar.id) > 0.9) {
            console.log('API: Using similar resume instead - very high similarity score', {
              providedId: resumeId,
              usingId: mostSimilar.id,
              similarity: calculateSimilarity(resumeId, mostSimilar.id)
            });
            
            // Continue with this resume instead
            resume = mostSimilar;
          } else {
            // Otherwise, return not found
            console.groupEnd();
            return res.status(404).json({ 
              error: 'Resume not found in database', 
              details: 'No resume with this ID exists',
              similarFound: similarByPrefix.length > 0,
              similarityThreshold: 'not met'
            });
          }
        } else {
          console.groupEnd();
          return res.status(404).json({ 
            error: 'Resume not found in database', 
            details: 'No resume with this ID exists' 
          });
        }
      } else if (multipleResumes.length > 1) {
        console.error('API: Multiple resumes found for ID:', resumeId, multipleResumes.length);
        console.groupEnd();
        return res.status(500).json({ 
          error: 'Multiple resumes found with the same ID', 
          details: 'Database integrity issue'
        });
      } else {
        // We found exactly one resume, but single() failed for some reason
        resume = multipleResumes[0];
        console.log('API: Resume found through fallback query:', { 
          id: resume.id,
          user_id: resume.user_id,
          file_name: resume.file_name
        });
      }
    } else {
      // Single() succeeded
      resume = singleResumeData;
      console.log('API: Resume found:', { 
        id: resume.id,
        user_id: resume.user_id,
        file_name: resume.file_name
      });
    }
    
    // Make sure we have a resume at this point
    if (!resume) {
      console.error('API: No resume found after all fallback attempts');
      console.groupEnd();
      return res.status(404).json({ 
        error: 'Resume not found in database', 
        details: 'No resume was found after all fallback attempts' 
      });
    }

    // Verify the resume belongs to the authenticated user
    if (resume.user_id !== user.id) {
      console.error('API: User ID mismatch:', { 
        resumeUserId: resume.user_id, 
        requestUserId: user.id 
      });
      console.groupEnd();
      return res.status(403).json({ 
        error: 'Not authorized to access this resume',
        details: 'The resume belongs to a different user'
      });
    }

    // Try getting the file first directly from Supabase storage using the file name
    console.log('API: Attempting to retrieve resume file from storage');
    
    // First approach: Try direct file path if we have a file naming pattern
    let fileData;
    let storageError;
    let fileRetrievalMethod = '';
    let retrievalErrors = [];
    
    // New approach: Use the resume URL directly if available
    // This should be our primary and most reliable method
    if (resume.resume_url) {
      try {
        fileRetrievalMethod = 'direct_url';
        console.log('API: Attempting to fetch resume directly using stored URL:', resume.resume_url);
        
        // Extract the path from the URL
        const url = new URL(resume.resume_url);
        console.log('API: Parsed URL:', {
          protocol: url.protocol,
          hostname: url.hostname,
          pathname: url.pathname,
          searchParams: Object.fromEntries(url.searchParams.entries())
        });
        
        // Try a direct fetch first (should work for public buckets)
        const fetchResponse = await fetch(resume.resume_url);
        
        if (fetchResponse.ok) {
          const arrayBuffer = await fetchResponse.arrayBuffer();
          fileData = new Blob([arrayBuffer]);
          console.log('API: File retrieved successfully using direct URL fetch');
        } else {
          const errorDetails = {
            status: fetchResponse.status,
            statusText: fetchResponse.statusText
          };
          console.error('API: Failed to fetch file using direct URL:', errorDetails);
          retrievalErrors.push({ method: 'direct_url', error: errorDetails });
          
          // If direct fetch fails, try using Supabase storage with the URL path
          // Extract the path from URL: '/storage/v1/object/public/resumes/filename.pdf'
          const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/resumes\/(.*)/);
          
          if (pathMatch && pathMatch[1]) {
            const storagePath = decodeURIComponent(pathMatch[1]);
            console.log('API: Extracted storage path from URL:', storagePath);
            
            const { data, error } = await supabaseAdmin.storage
              .from('resumes')
              .download(storagePath);
            
            if (error) {
              console.error('API: Error downloading file with URL-extracted path:', error);
              retrievalErrors.push({ method: 'url_path_extraction', error: error });
            } else {
              fileData = data;
              console.log('API: File retrieved successfully using URL path in storage API');
            }
          } else {
            console.error('API: Could not extract storage path from URL');
            retrievalErrors.push({ 
              method: 'url_path_extraction', 
              error: 'Could not extract storage path from URL'
            });
          }
        }
      } catch (urlError) {
        console.error('API: Error with direct URL retrieval:', urlError);
        retrievalErrors.push({ method: 'direct_url', error: String(urlError) });
      }
    } else {
      console.log('API: No resume_url field found in resume record');
      retrievalErrors.push({ method: 'direct_url', error: 'No resume_url field in database record' });
    }
    
    // If URL approach failed, try using the filename pattern (original approach)
    if (!fileData && resume.file_name) {
      try {
        // Construct a likely file path based on patterns we observed
        const fileName = resume.file_name.replace(/\s+/g, '_');
        
        // Try to find the timestamp prefix from URL if available
        let timestampPrefix = '';
        if (resume.resume_url) {
          const urlMatch = resume.resume_url.match(/\/(\d+-[^?/]+)(?:\?.*)?$/);
          if (urlMatch) {
            timestampPrefix = urlMatch[1].split('-')[0] + '-';
          }
        }
        
        const potentialPaths = [
          // Try common patterns
          `${timestampPrefix}${resume.file_name}`,
          `${timestampPrefix}${fileName}`,
          resume.file_name,
          fileName
        ];
        
        console.log('API: Trying direct file access with potential paths:', potentialPaths);
        fileRetrievalMethod = 'filename_patterns';
        
        // List all files in the bucket to find potential matches
        const { data: fileList, error: listError } = await supabaseAdmin.storage
          .from('resumes')
          .list('', { limit: 100 });
          
        if (listError) {
          console.error('API: Error listing files in storage:', listError);
          retrievalErrors.push({ method: 'filename_patterns', error: listError });
        } else if (fileList && fileList.length > 0) {
          console.log('API: All files in storage bucket:', fileList.map(f => f.name));
          
          // Try each potential path
          for (const path of potentialPaths) {
            // Check if file exists in the list
            const exactMatch = fileList.find(f => f.name === path);
            if (exactMatch) {
              console.log('API: Exact match found:', exactMatch.name);
              const { data, error } = await supabaseAdmin.storage
                .from('resumes')
                .download(exactMatch.name);
                
              if (!error && data) {
                fileData = data;
                console.log('API: File retrieved successfully using exact filename match');
                break; // Exit the loop if successful
              } else {
                console.error('API: Error retrieving file with exact match:', error);
                retrievalErrors.push({ 
                  method: 'filename_patterns_exact', 
                  path: exactMatch.name,
                  error: error 
                });
              }
            }
          }
          
          // If exact matches failed, try partial matches
          if (!fileData) {
            // Find the best match - any file containing the file name
            const bestMatch = fileList.find(f => 
              potentialPaths.some(path => f.name.includes(path)) ||
              f.name.includes(resume.file_name)
            );
            
            if (bestMatch) {
              console.log('API: Best partial match found:', bestMatch.name);
              const { data, error } = await supabaseAdmin.storage
                .from('resumes')
                .download(bestMatch.name);
                
              if (!error && data) {
                fileData = data;
                console.log('API: File retrieved successfully using partial filename match');
              } else {
                console.error('API: Error retrieving file with partial match:', error);
                retrievalErrors.push({ 
                  method: 'filename_patterns_partial', 
                  path: bestMatch.name,
                  error: error 
                });
              }
            } else {
              console.error('API: No matching files found in storage');
              retrievalErrors.push({ 
                method: 'filename_patterns', 
                error: 'No matching files found in storage' 
              });
            }
          }
        } else {
          console.log('API: No files found in storage bucket');
          retrievalErrors.push({ 
            method: 'filename_patterns', 
            error: 'No files found in storage bucket' 
          });
        }
      } catch (directError) {
        console.error('API: Error with direct file retrieval:', directError);
        retrievalErrors.push({ method: 'filename_patterns', error: String(directError) });
      }
    }
    
    if (!fileData) {
      console.error('API: Failed to retrieve resume file after multiple attempts');
      console.log('API: Retrieval errors:', JSON.stringify(retrievalErrors, null, 2));
      console.groupEnd();
      return res.status(500).json({ 
        error: 'Failed to download resume file from storage', 
        details: 'File could not be retrieved using any method',
        retrieval_attempts: fileRetrievalMethod,
        retrieval_errors: retrievalErrors
      });
    }

    // Extract text content from the resume using our parser
    let resumeText: string;
    const contentType = resume.file_type || 'application/pdf';

    try {
      console.log('API: Parsing file of type:', contentType);
      
      // Check if we have fileData before trying to parse
      if (!fileData) {
        throw new Error('File data is null or undefined');
      }
      
      // Get and log file size
      const fileSize = fileData instanceof Blob ? fileData.size : Buffer.byteLength(fileData);
      console.log(`API: File size: ${fileSize} bytes`);
      
      // Convert Blob to Buffer if needed
      let fileBuffer: Buffer;
      if (fileData instanceof Blob) {
        const arrayBuffer = await fileData.arrayBuffer();
        fileBuffer = Buffer.from(arrayBuffer);
      } else {
        fileBuffer = fileData;
      }
      
      // Diagnostic: Check first few bytes of the file
      const firstBytes = fileBuffer.slice(0, 20).toString('hex');
      console.log(`API: First 20 bytes of file: ${firstBytes}`);
      
      // When dealing with PDFs, check for the PDF header
      if (contentType.includes('pdf')) {
        const pdfHeader = fileBuffer.slice(0, 5).toString();
        console.log(`API: PDF header check: '${pdfHeader}'`);
        if (!pdfHeader.startsWith('%PDF-')) {
          console.warn('API: File does not have a valid PDF header');
        }
      }
      
      resumeText = await parseFile(fileBuffer, contentType);
      console.log('API: Resume text extracted successfully, length:', resumeText.length);
      
      // Diagnostic: Log a small sample of the extracted text
      if (resumeText.length > 0) {
        const textSample = resumeText.substring(0, 100);
        console.log(`API: Text sample: "${textSample}${resumeText.length > 100 ? '...' : ''}"`);
      } else {
        console.warn('API: Extracted text is empty');
      }
    } catch (error) {
      console.error('API: Error parsing file:', error, { contentType });
      console.groupEnd();
      return res.status(400).json({ 
        error: 'Failed to parse resume file',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    console.log('API: Successfully parsed resume, proceeding to analysis');

    // Call Claude API to analyze the resume
    try {
      console.log('API: Calling Claude API for resume analysis');
      const analysisResult = await analyzeResume(resumeText, {
        jobRole,
        industry,
        experienceLevel
      });
      
      console.log('API: Claude analysis completed successfully');

      // Save the analysis result to Supabase
      try {
        console.log('API: Saving analysis results to database');
        await saveResumeAnalysis(resumeId, user.id, analysisResult, supabaseAdmin);
        console.log('API: Analysis results saved successfully');
      } catch (saveError) {
        console.error('API: Error saving analysis results:', saveError);
        // Continue anyway - we still want to return the results even if we can't save them
      }

      // Return the analysis result
      console.groupEnd();
      return res.status(200).json(analysisResult);
    } catch (analysisError) {
      console.error('API: Error during Claude analysis:', analysisError);
      console.groupEnd();
      return res.status(500).json({
        error: 'Failed to analyze resume with Claude',
        details: analysisError instanceof Error ? analysisError.message : String(analysisError)
      });
    }
  } catch (error) {
    console.error('API: Unexpected error in resume analysis endpoint:', error);
    console.groupEnd();
    return res.status(500).json({ 
      error: 'Failed to analyze resume',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

// Helper function to calculate similarity between two UUIDs
function calculateSimilarity(uuid1: string, uuid2: string): number {
  let matches = 0;
  const maxLen = Math.max(uuid1.length, uuid2.length);
  
  // Count matching characters
  for (let i = 0; i < Math.min(uuid1.length, uuid2.length); i++) {
    if (uuid1[i] === uuid2[i]) matches++;
  }
  
  return matches / maxLen;
} 