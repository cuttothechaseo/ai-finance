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
  model: "claude-3-5-sonnet", // Using Claude 3.5 Sonnet for better performance
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
  options?: Partial<ResumeAnalysisRequest>
): Promise<ResumeAnalysisResult> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("Anthropic API key is not configured");
    }

    // Construct the prompt for Claude
    const prompt = constructResumeAnalysisPrompt(resumeText, options);

    // Call Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: defaultClaudeOptions.model,
        max_tokens: defaultClaudeOptions.max_tokens,
        temperature: defaultClaudeOptions.temperature,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Claude API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Parse the response content as JSON
    try {
      // The response is in the message content
      const content = data.content[0].text;
      const analysisResult = JSON.parse(content);
      
      // Validate the required fields
      if (!analysisResult.overallScore || !analysisResult.summary) {
        throw new Error("Invalid analysis result format");
      }
      
      return analysisResult;
    } catch (parseError) {
      console.error("Failed to parse Claude response:", parseError);
      throw new Error("Failed to parse analysis results");
    }
  } catch (error) {
    console.error("Resume analysis failed:", error);
    throw error;
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
 * Saves analysis results to Supabase
 */
export async function saveResumeAnalysis(
  resumeId: string,
  userId: string,
  analysis: ResumeAnalysisResult,
  supabaseClient: any
) {
  try {
    const { data, error } = await supabaseClient
      .from('resume_analyses')
      .insert([
        {
          resume_id: resumeId,
          user_id: userId,
          overall_score: analysis.overallScore,
          summary: analysis.summary,
          strengths: analysis.strengths,
          areas_for_improvement: analysis.areasForImprovement,
          content_quality: analysis.contentQuality,
          formatting: analysis.formatting,
          industry_relevance: analysis.industryRelevance,
          impact_statements: analysis.impactStatements,
          suggested_edits: analysis.suggestedEdits,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to save resume analysis:", error);
    throw error;
  }
} 