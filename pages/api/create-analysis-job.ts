import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  console.group('API: Create analysis job request received');
  
  const { resumeId, jobRole, industry, experienceLevel } = req.body;
  
  if (!resumeId) {
    console.error('API: No resume ID provided in request');
    console.groupEnd();
    return res.status(400).json({ error: 'Resume ID is required' });
  }
  
  // Create Supabase client
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
      .select('id, user_id')
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
    
    console.log('API: Resume ownership verified, creating analysis job');
    
    // Create a new job
    const { data: job, error: jobError } = await supabase
      .from('analysis_jobs')
      .insert([{
        resume_id: resumeId,
        user_id: userId,
        status: 'pending',
        job_role: jobRole,
        industry: industry,
        experience_level: experienceLevel,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (jobError) {
      console.error('API: Error creating job:', jobError);
      console.groupEnd();
      return res.status(500).json({ error: 'Failed to create analysis job', details: jobError.message });
    }
    
    console.log(`API: Job created successfully with ID: ${job.id}`);
    
    // Don't invoke the Edge Function directly - this causes timeouts
    // The job will be processed by a scheduler or a webhook trigger
    
    console.log('API: Returning success response to client');
    console.groupEnd();
    return res.status(200).json({ 
      jobId: job.id,
      status: 'pending',
      message: 'Analysis job created successfully'
    });
    
  } catch (error) {
    console.error('API: Unexpected error creating analysis job:', error);
    console.groupEnd();
    return res.status(500).json({ 
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 