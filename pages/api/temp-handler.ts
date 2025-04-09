import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { analyzeResume, saveResumeAnalysis } from '../lib/claude';
import { parseFile } from '../lib/fileParser';

// Create direct admin client
const directAdminClient = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    )
  : null;

// Helper function to validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.group('API: Resume analysis request received');
  
  // Make sure we have a valid admin client
  if (!directAdminClient) {
    console.error('API: No valid Supabase admin client available');
    return res.status(500).json({ 
      error: 'Server configuration error',
      details: 'Failed to initialize Supabase admin client'
    });
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    console.error('Method not allowed:', req.method);
    console.groupEnd();
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract authorization token
    const authHeader = req.headers.authorization;
    let user = null;
    let authError = null;

    // Authenticate the user
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const { data, error } = await directAdminClient.auth.getUser(token);
        if (error) {
          authError = error;
        } else if (data?.user) {
          user = data.user;
        }
      } catch (e) {
        authError = e;
      }
    }

    // If token auth failed, try JWT parsing in production
    if (!user && process.env.NODE_ENV === 'production' && authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
          if (payload.sub) {
            user = {
              id: payload.sub,
              email: payload.email || null,
              app_metadata: {},
              user_metadata: {},
              aud: 'authenticated',
              created_at: '',
              updated_at: ''
            };
          }
        }
      } catch (e) {
        console.error('JWT parsing error:', e);
      }
    }

    // Return error if not authenticated
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get the resume ID from the request
    const { resumeId, jobRole, industry, experienceLevel } = req.body;

    if (!resumeId || !isValidUUID(resumeId)) {
      return res.status(400).json({ error: 'Valid resume ID is required' });
    }

    // Get resume from database
    const { data: resume, error: resumeError } = await directAdminClient
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();

    if (resumeError || !resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Verify the resume belongs to the user
    if (resume.user_id !== user.id) {
      return res.status(403).json({ 
        error: 'Not authorized to access this resume' 
      });
    }

    // Get the file
    let fileData = null;
    
    if (resume.resume_url) {
      try {
        const response = await fetch(resume.resume_url);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          fileData = Buffer.from(arrayBuffer);
        }
      } catch (e) {
        console.error('Error fetching file:', e);
      }
    }

    // If direct URL failed, try Supabase storage
    if (!fileData) {
      try {
        const fileName = resume.file_name.replace(/\s+/g, '_');
        const { data, error } = await directAdminClient.storage
          .from('resumes')
          .download(fileName);
          
        if (!error) {
          fileData = data;
        }
      } catch (e) {
        console.error('Error downloading from storage:', e);
      }
    }

    if (!fileData) {
      return res.status(500).json({ error: 'Failed to download resume file' });
    }

    // Parse the file
    const contentType = resume.file_type || 'application/pdf';
    let resumeText;
    
    try {
      resumeText = await parseFile(fileData, contentType);
    } catch (e) {
      return res.status(400).json({ error: 'Failed to parse resume file' });
    }

    // Analyze with Claude
    try {
      const analysisResult = await analyzeResume(resumeText, {
        jobRole,
        industry,
        experienceLevel
      });
      
      // Save the analysis
      try {
        await saveResumeAnalysis(resumeId, user.id, analysisResult, directAdminClient);
      } catch (e) {
        console.error('Error saving analysis:', e);
      }

      // Return the result
      return res.status(200).json(analysisResult);
    } catch (e) {
      return res.status(500).json({
        error: 'Failed to analyze resume with Claude',
        details: e instanceof Error ? e.message : String(e)
      });
    }
  } catch (e) {
    console.error('Unexpected error:', e);
    return res.status(500).json({ error: 'Failed to analyze resume' });
  }
} 