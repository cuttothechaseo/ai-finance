-- Create resumes table for storing user resume data
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON public.resumes(user_id);

-- Add RLS policies for security
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Only allow users to see their own resumes
CREATE POLICY "Users can view their own resumes"
  ON public.resumes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only allow users to insert their own resumes
CREATE POLICY "Users can insert their own resumes"
  ON public.resumes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only allow users to update their own resumes
CREATE POLICY "Users can update their own resumes"
  ON public.resumes
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Only allow users to delete their own resumes
CREATE POLICY "Users can delete their own resumes"
  ON public.resumes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;
GRANT SELECT ON public.resumes TO service_role; 