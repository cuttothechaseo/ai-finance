import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simplified Claude API call with shorter timeout
async function callClaudeAPI(prompt: string) {
  console.log('API: Making Claude API request...');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229', // Using a faster model with less complexity
        max_tokens: 800, // Reduced token count for faster response
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
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const result = await response.json();
    return result.content[0].text;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: Request) {
  try {
    // Extract auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate user
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { companyName, role, contactName, contactRole, resumeText, messageType } = body;

    // Validate required fields
    if (!companyName || !role || !resumeText || !messageType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create simplified prompt (shorter for faster processing)
    let prompt = '';
    if (messageType === 'linkedin_message') {
      prompt = `Write a brief LinkedIn message to connect with someone at ${companyName} for a ${role} position.`;
    } else if (messageType === 'intro_email') {
      prompt = `Write a short introduction email for a ${role} position at ${companyName}.`;
    } else if (messageType === 'cover_letter') {
      prompt = `Write a cover letter for a ${role} position at ${companyName}.`;
    }
    
    // Add minimal context to keep prompt short
    prompt += ` Skills: ${resumeText.substring(0, 150)}${resumeText.length > 150 ? '...' : ''}`;
    if (contactName) {
      prompt += ` Addressed to: ${contactName}${contactRole ? ` (${contactRole})` : ''}.`;
    }

    // Generate message
    try {
      const generatedMessage = await callClaudeAPI(prompt);
      
      // First return the response before saving to database to avoid timeout
      return NextResponse.json({ message: generatedMessage });
      
      // Note: In a more robust implementation, we would save to the database
      // in a separate background process or webhook to avoid timeout issues
      
    } catch (apiError: any) {
      console.error('API error:', apiError.message);
      return NextResponse.json(
        { error: 'Failed to generate message. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

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