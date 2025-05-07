// Types for Supabase-powered interview analysis data

export type InterviewAnalysis = {
  id: string;
  session_id: string;
  overall_score: number;
  technical_score?: number;
  behavioral_score?: number;
  communication_score: number;
  confidence_score: number;
  analysis_summary: string;
  strengths: string[]; // JSONB array
  areas_for_improvement: string[]; // JSONB array
  detailed_feedback: Record<string, string[]>; // JSONB object
  created_at: string;
};

export type InterviewSession = {
  id: string;
  interview_id: string;
  status: string;
  transcript: any[];
  created_at: string;
  completed_at?: string;
};

export type GeneratedInterview = {
  id: string;
  user_id: string;
  company: string;
  role: string;
  interview_type: string;
  questions: any[];
  status: string;
  created_at: string;
}; 