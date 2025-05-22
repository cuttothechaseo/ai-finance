import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  console.group('API: Trigger job processing request');
  
  // Verify API key (to prevent unauthorized triggers)
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.JOB_TRIGGER_API_KEY;
  
  if (!apiKey || apiKey !== validApiKey) {
    console.error('API: Invalid or missing API key');
    console.groupEnd();
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  
  try {
    console.log('API: Invoking job-scheduler Edge Function');
    
    // Call the job-scheduler Edge Function
    const { data, error } = await supabase.functions.invoke('job-scheduler', {
      // We can pass options if needed in the future
      body: { triggered_at: new Date().toISOString() }
    });
    
    if (error) {
      console.error('API: Error invoking job-scheduler:', error);
      console.groupEnd();
      return res.status(500).json({ 
        error: 'Failed to trigger job processing', 
        details: error.message 
      });
    }
    
    console.log('API: Job-scheduler invoked successfully:', data);
    console.groupEnd();
    
    return res.status(200).json({
      success: true,
      message: 'Job processing triggered successfully',
      result: data
    });
    
  } catch (error) {
    console.error('API: Unexpected error triggering job processing:', error);
    console.groupEnd();
    
    return res.status(500).json({
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 