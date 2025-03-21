-- Create resume_analyses table for storing Claude API analysis results
CREATE TABLE IF NOT EXISTS public.resume_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  summary TEXT NOT NULL,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  areas_for_improvement JSONB NOT NULL DEFAULT '[]'::jsonb,
  content_quality JSONB NOT NULL,
  formatting JSONB NOT NULL,
  industry_relevance JSONB NOT NULL,
  impact_statements JSONB NOT NULL,
  suggested_edits JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS resume_analyses_resume_id_idx ON public.resume_analyses(resume_id);
CREATE INDEX IF NOT EXISTS resume_analyses_user_id_idx ON public.resume_analyses(user_id);

-- Add RLS policies for security
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;

-- Only allow users to see their own analyses
CREATE POLICY "Users can view their own resume analyses"
  ON public.resume_analyses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only allow users to insert their own analyses
CREATE POLICY "Users can insert their own resume analyses"
  ON public.resume_analyses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only allow users to update their own analyses
CREATE POLICY "Users can update their own resume analyses"
  ON public.resume_analyses
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Only allow users to delete their own analyses
CREATE POLICY "Users can delete their own resume analyses"
  ON public.resume_analyses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_analyses TO authenticated;
GRANT SELECT ON public.resume_analyses TO service_role; 