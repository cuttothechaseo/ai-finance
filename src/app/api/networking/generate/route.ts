import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Direct API call function as fallback - now with streaming support
async function callClaudeAPI(prompt: string) {
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
      })
    });

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
      throw new Error('Failed to parse Claude API response');
    }
  } catch (error) {
    console.error('Error in callClaudeAPI:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  // Create a new TransformStream for streaming the response
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  
  // Start the response stream immediately
  const response = new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });

  // Process in the background
  (async () => {
    try {
      // Send initial status
      await writer.write(encoder.encode(`data: ${JSON.stringify({ status: 'processing', step: 'starting' })}\n\n`));
      
      // Extract authorization header
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        await writer.write(encoder.encode(`data: ${JSON.stringify({ status: 'error', error: 'Unauthorized' })}\n\n`));
        await writer.close();
        return;
      }

      // Verify token with Supabase
      await writer.write(encoder.encode(`data: ${JSON.stringify({ status: 'processing', step: 'authenticating' })}\n\n`));
      const token = authHeader.split(' ')[1];
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        await writer.write(encoder.encode(`data: ${JSON.stringify({ status: 'error', error: 'Invalid token' })}\n\n`));
        await writer.close();
        return;
      }

      // Parse request body
      await writer.write(encoder.encode(`data: ${JSON.stringify({ status: 'processing', step: 'parsing_request' })}\n\n`));
      const body = await request.json();
      const { companyName, role, contactName, contactRole, resumeText, messageType } = body;

      // Validate required fields
      if (!companyName || !role || !resumeText || !messageType) {
        await writer.write(encoder.encode(`data: ${JSON.stringify({ status: 'error', error: 'Missing required fields' })}\n\n`));
        await writer.close();
        return;
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
      await writer.write(encoder.encode(`data: ${JSON.stringify({ status: 'processing', step: 'generating_message' })}\n\n`));
      let generatedMessage = '';
      try {
        generatedMessage = await callClaudeAPI(prompt);
        await writer.write(encoder.encode(`data: ${JSON.stringify({ status: 'processing', step: 'saving_message' })}\n\n`));
      } catch (apiError: any) {
        console.error('Error calling Claude API:', apiError);
        await writer.write(encoder.encode(`data: ${JSON.stringify({ status: 'error', error: apiError.message || 'Failed to generate message' })}\n\n`));
        await writer.close();
        return;
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
          console.error('Database error:', insertError);
          await writer.write(encoder.encode(`data: ${JSON.stringify({ status: 'error', error: 'Failed to save message' })}\n\n`));
          await writer.close();
          return;
        }
        
        // Send the final success response
        await writer.write(encoder.encode(`data: ${JSON.stringify({ 
          status: 'completed', 
          message: generatedMessage,
          id: messageData.id 
        })}\n\n`));
      } catch (dbError: any) {
        console.error('Database operation error:', dbError);
        await writer.write(encoder.encode(`data: ${JSON.stringify({ status: 'error', error: 'Database operation failed' })}\n\n`));
      }
    } catch (error: any) {
      console.error('Error in networking/generate streaming API route:', error);
      await writer.write(encoder.encode(`data: ${JSON.stringify({ status: 'error', error: error.message || 'An unexpected error occurred' })}\n\n`));
    } finally {
      await writer.close();
    }
  })();

  return response;
}

// TextEncoder for encoding the stream data
const encoder = new TextEncoder();

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