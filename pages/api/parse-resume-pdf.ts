import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import pdf from 'pdf-parse';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  console.group('API: Parse resume PDF');
  
  const { resumeId, resumeUrl } = req.body;
  
  if (!resumeId || !resumeUrl) {
    console.error('API: Missing required parameters');
    console.groupEnd();
    return res.status(400).json({ error: 'Resume ID and URL are required' });
  }
  
  // Create Supabase client with service role key (for admin access)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    }
  );
  
  try {
    console.log('API: Authenticating user request');
    // Authenticate the user
    const authHeader = req.headers.authorization;
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data, error } = await supabase.auth.getUser(token);
      if (error) {
        console.error('API: Authentication error:', error);
        console.groupEnd();
        return res.status(401).json({ error: 'Unauthorized', details: error.message });
      }
      userId = data.user?.id;
    }
    
    if (!userId) {
      console.error('API: No user found after authentication');
      console.groupEnd();
      return res.status(401).json({ error: 'Unauthorized', details: 'No user found in session' });
    }
    
    console.log(`API: User authenticated successfully. User ID: ${userId.slice(0, 8)}...`);
    
    // Verify the resume belongs to the user
    console.log(`API: Verifying resume ownership for ID: ${resumeId}`);
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('id, user_id, file_name, file_type')
      .eq('id', resumeId)
      .single();
      
    if (resumeError || !resume) {
      console.error('API: Resume not found:', resumeError);
      console.groupEnd();
      return res.status(404).json({ error: 'Resume not found', details: resumeError?.message });
    }
    
    if (resume.user_id !== userId) {
      console.error('API: Resume belongs to different user', {
        resumeUserId: resume.user_id,
        requestUserId: userId
      });
      console.groupEnd();
      return res.status(403).json({ error: 'Not authorized to access this resume' });
    }
    
    console.log('API: Resume ownership verified');
    
    // Download the resume file
    console.log(`API: Downloading resume from URL: ${resumeUrl.substring(0, 50)}...`);
    const fileResponse = await fetch(resumeUrl);
    
    if (!fileResponse.ok) {
      console.error(`API: Failed to download resume: ${fileResponse.status} ${fileResponse.statusText}`);
      console.groupEnd();
      return res.status(500).json({ 
        error: 'Failed to download resume', 
        details: `${fileResponse.status} ${fileResponse.statusText}` 
      });
    }
    
    // Convert to buffer for pdf-parse
    const fileBuffer = await fileResponse.arrayBuffer();
    console.log(`API: File downloaded successfully, size: ${fileBuffer.byteLength} bytes`);
    
    // Check if it's a PDF
    if (!resume.file_type?.includes('pdf')) {
      console.error(`API: Unsupported file type: ${resume.file_type}`);
      console.groupEnd();
      return res.status(400).json({ 
        error: 'Unsupported file type', 
        details: 'Currently only PDF files are supported' 
      });
    }
    
    // Parse the PDF
    console.log('API: Parsing PDF file...');
    try {
      const pdfData = await pdf(Buffer.from(fileBuffer));
      const extractedText = pdfData.text || '';
      
      console.log(`API: PDF parsed successfully, extracted ${extractedText.length} characters`);
      
      if (extractedText.length === 0) {
        console.warn('API: Warning - No text extracted from PDF, it may be an image-based PDF');
      }
      
      console.log('API: Returning extracted text');
      console.groupEnd();
      
      return res.status(200).json({
        success: true,
        resumeId,
        fileName: resume.file_name,
        fileType: resume.file_type,
        textLength: extractedText.length,
        text: extractedText
      });
      
    } catch (pdfError) {
      console.error('API: Error parsing PDF:', pdfError);
      console.groupEnd();
      return res.status(500).json({
        error: 'Failed to parse PDF',
        details: pdfError instanceof Error ? pdfError.message : String(pdfError)
      });
    }
    
  } catch (error) {
    console.error('API: Unexpected error parsing resume:', error);
    console.groupEnd();
    return res.status(500).json({
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 