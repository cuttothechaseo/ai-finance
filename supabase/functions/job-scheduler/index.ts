import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment variables
const SUPABASE_URL = Deno.env.get("PROJECT_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  // Create Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    console.log('Scheduler: Starting job scheduler');
    
    // Get all pending jobs
    const { data: pendingJobs, error: queryError } = await supabase
      .from('analysis_jobs')
      .select('id')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(2); // Reduced from 5 to 2 jobs at a time to avoid rate limits
    
    if (queryError) {
      console.error('Scheduler: Error querying pending jobs:', queryError);
      throw queryError;
    }
    
    console.log(`Scheduler: Found ${pendingJobs?.length || 0} pending jobs`);
    
    // No pending jobs, nothing to do
    if (!pendingJobs || pendingJobs.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending jobs found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Process each pending job with a delay between jobs
    const results = [];
    for (const job of pendingJobs) {
      try {
        console.log(`Scheduler: Processing job: ${job.id}`);
        
        // Call the process-analysis-job function directly via HTTP
        const response = await fetch(`${SUPABASE_URL}/functions/v1/process-analysis-job`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({ jobId: job.id })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Scheduler: Error response from job processor for ${job.id}:`, errorText);
          results.push({ jobId: job.id, success: false, error: `HTTP ${response.status}: ${errorText}` });
        } else {
          const result = await response.json();
          console.log(`Scheduler: Job ${job.id} processing initiated successfully`);
          results.push({ jobId: job.id, success: true, result });
        }
        
        // Add a delay between jobs to respect rate limits
        if (pendingJobs.indexOf(job) < pendingJobs.length - 1) {
          console.log('Scheduler: Waiting 30 seconds before processing next job...');
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
      } catch (err) {
        console.error(`Scheduler: Unexpected error processing job ${job.id}:`, err);
        results.push({ jobId: job.id, success: false, error: err instanceof Error ? err.message : String(err) });
      }
    }
    
    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} jobs`,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Scheduler: Unexpected error in job scheduler:', error);
    
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : String(error)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}); 