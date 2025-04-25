"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../../lib/supabase";

// Define type directly since we can't import from lib/claude.ts
// This keeps the component independent from the API integration
interface ResumeAnalysisResult {
  overallScore: number;
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  contentQuality: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
  formatting: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
  industryRelevance: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
  impactStatements: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
  suggestedEdits: {
    original: string;
    improved: string;
    explanation: string;
  }[];
}

interface ResumeAnalysisProps {
  resumeId: string;
  onClose: () => void;
  initialData?: ResumeAnalysisResult;
}

export default function ResumeAnalysis({
  resumeId: initialResumeId,
  onClose,
  initialData,
}: ResumeAnalysisProps) {
  const [resumeId, setResumeId] = useState<string>(initialResumeId);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(
    initialData || null
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [selectedEdit, setSelectedEdit] = useState<number | null>(null);

  // New state for job tracking
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);
  const [processingTime, setProcessingTime] = useState<number>(0);

  // Optional parameters for job creation
  const [jobRole, setJobRole] = useState<string | undefined>(undefined);
  const [industry, setIndustry] = useState<string | undefined>(undefined);
  const [experienceLevel, setExperienceLevel] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!initialData && resumeId) {
      createAnalysisJob();
    }

    // Cleanup polling interval on unmount
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId, initialData]);

  // Helper function to calculate similarity between two strings
  function similarityScore(str1: string, str2: string): number {
    let matches = 0;
    const maxLen = Math.max(str1.length, str2.length);

    // Count matching characters in the same positions
    for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
      if (str1[i] === str2[i]) matches++;
    }

    return matches / maxLen;
  }

  const createAnalysisJob = async () => {
    console.group("Resume Analysis - Create Job");
    console.log(`Creating analysis job for resume ID: ${resumeId}`);

    try {
      setLoading(true);
      setError(null);
      setJobId(null);
      setJobStatus(null);

      // Get current session token
      console.log("Getting current auth session");
      const { data: sessionData } = await supabase.auth.getSession();
      let accessToken = sessionData?.session?.access_token;

      if (!accessToken) {
        const error = "No active session found. Please log in again.";
        console.error(error);
        throw new Error(error);
      }

      // ENHANCED: Refresh token if it's close to expiration
      if (sessionData?.session?.expires_at) {
        const expiresAt = sessionData.session.expires_at * 1000; // convert to milliseconds
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;

        // If token expires in less than 5 minutes, refresh it
        if (timeUntilExpiry < 5 * 60 * 1000) {
          console.log("Token is close to expiry, refreshing...");
          try {
            const { data: refreshData, error: refreshError } =
              await supabase.auth.refreshSession();

            if (refreshError) {
              console.error("Failed to refresh token:", refreshError);
            } else if (refreshData?.session) {
              console.log("Token refreshed successfully");
              // Use the new token
              accessToken = refreshData.session.access_token;
            }
          } catch (refreshErr) {
            console.error("Error refreshing token:", refreshErr);
          }
        }
      }

      // Create a new analysis job
      console.log("Creating analysis job via API");
      const response = await fetch("/api/create-analysis-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          resumeId,
          // Add optional parameters if provided
          ...(jobRole && { jobRole }),
          ...(industry && { industry }),
          ...(experienceLevel && { experienceLevel }),
        }),
      });

      console.log("Received response:", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      if (!response.ok) {
        let errorMessage = "Failed to create analysis job";

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          const details = errorData.details ? `: ${errorData.details}` : "";
          errorMessage = `${errorMessage}${details}`;
          console.error("Error details:", errorData);
        } catch (parseError) {
          console.error("Failed to parse error response");
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Job created successfully:", data);

      // Set job info in state
      setJobId(data.jobId);
      setJobStatus(data.status);

      // Trigger job processing immediately after job creation
      try {
        console.log("Triggering job processing...");
        const { data: processingData, error: processingError } =
          await supabase.functions.invoke("job-scheduler", {
            body: { triggered_at: new Date().toISOString() },
          });

        if (processingError) {
          console.warn(
            "Failed to trigger job processing, relying on polling",
            processingError
          );
        } else {
          console.log("Job processing triggered successfully", processingData);
        }
      } catch (triggerErr) {
        console.warn("Error triggering job processing:", triggerErr);
        // Continue anyway, as polling will still check status
      }

      // Start polling for job status
      console.log("Starting to poll for job status");
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsedTime = Math.round((Date.now() - startTime) / 1000);
        setProcessingTime(elapsedTime);
        checkJobStatus(data.jobId, accessToken);
      }, 2000); // Check every 2 seconds

      setPollInterval(interval);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error creating job:", err);
      setError(errorMessage);
      setLoading(false);
    }

    console.groupEnd();
  };

  const checkJobStatus = async (id: string, token: string) => {
    try {
      // Don't log every poll to avoid console spam
      const response = await fetch(`/api/get-analysis-status?jobId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to check job status: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setJobStatus(data.status);

      // If job is completed or failed, stop polling
      if (data.status === "completed" || data.status === "failed") {
        console.group("Resume Analysis - Job Completed");
        console.log(`Job status: ${data.status}`);

        if (pollInterval) {
          clearInterval(pollInterval);
          setPollInterval(null);
          console.log("Polling stopped");
        }

        if (data.status === "completed") {
          console.log("Setting analysis result from completed job");
          setAnalysis(data.result);
          setLoading(false);
        } else {
          console.error("Job failed:", data.error);
          setError(data.error || "Analysis failed due to an unknown error");
          setLoading(false);
        }

        console.groupEnd();
      }
    } catch (err) {
      console.error("Error checking job status:", err);
      // Don't set error here yet - keep polling
      // Only set error if polling has been going on for too long (e.g., 2 minutes)
      if (processingTime > 120) {
        if (pollInterval) {
          clearInterval(pollInterval);
          setPollInterval(null);
        }
        setError(
          "Analysis is taking longer than expected. Please try again later."
        );
        setLoading(false);
      }
    }
  };

  const fetchAnalysis = async () => {
    // This method is kept for backward compatibility
    // but we're now using createAnalysisJob instead
    console.warn("fetchAnalysis is deprecated, use createAnalysisJob instead");
    createAnalysisJob();
  };

  const renderScoreRing = (score: number) => {
    const circumference = 2 * Math.PI * 45; // r = 45
    const offset = circumference - (score / 100) * circumference;

    const scoreColorClass =
      score >= 85
        ? "text-[#4ADE80]"
        : score >= 60
        ? "text-[#FACC15]"
        : "text-[#F87171]"; // Green-400, Yellow-400, Red-400

    return (
      <div className="relative h-28 w-28">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-[#E6E8F0]" // Slate-200
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className={`transition-all duration-1000 ease-out ${scoreColorClass}`} // Use dynamic score color
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${scoreColorClass}`}>
            {score}
          </span>{" "}
          {/* Use dynamic score color */}
        </div>
      </div>
    );
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl border border-white/10 shadow-sm max-w-4xl w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#59B7F2] mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-[#1E3A8A] mb-2">
            {jobStatus === "processing"
              ? "Analyzing Resume"
              : "Preparing Analysis"}
          </h3>
          <p className="text-slate-700 mb-2">
            {jobStatus === "processing"
              ? `Claude is analyzing your resume. This may take a minute...`
              : "Setting up the analysis job..."}
          </p>
          {jobStatus && processingTime > 0 && (
            <p className="text-slate-600 text-sm">
              Status: {jobStatus} (Running for {processingTime} seconds)
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl border border-white/10 shadow-sm max-w-4xl w-full">
          <h3 className="text-xl font-bold text-[#1E3A8A] mb-4">
            Analysis Error
          </h3>
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#1E3A8A]/10 hover:bg-[#B3E5FC] text-[#1E3A8A] rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "content", label: "Content Quality" },
    { id: "formatting", label: "Formatting" },
    { id: "relevance", label: "Industry Relevance" },
    { id: "impact", label: "Impact Statements" },
    { id: "edits", label: "Suggested Edits" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-xl border border-white/10 shadow-sm max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#1E3A8A]">Resume Analysis</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-[#1E3A8A]/10 transition-colors"
          >
            <svg
              className="w-6 h-6 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="bg-[#1E3A8A]/5 w-full md:w-64 p-4 border-r border-slate-200 flex-shrink-0">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                    activeSection === section.id
                      ? "bg-[#59B7F2] text-white"
                      : "text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-center mb-4">
                {renderScoreRing(analysis.overallScore)}
              </div>
              <p className="text-center text-sm text-slate-600">
                Overall Score
              </p>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-[#1E3A8A] mb-2">
                Key Strengths
              </h4>
              <ul className="space-y-1">
                {analysis.strengths
                  .slice(0, 3)
                  .map((strength: string, index: number) => (
                    <li
                      key={index}
                      className="text-sm text-slate-700 flex items-start"
                    >
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">
              {activeSection === "overview" && (
                <motion.div
                  key="overview"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                      Summary
                    </h3>
                    <p className="text-slate-700">{analysis.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {analysis.strengths.map(
                          (strength: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="text-[#59B7F2] mr-2">•</span>
                              <span className="text-slate-700">{strength}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-2">
                        {analysis.areasForImprovement.map(
                          (area: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="text-[#59B7F2] mr-2">•</span>
                              <span className="text-slate-700">{area}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-bold text-[#1E3A8A] mb-4">
                      Section Scores
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-[#1E3A8A]/5 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-[#1E3A8A] mb-1">
                          {analysis.contentQuality.score}
                        </div>
                        <div className="text-sm text-slate-600">
                          Content Quality
                        </div>
                      </div>
                      <div className="bg-[#1E3A8A]/5 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-[#1E3A8A] mb-1">
                          {analysis.formatting.score}
                        </div>
                        <div className="text-sm text-slate-600">Formatting</div>
                      </div>
                      <div className="bg-[#1E3A8A]/5 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-[#1E3A8A] mb-1">
                          {analysis.industryRelevance.score}
                        </div>
                        <div className="text-sm text-slate-600">
                          Industry Relevance
                        </div>
                      </div>
                      <div className="bg-[#1E3A8A]/5 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-[#1E3A8A] mb-1">
                          {analysis.impactStatements.score}
                        </div>
                        <div className="text-sm text-slate-600">
                          Impact Statements
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === "content" && (
                <motion.div
                  key="content"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-[#1E3A8A]/10 rounded-full h-16 w-16 flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-[#1E3A8A]">
                        {analysis.contentQuality.score}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-[#1E3A8A]">
                      Content Quality
                    </h2>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                      Feedback
                    </h3>
                    <p className="text-slate-700">
                      {analysis.contentQuality.feedback}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                      Improvement Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {analysis.contentQuality.suggestions.map(
                        (suggestion: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span className="text-slate-700">{suggestion}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeSection === "formatting" && (
                <motion.div
                  key="formatting"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-[#1E3A8A]/10 rounded-full h-16 w-16 flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-[#1E3A8A]">
                        {analysis.formatting.score}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-[#1E3A8A]">
                      Formatting & Structure
                    </h2>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                      Feedback
                    </h3>
                    <p className="text-slate-700">
                      {analysis.formatting.feedback}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                      Improvement Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {analysis.formatting.suggestions.map(
                        (suggestion: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span className="text-slate-700">{suggestion}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeSection === "relevance" && (
                <motion.div
                  key="relevance"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-[#1E3A8A]/10 rounded-full h-16 w-16 flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-[#1E3A8A]">
                        {analysis.industryRelevance.score}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-[#1E3A8A]">
                      Industry Relevance
                    </h2>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                      Feedback
                    </h3>
                    <p className="text-slate-700">
                      {analysis.industryRelevance.feedback}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                      Improvement Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {analysis.industryRelevance.suggestions.map(
                        (suggestion: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span className="text-slate-700">{suggestion}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeSection === "impact" && (
                <motion.div
                  key="impact"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-[#1E3A8A]/10 rounded-full h-16 w-16 flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-[#1E3A8A]">
                        {analysis.impactStatements.score}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-[#1E3A8A]">
                      Impact Statements
                    </h2>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                      Feedback
                    </h3>
                    <p className="text-slate-700">
                      {analysis.impactStatements.feedback}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                      Improvement Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {analysis.impactStatements.suggestions.map(
                        (suggestion: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span className="text-slate-700">{suggestion}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeSection === "edits" && (
                <motion.div
                  key="edits"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                    Suggested Edits
                  </h2>

                  {analysis.suggestedEdits.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg border border-slate-200 text-center">
                      <p className="text-slate-600">
                        No specific text edits suggested.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analysis.suggestedEdits.map((edit, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-slate-200 overflow-hidden"
                        >
                          <button
                            onClick={() =>
                              setSelectedEdit(
                                selectedEdit === index ? null : index
                              )
                            }
                            className="w-full text-left"
                            aria-expanded={selectedEdit === index}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-bold text-[#1E3A8A]">
                                Edit Suggestion {index + 1}
                              </h4>
                              <svg
                                className={`w-5 h-5 text-slate-600 transition-transform ${
                                  selectedEdit === index ? "rotate-180" : ""
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {selectedEdit === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="pt-2 border-t border-slate-200 mt-2">
                                  <div className="mb-4">
                                    <h5 className="text-sm text-slate-600 mb-1">
                                      Original Text:
                                    </h5>
                                    <div className="bg-[#1E3A8A]/5 p-3 rounded text-slate-700 text-sm">
                                      {edit.original}
                                    </div>
                                  </div>

                                  <div className="mb-4">
                                    <h5 className="text-sm text-slate-600 mb-1">
                                      Improved Text:
                                    </h5>
                                    <div className="bg-[#59B7F2]/10 border border-[#B3E5FC] p-3 rounded text-[#1E3A8A] text-sm">
                                      {edit.improved}
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="text-sm text-slate-600 mb-1">
                                      Explanation:
                                    </h5>
                                    <p className="text-slate-700 text-sm">
                                      {edit.explanation}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1E3A8A]/10 hover:bg-[#B3E5FC] text-[#1E3A8A] rounded-lg transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#59B7F2] focus:outline-none focus:ring-2 focus:ring-[#B3E5FC] transition-all duration-200 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-current"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export Report
          </button>
        </div>
      </motion.div>
    </div>
  );
}
