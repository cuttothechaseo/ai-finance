import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = 'force-dynamic';

// Validate if interview exists
async function validateInterview(interviewId: string) {
  console.log("[API] Validating interview existence:", { interviewId });
  
  const { data, error } = await supabase
    .from("generated_interviews")
    .select("id")
    .eq("id", interviewId)
    .single();

  if (error) {
    console.error("[API] Error validating interview:", {
      error,
      errorMessage: error.message,
      errorCode: error.code,
      interviewId
    });
    throw new Error(`Interview validation failed: ${error.message}`);
  }

  if (!data) {
    console.error("[API] Interview not found:", { interviewId });
    throw new Error("Interview not found");
  }

  console.log("[API] Interview validated successfully:", { interviewId });
  return true;
}

// Validate transcript format
function validateTranscript(transcript: any) {
  console.log("[API] Starting transcript validation");
  try {
    let parsedTranscript;
    // If transcript is a string, try to parse it
    if (typeof transcript === 'string') {
      console.log("[API] Transcript is string, attempting to parse");
      parsedTranscript = JSON.parse(transcript);
    } else {
      console.log("[API] Transcript is object, attempting to stringify");
      // If it's already an object, verify it can be stringified
      JSON.stringify(transcript);
      parsedTranscript = transcript;
    }

    // Additional validation for transcript structure
    if (!Array.isArray(parsedTranscript)) {
      console.error("[API] Transcript is not an array");
      throw new Error("Transcript must be an array");
    }

    // Validate each message in transcript
    parsedTranscript.forEach((message, index) => {
      if (!message.role || !message.content) {
        console.error("[API] Invalid message format:", { index, message });
        throw new Error(`Invalid message format at index ${index}`);
      }
      if (!['user', 'assistant', 'system'].includes(message.role)) {
        console.error("[API] Invalid message role:", { index, role: message.role });
        throw new Error(`Invalid message role at index ${index}`);
      }
    });

    console.log("[API] Transcript validation successful", {
      messageCount: parsedTranscript.length,
      sampleMessage: parsedTranscript[0]
    });
    return true;
  } catch (error) {
    console.error("[API] Transcript validation failed:", {
      error: error instanceof Error ? error.message : String(error),
      transcriptType: typeof transcript,
      transcriptPreview: typeof transcript === 'string' ? transcript.slice(0, 100) : transcript
    });
    throw new Error("Invalid transcript format: must be valid JSON array of messages");
  }
}

// Validate status enum
function validateStatus(status: string) {
  console.log("[API] Validating status:", { status });
  const validStatuses = ['in_progress', 'completed'];
  if (!validStatuses.includes(status)) {
    console.error("[API] Invalid status:", { status, validStatuses });
    throw new Error(`Invalid status: must be one of ${validStatuses.join(', ')}`);
  }
  console.log("[API] Status validation successful");
  return true;
}

export async function POST(request: Request) {
  console.log('[API] Starting POST request to /api/interview/session');
  
  try {
    // Extract authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('[API] Unauthorized request:', { 
        hasHeader: !!authHeader,
        startsWithBearer: authHeader?.startsWith('Bearer ')
      });
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token with Supabase
    const token = authHeader.split(' ')[1];
    console.log('[API] Verifying token with Supabase');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error('[API] Authentication error:', {
        error: authError,
        hasUser: !!user
      });
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
    console.log('[API] User authenticated successfully:', { userId: user.id });

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('[API] Request body parsed:', {
        hasInterviewId: !!body.interview_id,
        hasStatus: !!body.status,
        hasTranscript: !!body.transcript,
        transcriptLength: body.transcript?.length
      });
    } catch (parseError) {
      console.error('[API] Error parsing request body:', {
        error: parseError instanceof Error ? parseError.message : String(parseError)
      });
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { interview_id, status, transcript } = body;

    // Validate required fields
    if (!interview_id || !status || !transcript) {
      const missingFields = [];
      if (!interview_id) missingFields.push('interview_id');
      if (!status) missingFields.push('status');
      if (!transcript) missingFields.push('transcript');
      
      console.error('[API] Missing required fields:', {
        missingFields,
        receivedFields: Object.keys(body)
      });
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    try {
      // Validate all inputs
      await validateInterview(interview_id);
      validateStatus(status);
      validateTranscript(transcript);
    } catch (validationError: any) {
      console.error('[API] Validation error:', {
        error: validationError.message,
        stack: validationError.stack
      });
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 }
      );
    }

    // Insert interview session
    try {
      console.log('[API] Attempting to insert interview session:', {
        interview_id,
        status,
        transcriptLength: transcript.length
      });

      const { data: session, error: dbError } = await supabase
        .from("interview_sessions")
        .insert({
          interview_id,
          status,
          transcript: typeof transcript === 'string' ? JSON.parse(transcript) : transcript,
          created_at: new Date().toISOString(),
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (dbError) {
        console.error('[API] Database error during insert:', {
          error: dbError,
          errorCode: dbError.code,
          errorMessage: dbError.message,
          details: dbError.details
        });
        throw dbError;
      }

      console.log('[API] Successfully inserted interview session:', {
        sessionId: session.id,
        interviewId: session.interview_id,
        status: session.status
      });
      return NextResponse.json({ session });
    } catch (err: any) {
      console.error('[API] Error inserting interview session:', {
        error: err.message,
        code: err.code,
        details: err.details
      });
      return NextResponse.json(
        { 
          error: 'Failed to save interview session',
          details: err.message,
          code: err.code 
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[API] Unexpected error:", {
      error: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error.message 
      },
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