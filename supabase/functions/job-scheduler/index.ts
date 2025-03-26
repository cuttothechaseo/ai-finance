import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

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
      .limit(5); // Process up to 5 jobs at a time
    
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
    
    // Process each pending job
    const results = await Promise.all(
      pendingJobs.map(async (job) => {
        try {
          console.log(`Scheduler: Processing job: ${job.id}`);
          
          // Invoke the job processor function
          const { data, error } = await supabase.functions.invoke('process-analysis-job', {
            body: { jobId: job.id }
          });
          
          if (error) {
            console.error(`Scheduler: Error processing job ${job.id}:`, error);
            return { jobId: job.id, success: false, error: error.message };
          }
          
          console.log(`Scheduler: Job ${job.id} processing initiated successfully`);
          return { jobId: job.id, success: true };
        } catch (err) {
          console.error(`Scheduler: Unexpected error processing job ${job.id}:`, err);
          return { jobId: job.id, success: false, error: err instanceof Error ? err.message : String(err) };
        }
      })
    );
    
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