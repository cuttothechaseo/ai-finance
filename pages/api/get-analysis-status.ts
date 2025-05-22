import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  console.group('API: Get analysis status request received');
  
  const { jobId } = req.query;
  
  if (!jobId || typeof jobId !== 'string') {
    console.error('API: No job ID provided in request');
    console.groupEnd();
    return res.status(400).json({ error: 'Job ID is required' });
  }
  
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
    
    // Get job status
    console.log(`API: Getting job status for ID: ${jobId}`);
    const { data: job, error: jobError } = await supabase
      .from('analysis_jobs')
      .select('*')
      .eq('id', jobId)
      .eq('user_id', userId)
      .single();
      
    if (jobError || !job) {
      console.error('API: Job not found or not owned by user:', jobError);
      console.groupEnd();
      return res.status(404).json({ 
        error: 'Job not found', 
        details: jobError?.message || 'Job not found or not owned by user' 
      });
    }
    
    console.log(`API: Job found with status: ${job.status}`);
    
    // Build response based on job status
    const response: any = {
      jobId: job.id,
      status: job.status,
      resumeId: job.resume_id,
      createdAt: job.created_at,
      updatedAt: job.updated_at
    };
    
    // If job is completed, include the result
    if (job.status === 'completed' && job.completed_at) {
      response.completedAt = job.completed_at;
      response.result = job.result;
      console.log('API: Returning completed job with analysis results');
    }
    
    // If job is still processing, include the time in processing
    if (job.status === 'processing') {
      const processingTime = new Date().getTime() - new Date(job.updated_at).getTime();
      response.processingTimeMs = processingTime;
      response.processingTimeSec = Math.round(processingTime / 1000);
      console.log(`API: Job still processing (${response.processingTimeSec}s so far)`);
    }
    
    // If job failed, include the error message
    if (job.status === 'failed') {
      response.error = job.error_message || 'Unknown error occurred during analysis';
      console.log('API: Returning failed job with error details');
    }
    
    console.log('API: Returning job status to client');
    console.groupEnd();
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('API: Unexpected error getting job status:', error);
    console.groupEnd();
    return res.status(500).json({ 
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 