import { supabase } from "@/lib/supabase";
import { InterviewAnalysis, InterviewSession, GeneratedInterview } from "./types";

// Fetches all interview analyses for a user, including session and interview metadata
export async function fetchUserInterviewAnalyses(userId: string) {
  const { data, error } = await supabase
    .from("interview_analyses")
    .select(`
      *,
      session:session_id (
        *,
        interview:interview_id (
          *
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  // Optionally filter by userId in JS if RLS doesn't allow join filtering
  const filtered = (data || []).filter((row: any) =>
    row.session?.interview?.user_id === userId
  );
  return filtered as Array<
    InterviewAnalysis & { session: InterviewSession & { interview: GeneratedInterview } }
  >;
} 