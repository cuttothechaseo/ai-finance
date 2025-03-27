import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  try {
    // Get auth token from request
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Parse request body
    const { companyName, role, contactName, contactRole, resumeText, messageType } = await request.json();

    // Validate required fields
    if (!companyName || !role || !resumeText || !messageType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate prompt based on message type
    let prompt = `You are a professional career coach helping someone write a ${
      messageType === 'linkedin_message'
        ? 'LinkedIn message'
        : messageType === 'intro_email'
        ? 'introduction email'
        : 'cover letter'
    } for a ${role} position at ${companyName}.`;

    if (contactName) {
      prompt += ` The message will be sent to ${contactName}${
        contactRole ? `, who is a ${contactRole}` : ''
      }.`;
    }

    prompt += `\n\nHere is the person's resume:\n${resumeText}\n\n`;

    prompt += messageType === 'linkedin_message'
      ? 'Write a concise, professional LinkedIn message (max 300 characters) that expresses interest in the role and company. Focus on key relevant experience.'
      : messageType === 'intro_email'
      ? 'Write a professional introduction email that highlights relevant experience and expresses interest in learning more about the role.'
      : 'Write a compelling cover letter that demonstrates understanding of the company and role while highlighting relevant experience and achievements.';

    // Call Claude API
    const completion = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the message content
    const generatedMessage = completion.content[0].type === 'text' 
      ? completion.content[0].text 
      : '';

    // Store in database
    const { data: messageData, error: insertError } = await supabase
      .from('networking_messages')
      .insert([
        {
          user_id: user.id,
          company_name: companyName,
          role,
          contact_name: contactName,
          contact_role: contactRole,
          resume_text: resumeText,
          message_type: messageType,
          generated_message: generatedMessage,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error storing message:', insertError);
      return NextResponse.json(
        { error: 'Error storing message in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: generatedMessage,
      id: messageData.id,
    });
  } catch (error: any) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 