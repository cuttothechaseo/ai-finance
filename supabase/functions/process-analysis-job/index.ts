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
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") || "";

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
        
        // Instead of trying to parse the PDF in the Edge Function,
        // call our dedicated serverless function for PDF parsing
        const baseUrl = Deno.env.get('NEXT_PUBLIC_BASE_URL') || 'http://localhost:3000';
        const parseUrl = `${baseUrl}/api/parse-resume-pdf`;
        
        console.log(`Calling PDF parsing API at ${parseUrl}`);
        
        const parseResponse = await fetch(parseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Edge-Secret': SUPABASE_SERVICE_ROLE_KEY // Use special header for Edge Function authentication
          },
          body: JSON.stringify({
            resumeId: resume.id,
            resumeUrl: resume.resume_url
          })
        });
        
        if (!parseResponse.ok) {
          const errorText = await parseResponse.text();
          console.error(`Failed to parse PDF: ${parseResponse.status} ${parseResponse.statusText}`);
          console.error(`Error details: ${errorText}`);
          await updateJobFailed(supabase, jobId, `Failed to parse resume: ${parseResponse.status} ${parseResponse.statusText}`);
          return { error: 'Failed to parse resume file' };
        }
        
        const parseResult = await parseResponse.json();
        
        if (!parseResult.success || !parseResult.text) {
          console.error(`PDF parsing failed: ${JSON.stringify(parseResult.error || {})}`);
          await updateJobFailed(supabase, jobId, `Failed to extract text from resume: ${parseResult.details || 'Unknown error'}`);
          return { error: 'Failed to extract text from resume' };
        }
        
        resumeText = parseResult.text;
        console.log(`File parsed successfully via API, text length: ${resumeText.length} characters`);
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
    
    // 6. Call Gemini API to analyze the resume
    try {
      console.log(`Calling Gemini API for analysis...`);
      const analysisResult = await analyzeResume(resumeText, {
        jobRole: job.job_role,
        industry: job.industry,
        experienceLevel: job.experience_level
      });
      
      console.log(`Gemini analysis complete`);
      
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
      console.error(`Error in Gemini analysis:`, analysisError);
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

// Helper function to call Gemini API (replaces Claude)
async function analyzeResume(resumeText, options) {
  const GEMINI_API_KEY = Deno.env.get("GOOGLE_GENERATIVE_AI_API_KEY");
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing');
  }

  console.log(`Preparing Gemini API request with text length: ${resumeText.length}`);

  // Construct the system prompt
  const systemPrompt = constructSystemPrompt(options);

  // Gemini expects a 'system_instruction' and 'contents' array
  const requestBody = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: [
      {
        role: "user",
        parts: [{ text: resumeText }]
      }
    ],
    generationConfig: {
      temperature: 0.0,
      maxOutputTokens: 4000,
      topP: 0.95
    }
  };

  // Call the Gemini API
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    }
  );

  console.log(`Gemini API response status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    let errorDetails = "";
    try {
      const errorText = await response.text();
      errorDetails = `: ${errorText}`;
    } catch (e) {
      // Ignore error reading response body
    }
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}${errorDetails}`);
  }

  const result = await response.json();
  console.log(`Gemini API response received successfully`);

  try {
    // Gemini's response: result.candidates[0].content.parts[0].text
    const content = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error("No content in Gemini response");
    console.log(`Raw Gemini response: ${content.substring(0, 200)}...`);

    // Try to extract JSON if it's wrapped in markdown code blocks or has extra text
    let jsonContent = content;
    const jsonBlockMatch = content.match(/```(?:json)?\\s*(\{[\s\S]*?\})\\s*```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      console.log("Found JSON in code block, extracting...");
      jsonContent = jsonBlockMatch[1];
    } else {
      // Look for JSON object pattern if not in code blocks
      const jsonObjectMatch = content.match(/(\{[\s\S]*\})/);
      if (jsonObjectMatch && jsonObjectMatch[1]) {
        console.log("Found JSON object pattern, extracting...");
        jsonContent = jsonObjectMatch[1];
      }
    }
    try {
      return JSON.parse(jsonContent);
    } catch (innerParseError) {
      console.error("Failed to parse extracted JSON, attempting fallback extraction");
      return constructFallbackResponse(content);
    }
  } catch (parseError) {
    console.error(`Error parsing Gemini response:`, parseError);
    throw new Error(`Failed to parse Gemini response: ${parseError.message}`);
  }
}

// Fallback function to extract meaningful content from a non-JSON response
function constructFallbackResponse(text) {
  console.log("Constructing fallback response from text");
  
  // Create a basic structure with default values
  const fallback = {
    overallScore: 50,
    summary: "Analysis generated from non-structured response.",
    strengths: [],
    areasForImprovement: [],
    contentQuality: {
      score: 50,
      feedback: "Please see summary for details.",
      suggestions: []
    },
    formatting: {
      score: 50,
      feedback: "Please see summary for details.",
      suggestions: []
    },
    industryRelevance: {
      score: 50,
      feedback: "Please see summary for details.",
      suggestions: []
    },
    impactStatements: {
      score: 50,
      feedback: "Please see summary for details.",
      suggestions: []
    },
    suggestedEdits: [],
    rawAnalysis: ""
  };
  
  // Add the full text as raw content
  fallback.rawAnalysis = text;
  
  return fallback;
}

// Helper function to construct system prompt
function constructSystemPrompt(options) {
  const jobRole = options.jobRole || "finance professional";
  const industry = options.industry || "finance";
  const experienceLevel = options.experienceLevel || "not specified";

  return `
You are a resume analysis system that MUST respond ONLY with valid JSON.
Your task is to analyze the following resume for a ${jobRole} position in the ${industry} industry with ${experienceLevel} experience level.

RESPONSE FORMAT INSTRUCTIONS:
1. You MUST respond ONLY with a valid JSON object.
2. Do NOT include any text outside the JSON object.
3. Do NOT use markdown formatting, code blocks, or any explanatory text.
4. Do NOT include phrases like "Here's the JSON:" or "Thank you for providing this resume".
5. ONLY return the raw JSON object that matches the structure below.

The JSON must match exactly this structure:
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

REMINDER: Your response MUST be ONLY the JSON object with no additional text before or after.
`;
} 