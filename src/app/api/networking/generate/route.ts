import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Direct API call function with timeout and better error handling
async function callClaudeAPI(prompt: string) {
  console.log('API: Claude API key is configured, length:', process.env.ANTHROPIC_API_KEY?.length || 'MISSING');
  console.log('API: Making Claude API request with prompt length:', prompt.length);
  
  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
  
  try {
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
      }),
      signal: controller.signal
    });
    
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
    console.log('API: Claude response structure:', 
      JSON.stringify({
        type: result.content?.[0]?.type,
        contentLength: result.content?.[0]?.text?.length || 0
      })
    );
    
    // Extract the content safely
    if (!result.content || !result.content[0] || result.content[0].type !== 'text') {
      console.error('API: Unexpected Claude response format:', JSON.stringify(result));
      throw new Error('Invalid response format from Claude API');
    }
    
    return result.content[0].text;
  } catch (error: any) {
    console.error('API: Error in Claude API call:', error.name, error.message);
    
    if (error.name === 'AbortError') {
      throw new Error('Claude API request timed out after 25 seconds');
    }
    
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: Request) {
  console.log('API: Received networking message generation request');
  
  try {
    // Extract authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('API: Missing or invalid authorization header');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token with Supabase
    console.log('API: Verifying auth token');
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('API: Auth error:', authError);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    console.log('API: User authenticated:', user.id);

    // Parse request body
    const body = await request.json();
    const { companyName, role, contactName, contactRole, resumeText, messageType } = body;
    console.log('API: Request params:', { companyName, role, messageType, hasContactName: !!contactName });

    // Validate required fields
    if (!companyName || !role || !resumeText || !messageType) {
      console.log('API: Missing required fields');
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
    
    console.log('API: Prompt created, length:', prompt.length);

    // Generate the message using direct API call
    let generatedMessage = '';
    try {
      console.log('API: Calling Claude API');
      generatedMessage = await callClaudeAPI(prompt);
      console.log('API: Message generated successfully, length:', generatedMessage.length);
    } catch (apiError: any) {
      console.error('API: Error calling Claude API:', apiError);
      return NextResponse.json(
        { error: apiError.message || 'Failed to generate message' },
        { status: 500 }
      );
    }

    // Store in database
    console.log('API: Storing message in database');
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
        console.error('API: Database error:', insertError);
        return NextResponse.json(
          { error: 'Failed to save message' },
          { status: 500 }
        );
      }
      
      console.log('API: Message stored successfully, id:', messageData.id);

      // Return the generated message
      return NextResponse.json({
        message: generatedMessage,
        id: messageData.id,
      });
    } catch (dbError: any) {
      console.error('API: Unexpected database error:', dbError);
      return NextResponse.json(
        { error: 'Database error: ' + (dbError.message || 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('API: Unhandled error in networking API:', error);
    // Always return a properly formatted JSON response
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
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