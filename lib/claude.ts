import { createClient } from '@supabase/supabase-js';

// Types for Claude API
export interface ClaudeRequestOptions {
  model: string;
  max_tokens: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  stop_sequences?: string[];
}

export interface ResumeAnalysisRequest {
  resumeText: string;
  jobRole?: string;
  industry?: string;
  experienceLevel?: string;
}

export interface ResumeAnalysisResult {
  overallScore: number; // 0-100
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  contentQuality: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
  formatting: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
  industryRelevance: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
  impactStatements: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
  suggestedEdits: {
    original: string;
    improved: string;
    explanation: string;
  }[];
}

// Default Claude configuration for resume analysis
const defaultClaudeOptions: ClaudeRequestOptions = {
  model: "claude-3-5-sonnet-20240620", // Using Claude 3.5 Sonnet for better performance
  max_tokens: 4000,
  temperature: 0.7,
  top_p: 0.95,
};

/**
 * Analyzes a resume using Claude API
 * @param resumeText The text content of the resume
 * @param options Additional context for analysis
 * @returns Structured analysis of the resume
 */
export async function analyzeResume(
  resumeText: string,
  options: {
    jobRole?: string;
    industry?: string;
    experienceLevel?: string;
  } = {}
): Promise<ResumeAnalysisResult> {
  // Validate environment variables
  const envVars = {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    NODE_ENV: process.env.NODE_ENV
  };
  
  console.log('API: Environment check:', {
    ANTHROPIC_API_KEY_SET: !!envVars.ANTHROPIC_API_KEY,
    ANTHROPIC_API_KEY_LENGTH: envVars.ANTHROPIC_API_KEY?.length,
    NODE_ENV: envVars.NODE_ENV
  });

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Anthropic API key is missing');
    throw new Error('Anthropic API configuration error');
  }
  
  // Log that we have an API key (without revealing it)
  console.log('API: Claude API key is configured, length:', process.env.ANTHROPIC_API_KEY.length);

  // Construct the prompt
  const systemPrompt = constructSystemPrompt(options);
  const userPrompt = resumeText;
  
  // Log the prompt length for debugging
  console.log('API: Claude prompt constructed, length:', systemPrompt.length + userPrompt.length);
  
  // Log that we're making the request
  console.log('API: Making Claude API request...');
  console.log('API: Using Claude API key length:', process.env.ANTHROPIC_API_KEY?.length);
  console.log('API: Request payload:', {
    model: "claude-3-opus-20240229",
    max_tokens: 4000,
    temperature: 0,
    systemPromptLength: systemPrompt.length,
    userPromptLength: userPrompt.length
  });

  // Call the Claude API
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      temperature: 0,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt
        }
      ]
    })
  }).catch(error => {
    console.error('API: Network error calling Claude API:', error);
    throw new Error(`Network error calling Claude API: ${error.message}`);
  });

  // Log the response status
  console.log('API: Claude API response received, status:', response.status, response.statusText);

  // Handle error response
  if (!response.ok) {
    // Get response body for better error details
    let errorBody = '';
    try {
      errorBody = await response.text();
      console.error('API: Claude API error details:', errorBody);
    } catch (e) {
      console.error('API: Could not read Claude API error response body');
    }
    
    throw new Error(`Claude API error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  // Parse the response
  const result = await response.json();

  // Extract the content from the assistant's message
  try {
    const content = result.content[0].text;
    const parsedResult = JSON.parse(content) as ResumeAnalysisResult;
    
    // Log success
    console.log('API: Claude response successfully parsed into JSON');
    
    return parsedResult;
  } catch (e) {
    console.error('API: Error parsing Claude response:', e);
    console.error('API: Response structure:', JSON.stringify(result, null, 2));
    throw new Error('Failed to parse Claude response');
  }
}

/**
 * Constructs a detailed prompt for Claude to analyze a resume
 */
function constructResumeAnalysisPrompt(
  resumeText: string,
  options?: Partial<ResumeAnalysisRequest>
): string {
  const jobRole = options?.jobRole || "finance professional";
  const industry = options?.industry || "finance";
  const experienceLevel = options?.experienceLevel || "not specified";

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

RESUME TEXT:
${resumeText}
`;
}

/**
 * Constructs a system prompt for Claude based on the given options
 */
function constructSystemPrompt(options: {
  jobRole?: string;
  industry?: string;
  experienceLevel?: string;
}): string {
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

/**
 * Saves analysis results to Supabase
 */
export async function saveResumeAnalysis(
  resumeId: string, 
  userId: string, 
  analysisResult: ResumeAnalysisResult,
  supabaseClient: any
) {
  if (!supabaseClient) {
    console.error('API: No Supabase client provided to saveResumeAnalysis');
    throw new Error('Database client error');
  }

  console.log(`API: Saving analysis for resume ${resumeId}, user ${userId.slice(0, 8)}...`);
  
  try {
    // First, check if an analysis already exists for this resume
    const { data: existingAnalysis, error: queryError } = await supabaseClient
      .from('resume_analyses')
      .select('id')
      .eq('resume_id', resumeId)
      .single();

    if (queryError && !queryError.message.includes('No rows found')) {
      console.error('API: Error checking for existing analysis:', queryError);
      throw new Error('Failed to check for existing analysis');
    }

    let result;
    
    // If an analysis exists, update it
    if (existingAnalysis) {
      console.log('API: Updating existing analysis record');
      result = await supabaseClient
        .from('resume_analyses')
        .update({
          analysis_result: analysisResult,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingAnalysis.id);
    } 
    // Otherwise, create a new record
    else {
      console.log('API: Creating new analysis record');
      result = await supabaseClient
        .from('resume_analyses')
        .insert({
          resume_id: resumeId,
          user_id: userId,
          analysis_result: analysisResult,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }

    if (result.error) {
      console.error('API: Error saving analysis:', result.error);
      throw new Error('Failed to save analysis to database');
    }

    console.log('API: Analysis saved successfully');
    return true;
  } catch (error) {
    console.error('API: Error in saveResumeAnalysis:', error);
    throw error;
  }
} 