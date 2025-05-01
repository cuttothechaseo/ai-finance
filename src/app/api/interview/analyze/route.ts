import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

// Add at the top of the file after imports

interface TranscriptMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Function to validate transcript quality
function validateTranscript(transcript: TranscriptMessage[]): { isValid: boolean; reason?: string } {
  if (!Array.isArray(transcript)) {
    return { isValid: false, reason: "Transcript must be an array" };
  }

  if (transcript.length < 4) {
    return { isValid: false, reason: "Transcript too short" };
  }

  // Check for required message types
  const hasUserResponses = transcript.some(msg => msg.role === 'user');
  const hasAssistantQuestions = transcript.some(msg => msg.role === 'assistant');

  if (!hasUserResponses || !hasAssistantQuestions) {
    return { isValid: false, reason: "Transcript missing user responses or interviewer questions" };
  }

  // Check for truncated or very short responses
  const shortResponses = transcript.filter(msg => 
    msg.role === 'user' && msg.content && msg.content.length < 10
  );

  if (shortResponses.length > transcript.filter(msg => msg.role === 'user').length / 2) {
    return { isValid: false, reason: "Too many short or truncated responses" };
  }

  return { isValid: true };
}

// Function to analyze interview transcript
async function analyzeInterview(interview: any, transcript: TranscriptMessage[]) {
  try {
    // Validate transcript quality
    const validation = validateTranscript(transcript);
    if (!validation.isValid) {
      throw new Error(`Invalid transcript: ${validation.reason}`);
    }

    console.log("Starting interview analysis for session with transcript:", 
      JSON.stringify({
        interview_id: interview.id,
        role: interview.role,
        company: interview.company,
        type: interview.interview_type,
        transcript_length: JSON.stringify(transcript).length,
        message_count: transcript.length,
        user_message_count: transcript.filter(m => m.role === 'user').length
      })
    );

    // Enhanced prompt with better handling of potentially incomplete transcripts
    const prompt = `Analyze this interview transcript for a ${interview.role} position at ${interview.company}.
    
    Interview Type: ${interview.interview_type}
    Questions: ${JSON.stringify(interview.questions)}
    Transcript: ${JSON.stringify(transcript)}
    
    You are an expert interviewer and career coach. Analyze the interview responses and provide a comprehensive evaluation.
    Focus on both the content of the answers and the communication style.
    
    Important considerations:
    1. If responses are truncated or incomplete, focus on evaluating what is available
    2. Consider the coherence and flow of the conversation
    3. Evaluate both technical knowledge and communication skills
    4. Account for interview completeness in your scoring
    
    Return your analysis in this exact JSON format:
    {
      "overall_score": number (0-100),
      "technical_score": number (0-100) or null if not applicable,
      "behavioral_score": number (0-100) or null if not applicable,
      "communication_score": number (0-100),
      "confidence_score": number (0-100),
      "analysis_summary": "detailed text explanation including notes about any limitations in the transcript",
      "strengths": ["strength1", "strength2", ...],
      "areas_for_improvement": ["area1", "area2", ...],
      "detailed_feedback": {
        "question_responses": [{
          "question": "question text",
          "response_quality": "detailed feedback",
          "score": number (0-100)
        }],
        "communication_analysis": "detailed feedback including notes about response completeness",
        "technical_proficiency": "detailed feedback if applicable",
        "behavioral_insights": "detailed feedback if applicable",
        "transcript_quality_notes": "notes about any transcript limitations or issues"
      }
    }
    
    Ensure all scores are numbers between 0 and 100. Do not include any explanatory text outside the JSON structure.`;

    console.log("Sending analysis request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Remove markdown code block if present
    text = text.replace(/```json\n|\n```/g, "").trim();
    console.log("Received raw analysis response:", text.substring(0, 200) + "...");
    
    try {
      const analysis = JSON.parse(text);
      
      // Validate the analysis structure
      const requiredFields = [
        'overall_score',
        'communication_score',
        'confidence_score',
        'analysis_summary',
        'strengths',
        'areas_for_improvement',
        'detailed_feedback'
      ];
      
      const missingFields = requiredFields.filter(field => {
        const value = analysis[field];
        return value === undefined || value === null || 
               (typeof value === 'number' && (isNaN(value) || value < 0 || value > 100));
      });
      
      if (missingFields.length > 0) {
        throw new Error(`Invalid or missing fields in analysis: ${missingFields.join(', ')}`);
      }
      
      // Validate arrays are present
      if (!Array.isArray(analysis.strengths) || !Array.isArray(analysis.areas_for_improvement)) {
        throw new Error("Strengths and areas_for_improvement must be arrays");
      }
      
      // Validate detailed_feedback structure
      if (!analysis.detailed_feedback || typeof analysis.detailed_feedback !== 'object') {
        throw new Error("Missing or invalid detailed_feedback object");
      }
      
      console.log("Analysis validation successful");
      return analysis;
    } catch (parseError) {
      console.error("Failed to parse or validate analysis:", parseError);
      console.error("Raw text causing error:", text);
      throw new Error(`Failed to parse generated analysis: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
  } catch (error) {
    console.error("Error in analyzeInterview function:", error);
    throw error;
  }
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Extract authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token with Supabase
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Request body parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { session_id } = body;

    // Validate required fields
    if (!session_id) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    console.log(`Processing analysis request for session: ${session_id}`);

    // Check if analysis already exists
    const { data: existingAnalysis } = await supabase
      .from("interview_analyses")
      .select("id")
      .eq("session_id", session_id)
      .single();

    if (existingAnalysis) {
      console.log(`Analysis already exists for session ${session_id}`);
      return NextResponse.json(
        { error: "Analysis already exists for this session" },
        { status: 409 }
      );
    }

    // Fetch interview session and related interview data
    const { data: session, error: sessionError } = await supabase
      .from('interview_sessions')
      .select(`
        *,
        generated_interviews (
          *
        )
      `)
      .eq('id', session_id)
      .single();

    if (sessionError || !session) {
      console.error("Session fetch error:", sessionError);
      return NextResponse.json(
        { error: "Failed to fetch interview session" },
        { status: 404 }
      );
    }

    // Verify session is completed
    if (session.status !== 'completed') {
      return NextResponse.json(
        { error: "Interview session is not completed" },
        { status: 400 }
      );
    }

    // Verify transcript exists and has content
    if (!session.transcript || typeof session.transcript !== 'object') {
      console.error("Invalid transcript format:", session.transcript);
      return NextResponse.json(
        { error: "Invalid or missing transcript data" },
        { status: 400 }
      );
    }

    // Generate analysis
    let analysis;
    try {
      analysis = await analyzeInterview(session.generated_interviews, session.transcript);
    } catch (apiError: any) {
      console.error("Analysis generation error:", apiError);
      return NextResponse.json(
        { error: apiError.message || "Failed to generate analysis" },
        { status: 500 }
      );
    }

    // Store analysis in Supabase
    try {
      console.log("Storing analysis in database...");
      const { data: savedAnalysis, error: dbError } = await supabase
        .from("interview_analyses")
        .insert({
          session_id,
          overall_score: analysis.overall_score,
          technical_score: analysis.technical_score,
          behavioral_score: analysis.behavioral_score,
          communication_score: analysis.communication_score,
          confidence_score: analysis.confidence_score,
          analysis_summary: analysis.analysis_summary,
          strengths: analysis.strengths,
          areas_for_improvement: analysis.areas_for_improvement,
          detailed_feedback: analysis.detailed_feedback,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error("Database insert error:", dbError);
        throw dbError;
      }

      console.log("Analysis stored successfully, updating interview status...");

      // Update interview status to analyzed
      const { error: updateError } = await supabase
        .from("generated_interviews")
        .update({ status: "analyzed" })
        .eq('id', session.generated_interviews.id);

      if (updateError) {
        console.error("Failed to update interview status:", updateError);
        // Don't throw here, as the analysis was saved successfully
      }

      return NextResponse.json(savedAnalysis);
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: `Failed to save analysis: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Unhandled error in analysis endpoint:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 