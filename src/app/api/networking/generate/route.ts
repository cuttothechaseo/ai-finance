import { NextResponse } from 'next/server';

// Basic prompt templates
const templates = {
  linkedin_message: `
Hi {contactName},

I noticed your role at {companyName} and I'm interested in the {role} position. My background includes {skills}.

Would you be open to a quick conversation about the team and opportunities at {companyName}?

Thank you for your time,
[Your Name]
  `,
  intro_email: `
Subject: {role} Position Inquiry

Dear {contactName},

I hope this email finds you well. I'm writing to express my interest in the {role} position at {companyName}.

My skills include {skills}, which I believe align well with what you're looking for.

I'd appreciate the opportunity to discuss how my background might be a good fit for your team.

Thank you for your consideration.

Best regards,
[Your Name]
  `,
  cover_letter: `
Dear {contactName},

I am writing to express my interest in the {role} position at {companyName}. With my background in {skills}, I believe I would be a valuable addition to your team.

Throughout my career, I have developed strong skills in these areas, allowing me to deliver results effectively and efficiently.

I am excited about the opportunity to bring my unique skills and experiences to {companyName} and would welcome the chance to discuss how I can contribute to your organization.

Thank you for considering my application.

Sincerely,
[Your Name]
  `
};

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { companyName, role, contactName, contactRole, resumeText, messageType } = body;

    // Validate required fields
    if (!companyName || !role || !resumeText || !messageType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the appropriate template
    const template = templates[messageType as keyof typeof templates] || templates.intro_email;
    
    // Extract skills from resume text (first 100 chars)
    const skills = resumeText.substring(0, 100) + (resumeText.length > 100 ? '...' : '');

    // Fill in the template
    let message = template
      .replace('{companyName}', companyName)
      .replace('{role}', role)
      .replace('{skills}', skills)
      .replace('{contactName}', contactName || 'Hiring Manager');

    // Return the generated message
    return NextResponse.json({ 
      message,
      success: true 
    });
    
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json(
      { error: 'An unexpected error occurred', success: false },
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