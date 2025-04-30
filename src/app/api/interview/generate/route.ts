import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Debug: Check if API key is set
console.log("Google AI API Key set:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

// Direct API call function with error handling
async function generateInterviewQuestions(prompt: string, questionCount: number) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Remove markdown code block if present
    text = text.replace(/```json\n|\n```/g, "").trim();
    
    try {
      const questions = JSON.parse(text);
      if (!Array.isArray(questions)) {
        throw new Error("Response is not an array");
      }
      if (questions.length !== questionCount) {
        throw new Error(`Expected ${questionCount} questions but got ${questions.length}`);
      }
      
      // Transform simple questions into structured format
      return questions.map((question, index) => ({
        question: question,
        expectedAnswer: "",  // We'll leave this empty for now
        difficulty: index < questionCount/3 ? "easy" : 
                   index < (2*questionCount)/3 ? "medium" : "hard",
        category: question.toLowerCase().includes("technical") ? "technical" : "behavioral",
        topic: "finance"  // Default topic
      }));
    } catch (parseError) {
      console.error("Failed to parse questions:", parseError, "Raw text:", text);
      throw new Error("Failed to parse generated questions");
    }
  } catch (error) {
    console.error("Google AI API error:", error);
    throw error;
  }
}

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

    const { company, role, jobDescription, questionCount, type } = body;

    // Validate required fields
    if (!company || !role || !questionCount || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate interview questions with simpler prompt
    const prompt = `Generate ${questionCount} interview questions for a ${role} position at ${company}.
    ${jobDescription ? `Consider this job description: ${jobDescription}\n` : ""}
    
    Return the questions in a JSON array format. Do not include any markdown formatting or additional text.
    Example format: ["Question 1", "Question 2"]
    
    Make sure:
    1. Questions are relevant to finance industry and the role
    2. Questions are clear and well-formed
    3. No special characters that might break JSON parsing
    4. ${type === "technical" ? "Focus on technical finance concepts and problem-solving" :
       type === "behavioral" ? "Focus on past experiences and soft skills" :
       "Mix of technical and behavioral questions"}`;

    let questions;
    try {
      questions = await generateInterviewQuestions(prompt, questionCount);
    } catch (apiError: any) {
      console.error("Error generating questions:", apiError);
      return NextResponse.json(
        { error: apiError.message || "Failed to generate questions" },
        { status: 500 }
      );
    }

    // Store in Supabase
    try {
      const { data: interview, error: dbError } = await supabase
        .from("generated_interviews")
        .insert({
          user_id: user.id,
          company,
          role,
          job_description: jobDescription,
          question_count: questionCount,
          interview_type: type,
          questions,
          status: "generated",
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      return NextResponse.json(interview);
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save interview" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in interview generation:", error);
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