import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Direct API call function as fallback
async function callClaudeAPI(prompt: string) {
  try {
    // Create an AbortController to handle timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000); // 9-second timeout (Vercel has a 10s limit)
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000, // Reduced from 1500 to speed up response
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
    
    // Clear timeout since we got a response
    clearTimeout(timeoutId);

    if (!response.ok) {
      // Clone before reading to avoid "body stream already read" errors
      const errorResponseClone = response.clone();
      
      let errorInfo = '';
      try {
        const errorText = await response.text();
        errorInfo = errorText;
        console.error('Claude API error response:', errorText);
      } catch (textError) {
        console.error('Failed to read Claude API error response as text:', textError);
        try {
          const errorJson = await errorResponseClone.json();
          errorInfo = JSON.stringify(errorJson);
          console.error('Claude API error response (JSON):', errorJson);
        } catch (jsonError) {
          console.error('Failed to read Claude API error response as JSON:', jsonError);
        }
      }
      
      throw new Error(`Claude API error: ${response.status} ${response.statusText}${errorInfo ? ` - ${errorInfo}` : ''}`);
    }

    // Clone before reading the success response
    const jsonResponseClone = response.clone();
    const textResponseClone = response.clone();
    
    try {
      // First try to parse as JSON
      const result = await jsonResponseClone.json();
      
      if (!result.content || !result.content.length || result.content[0].type !== 'text') {
        console.error('Unexpected Claude API response format:', result);
        throw new Error('Invalid response format from Claude API');
      }
      
      return result.content[0].text;
    } catch (jsonError) {
      console.error('Error parsing Claude API response as JSON:', jsonError);
      
      // Fall back to text if JSON parsing fails
      try {
        const textResult = await textResponseClone.text();
        console.warn('Received text response instead of JSON:', textResult);
        return textResult;
      } catch (textError) {
        console.error('Error parsing Claude API response as text:', textError);
        throw new Error('Failed to parse Claude API response');
      }
    }
  } catch (error: any) {
    console.error('Error in callClaudeAPI:', error);
    
    // Handle timeout/abort errors specifically
    if (error.name === 'AbortError') {
      throw new Error('Request to Claude API timed out. Please try with a shorter prompt or try again later.');
    }
    
    throw error;
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
    const body = await request.json();
    const { companyName, role, contactName, contactRole, resumeText, messageType } = body;

    // Validate required fields
    if (!companyName || !role || !resumeText || !messageType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create shorter, more concise prompt to avoid timeouts
    let prompt = '';
    if (messageType === 'linkedin_message') {
      prompt = `Short LinkedIn message to ${companyName} for ${role} position. ${contactName ? `To: ${contactName}${contactRole ? ` (${contactRole})` : ''}.` : ''} Resume: ${resumeText.substring(0, 500)}`;
    } else if (messageType === 'intro_email') {
      prompt = `Brief introduction email to ${companyName} for ${role} position. ${contactName ? `To: ${contactName}${contactRole ? ` (${contactRole})` : ''}.` : ''} Background: ${resumeText.substring(0, 500)}`;
    } else if (messageType === 'cover_letter') {
      prompt = `Concise cover letter for ${role} at ${companyName}. ${contactName ? `To: ${contactName}${contactRole ? ` (${contactRole})` : ''}.` : ''} Resume: ${resumeText.substring(0, 500)}`;
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
    console.error('Error in networking/generate API route:', error);
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