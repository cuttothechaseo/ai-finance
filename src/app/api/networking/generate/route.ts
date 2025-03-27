import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Direct API call function as fallback
async function callClaudeAPI(prompt: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  return result.content[0].text;
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
    const body = await request.json();
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
      prompt = `Write a professional LinkedIn message to connect with someone at ${companyName} for a ${role} position. ${contactName ? `The contact's name is ${contactName}${contactRole ? ` and they are a ${contactRole}` : ''}.` : ''} Here's my resume information: ${resumeText}`;
    } else if (messageType === 'intro_email') {
      prompt = `Write a professional introduction email to someone at ${companyName} for a ${role} position. ${contactName ? `The email is addressed to ${contactName}${contactRole ? ` who is a ${contactRole}` : ''}.` : ''} Here's my background: ${resumeText}`;
    } else if (messageType === 'cover_letter') {
      prompt = `Write a professional cover letter for a ${role} position at ${companyName}. ${contactName ? `The letter is addressed to ${contactName}${contactRole ? ` who is a ${contactRole}` : ''}.` : ''} Here's my resume information: ${resumeText}`;
    }

    // Generate the message using direct API call
    let generatedMessage = '';
    try {
      generatedMessage = await callClaudeAPI(prompt);
    } catch (apiError: any) {
      console.error('Error calling Claude API:', apiError);
      return NextResponse.json(
        { error: apiError.message || 'Failed to generate message' },
        { status: 500 }
      );
    }

    // Store in database
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
      console.error('Database error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    // Return the generated message
    return NextResponse.json({
      message: generatedMessage,
      id: messageData.id,
    });
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