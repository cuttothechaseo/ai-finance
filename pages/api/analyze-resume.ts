import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { analyzeResume, saveResumeAnalysis, ResumeAnalysisResult } from '../../lib/claude';
import { parseFile } from '../../lib/fileParser';

// Type definition for expected request body
interface AnalyzeResumeRequest extends NextApiRequest {
  body: {
    resumeId: string;
    jobRole?: string;
    industry?: string;
    experienceLevel?: string;
  };
}

export default async function handler(
  req: AnalyzeResumeRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { resumeId, jobRole, industry, experienceLevel } = req.body;

    if (!resumeId) {
      return res.status(400).json({ error: 'Resume ID is required' });
    }

    // Get resume details from database
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();

    if (resumeError || !resumeData) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Verify the resume belongs to the authenticated user
    if (resumeData.user_id !== user.id) {
      return res.status(403).json({ error: 'Not authorized to access this resume' });
    }

    // Get the resume file from storage
    const resumeUrl = resumeData.resume_url;
    const fileResponse = await fetch(resumeUrl);
    
    if (!fileResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch resume file' });
    }

    // Extract text content from the resume using our parser
    let resumeText: string;
    const contentType = resumeData.file_type;
    const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());

    try {
      resumeText = await parseFile(fileBuffer, contentType);
    } catch (error) {
      console.error('Error parsing file:', error);
      return res.status(400).json({ 
        error: 'Failed to parse resume file',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    // Call Claude API to analyze the resume
    const analysisResult = await analyzeResume(resumeText, {
      jobRole,
      industry,
      experienceLevel
    });

    // Save the analysis result to Supabase
    await saveResumeAnalysis(resumeId, user.id, analysisResult, supabase);

    // Return the analysis result
    return res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Resume analysis failed:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze resume',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 