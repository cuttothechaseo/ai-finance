import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { interview_id, status, transcript } = body;
    if (!interview_id || !status || !transcript) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log the incoming request body
    console.log('[API] Incoming POST to /api/interview/session:', body);

    // Insert interview session
    try {
      const { data: session, error: dbError } = await supabase
        .from("interview_sessions")
        .insert({
          interview_id,
          status,
          transcript,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      // Log the result of the insert
      console.log('[API] Supabase insert result:', { session, dbError });
      if (dbError) {
        return NextResponse.json(
          { error: dbError.message },
          { status: 500 }
        );
      }
      return NextResponse.json({ session });
    } catch (err) {
      console.error('[API] Unexpected error inserting interview session:', err);
      return NextResponse.json(
        { error: 'Unexpected error inserting interview session.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in interview session insert:", error);
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