-- Create table for tracking asynchronous analysis jobs
CREATE TABLE IF NOT EXISTS public.analysis_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id),
    user_id UUID NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    job_role TEXT,
    industry TEXT,
    experience_level TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    result JSONB
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_resume_id ON public.analysis_jobs(resume_id);
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_user_id ON public.analysis_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_status ON public.analysis_jobs(status);

-- Add RLS policies for security
ALTER TABLE public.analysis_jobs ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own jobs
CREATE POLICY view_own_jobs ON public.analysis_jobs 
    FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own jobs
CREATE POLICY insert_own_jobs ON public.analysis_jobs 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own jobs
CREATE POLICY update_own_jobs ON public.analysis_jobs 
    FOR UPDATE USING (auth.uid() = user_id); 