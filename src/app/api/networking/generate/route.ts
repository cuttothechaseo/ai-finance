import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

// Gemini API call function
async function callGeminiAPI(prompt: string) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    // Remove markdown code block if present
    text = text.replace(/```json\n|```/g, "").trim();
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate message");
  }
}

export async function POST(request: Request) {
  try {
    // Extract authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token with Supabase
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { companyName, role, contactName, contactRole, resumeText, messageType } = body;

    // Validate required fields
    if (!companyName || !role || !resumeText || !messageType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create prompt based on message type
    let prompt = '';
    if (messageType === 'linkedin_message') {
      prompt = `Write a single, concise, and professional LinkedIn connection request message to connect with someone at ${companyName} for a ${role} position.${contactName ? ` The contact's name is ${contactName}${contactRole ? ` and they are a ${contactRole}` : ''}.` : ''} Here is my resume information: ${resumeText}.

Only output the message body. Do not include multiple options, explanations, or any extra commentary.`;
    } else if (messageType === 'intro_email') {
      prompt = `Write a single, thorough, and professional introduction email to someone at ${companyName} for a ${role} position.${contactName ? ` The email is addressed to ${contactName}${contactRole ? ` who is a ${contactRole}` : ''}.` : ''} Here is my background: ${resumeText}.

Only output the email body. Do not include the subject line, multiple options, explanations, or any extra commentary.`;
    } else if (messageType === 'cover_letter') {
      prompt = `Write a single, thorough, and professional cover letter for a ${role} position at ${companyName}.${contactName ? ` The letter is addressed to ${contactName}${contactRole ? ` who is a ${contactRole}` : ''}.` : ''} Here is my resume information: ${resumeText}.

Only output the cover letter body. Do not include multiple options, explanations, or any extra commentary.`;
    }

    // Generate the message using Gemini
    let generatedMessage = '';
    try {
      generatedMessage = await callGeminiAPI(prompt);
    } catch (apiError: any) {
      console.error('Error calling Gemini API:', apiError);
      return NextResponse.json(
        { error: apiError.message || 'Failed to generate message' },
        { status: 500 }
      );
    }

    // Store in database
    try {
      const { data: messageData, error: insertError } = await supabase
        .from('networking_messages')
        .insert({
          user_id: user.id,
          company_name: companyName,
          role: role,
          contact_name: contactName || null,
          contact_role: contactRole || null,
          resume_text: resumeText,
          message_type: messageType,
          generated_message: generatedMessage,
        })
        .select('id')
        .single();

      if (insertError) {
        throw insertError;
      }

      // Return the generated message
      return NextResponse.json({
        message: generatedMessage,
        id: messageData.id,
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate message' },
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