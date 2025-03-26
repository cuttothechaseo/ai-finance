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
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { jobId } = await req.json();
    
    if (!jobId) {
      return new Response(
        JSON.stringify({ error: 'Job ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Process the job
    const result = await processJob(supabase, jobId);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing job:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function processJob(supabase, jobId) {
  try {
    console.log(`Starting job processing: ${jobId}`);
    
    // 1. Get the job details
    const { data: job, error } = await supabase
      .from('analysis_jobs')
      .select('*')
      .eq('id', jobId)
      .single();
      
    if (error || !job) {
      console.error(`Job not found: ${jobId}`, error);
      return { error: 'Job not found' };
    }
    
    console.log(`Job found: ${job.id}, resume: ${job.resume_id}`);
    
    // 2. Update job status to processing
    await supabase
      .from('analysis_jobs')
      .update({ 
        status: 'processing', 
        updated_at: new Date().toISOString(),
        error_message: null // Clear any previous errors
      })
      .eq('id', jobId);
    
    console.log(`Job status updated to processing`);
    
    // 3. Get resume details
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', job.resume_id)
      .single();
      
    if (resumeError || !resume) {
      console.error(`Resume not found: ${job.resume_id}`, resumeError);
      await updateJobFailed(supabase, jobId, 'Resume not found');
      return { error: 'Resume not found' };
    }
    
    console.log(`Resume found: ${resume.id}, file: ${resume.file_name}`);
    
    // 4. Get resume file content
    let fileData;
    let resumeText;
    
    try {
      if (resume.resume_url) {
        console.log(`Fetching file from URL: ${resume.resume_url.substring(0, 50)}...`);
        const response = await fetch(resume.resume_url);
        
        if (!response.ok) {
          console.error(`Failed to download file: ${response.status} ${response.statusText}`);
          await updateJobFailed(supabase, jobId, `Failed to download resume file: ${response.status} ${response.statusText}`);
          return { error: 'Failed to download resume file' };
        }
        
        fileData = await response.arrayBuffer();
        console.log(`File fetched, size: ${fileData.byteLength} bytes`);
        
        // 5. Parse the file to extract text
        resumeText = await parseFile(fileData, resume.file_type || 'application/pdf');
        console.log(`File parsed, text length: ${resumeText.length} characters`);
      } else {
        console.error(`No resume URL found for resume: ${resume.id}`);
        await updateJobFailed(supabase, jobId, 'No resume URL found');
        return { error: 'No resume URL found' };
      }
    } catch (fileError) {
      console.error(`Error processing file:`, fileError);
      await updateJobFailed(supabase, jobId, `Error processing file: ${fileError.message}`);
      return { error: `Error processing file: ${fileError.message}` };
    }
    
    // 6. Call Claude API to analyze the resume
    try {
      console.log(`Calling Claude API for analysis...`);
      const analysisResult = await analyzeResume(resumeText, {
        jobRole: job.job_role,
        industry: job.industry,
        experienceLevel: job.experience_level
      });
      
      console.log(`Claude analysis complete`);
      
      // 7. Update job as completed
      await supabase
        .from('analysis_jobs')
        .update({
          status: 'completed',
          result: analysisResult,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);
      
      console.log(`Job marked as completed`);
      
      // 8. Also save to resume_analyses table for backward compatibility
      try {
        await supabase
          .from('resume_analyses')
          .upsert({
            resume_id: job.resume_id,
            user_id: job.user_id,
            analysis_result: analysisResult,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'resume_id'
          });
        
        console.log(`Analysis saved to resume_analyses table`);
      } catch (upsertError) {
        // Log but don't fail - this is just for backward compatibility
        console.error(`Error saving to resume_analyses:`, upsertError);
      }
      
      return { success: true, jobId };
    } catch (analysisError) {
      console.error(`Error in Claude analysis:`, analysisError);
      await updateJobFailed(supabase, jobId, `Analysis error: ${analysisError.message}`);
      return { error: `Analysis error: ${analysisError.message}` };
    }
    
  } catch (error) {
    console.error(`Unexpected error in job processing:`, error);
    await updateJobFailed(supabase, jobId, error.message);
    return { error: error.message };
  }
}

async function updateJobFailed(supabase, jobId, errorMessage) {
  try {
    await supabase
      .from('analysis_jobs')
      .update({
        status: 'failed',
        error_message: errorMessage,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    console.log(`Job ${jobId} marked as failed: ${errorMessage}`);
  } catch (error) {
    console.error(`Error updating job failure status:`, error);
  }
}

// Helper function to parse file content
async function parseFile(fileBuffer, contentType) {
  // This is a simplified version - in a real implementation, we would
  // need to properly parse different file types
  
  console.log(`Parsing file of type: ${contentType}`);
  
  // For PDF files, we would use a PDF parsing library
  if (contentType.includes('pdf')) {
    // Simplified implementation - in reality, we would use a proper PDF parser
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(fileBuffer).substring(0, 500) + 
      "\n[PDF CONTENT WOULD BE EXTRACTED HERE]\n" +
      "This is a placeholder for the actual PDF content that would be extracted";
  }
  
  // For plain text files
  if (contentType.includes('text')) {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(fileBuffer);
  }
  
  // For Word documents, we would use a DOCX parsing library
  if (contentType.includes('word') || contentType.includes('docx')) {
    return "[WORD DOCUMENT CONTENT WOULD BE EXTRACTED HERE]";
  }
  
  // Default fallback
  return "The resume content would be extracted here based on the file type.";
}

// Helper function to call Claude API
async function analyzeResume(resumeText, options) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key is missing');
  }

  console.log(`Preparing Claude API request with text length: ${resumeText.length}`);

  // Call the Claude API
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      temperature: 0,
      system: constructSystemPrompt(options),
      messages: [
        {
          role: "user",
          content: resumeText
        }
      ]
    })
  });

  console.log(`Claude API response status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    let errorDetails = "";
    try {
      const errorText = await response.text();
      errorDetails = `: ${errorText}`;
    } catch (e) {
      // Ignore error reading response body
    }
    
    throw new Error(`Claude API error: ${response.status} ${response.statusText}${errorDetails}`);
  }

  const result = await response.json();
  console.log(`Claude API response received successfully`);
  
  try {
    const content = result.content[0].text;
    return JSON.parse(content);
  } catch (parseError) {
    console.error(`Error parsing Claude response:`, parseError);
    throw new Error(`Failed to parse Claude response: ${parseError.message}`);
  }
}

// Helper function to construct system prompt
function constructSystemPrompt(options) {
  const jobRole = options.jobRole || "finance professional";
  const industry = options.industry || "finance";
  const experienceLevel = options.experienceLevel || "not specified";

  return `
I need you to analyze the following resume for a ${jobRole} position in the ${industry} industry with ${experienceLevel} experience level.

Please provide a comprehensive analysis in JSON format with the following structure:
{
  "overallScore": number between 0-100,
  "summary": "Brief overview of the resume's strengths and weaknesses",
  "strengths": ["strength1", "strength2", ...],
  "areasForImprovement": ["area1", "area2", ...],
  "contentQuality": {
    "score": number between 0-100,
    "feedback": "Detailed feedback on content quality",
    "suggestions": ["suggestion1", "suggestion2", ...]
  },
  "formatting": {
    "score": number between 0-100,
    "feedback": "Detailed feedback on formatting and structure",
    "suggestions": ["suggestion1", "suggestion2", ...]
  },
  "industryRelevance": {
    "score": number between 0-100,
    "feedback": "Detailed feedback on industry relevance",
    "suggestions": ["suggestion1", "suggestion2", ...]
  },
  "impactStatements": {
    "score": number between 0-100,
    "feedback": "Detailed feedback on impact statements and quantifiable achievements",
    "suggestions": ["suggestion1", "suggestion2", ...]
  },
  "suggestedEdits": [
    {
      "original": "Original text from resume",
      "improved": "Improved version of the text",
      "explanation": "Why this change improves the resume"
    },
    ...additional suggested edits
  ]
}

Focus on finance-specific improvements like quantifying achievements, highlighting relevant skills, and using industry terminology appropriately.
`;
} 