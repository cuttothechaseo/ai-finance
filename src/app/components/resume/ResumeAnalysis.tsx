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

  useEffect(() => {
    if (!initialData && resumeId) {
      fetchAnalysis();
    }
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

  const fetchAnalysis = async () => {
    console.group("Resume Analysis API Request");
    console.log(`Resume ID for analysis: ${resumeId}`);

    try {
      setLoading(true);
      setError(null);

      // Validate resumeId format
      if (!resumeId || typeof resumeId !== "string") {
        const error = "Invalid resume ID";
        console.error(error, { resumeId, type: typeof resumeId });
        throw new Error(error);
      }

      // Validate UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(resumeId)) {
        const error = "Invalid resume ID format";
        console.error(error, { resumeId });
        throw new Error(error);
      }

      // Double check the resume ID against the database
      console.log("Verifying resume ID in database...");
      let { data: resumeData, error: resumeError } = await supabase
        .from("resumes")
        .select("id, file_name, resume_url, file_type")
        .eq("id", resumeId)
        .maybeSingle();

      if (resumeError) {
        console.error("Error verifying resume ID:", resumeError);
      } else if (!resumeData) {
        console.error("Resume ID not found in database:", resumeId);

        // Try to find an exact match or a close match with similar ID
        const { data: similarResumes, error: similarError } = await supabase
          .from("resumes")
          .select("id, file_name, resume_url, file_type")
          .or(`id.ilike.${resumeId.split("-")[0]}%`);

        if (similarError) {
          console.error(
            "Error searching for similar resume IDs:",
            similarError
          );
        } else if (similarResumes && similarResumes.length > 0) {
          // Log the found similar IDs for debugging
          console.log(
            "Found similar resume IDs:",
            similarResumes.map((r) => ({
              id: r.id,
              fileName: r.file_name,
              similarity: similarityScore(resumeId, r.id),
            }))
          );

          // Find the most similar ID
          const mostSimilar = similarResumes.reduce((prev, current) => {
            const prevScore = similarityScore(resumeId, prev.id);
            const currentScore = similarityScore(resumeId, current.id);
            return currentScore > prevScore ? current : prev;
          }, similarResumes[0]);

          console.log("Most similar resume ID:", {
            originalId: resumeId,
            mostSimilarId: mostSimilar.id,
            fileName: mostSimilar.file_name,
          });

          // Use the closest matching ID instead
          if (similarityScore(resumeId, mostSimilar.id) > 0.8) {
            console.log(
              "Using similar resume ID instead due to high similarity"
            );
            const correctedId = mostSimilar.id;
            setResumeId(correctedId);

            // Update resumeData to use the similar resume
            resumeData = mostSimilar;
          }
        }
      } else {
        console.log("Resume ID verified in database:", {
          id: resumeData.id,
          fileName: resumeData.file_name,
        });
      }

      // Pre-verify that the file exists and is accessible
      if (resumeData?.resume_url) {
        console.log(
          "Verifying resume file accessibility:",
          resumeData.resume_url
        );

        // Try to fetch the file directly to check if it's accessible
        try {
          const fileCheckResponse = await fetch(resumeData.resume_url, {
            method: "HEAD",
          });

          if (!fileCheckResponse.ok) {
            console.error("Resume file is not accessible:", {
              status: fileCheckResponse.status,
              statusText: fileCheckResponse.statusText,
              url: resumeData.resume_url,
            });

            // Try to check if the file exists in Supabase storage
            const url = new URL(resumeData.resume_url);
            const pathMatch = url.pathname.match(
              /\/storage\/v1\/object\/public\/resumes\/(.*)/
            );

            if (pathMatch && pathMatch[1]) {
              const storagePath = decodeURIComponent(pathMatch[1]);
              console.log(
                "Checking file existence in Supabase storage:",
                storagePath
              );

              const { data: fileData, error: fileError } =
                await supabase.storage
                  .from("resumes")
                  .createSignedUrl(storagePath, 60); // Create a signed URL that will work

              if (fileError) {
                console.error("File not accessible in storage:", fileError);
                throw new Error(
                  `The resume file cannot be accessed. It may have been deleted or is corrupted.`
                );
              } else if (fileData?.signedUrl) {
                console.log(
                  "File exists and signed URL created:",
                  fileData.signedUrl.substring(0, 50) + "..."
                );
              }
            }
          } else {
            console.log("Resume file is accessible via direct URL");
          }
        } catch (fileAccessError) {
          console.error("Error checking file accessibility:", fileAccessError);
          // Continue anyway, let the API handle the file retrieval
        }
      } else {
        console.warn("No resume_url available to verify file accessibility");
      }

      // Get the current session token to ensure we're authenticated
      console.log("Retrieving authentication session...");
      const { data: sessionData } = await supabase.auth.getSession();

      console.log("Auth session retrieved:", {
        hasSession: Boolean(sessionData?.session),
        expiresAt: sessionData?.session?.expires_at
          ? new Date(sessionData.session.expires_at * 1000).toLocaleString()
          : "N/A",
      });

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

      // Log the exact request we're making to the API
      console.log(
        `Making API request to /api/analyze-resume with resume ID: ${resumeId}`
      );
      console.log("Request details:", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.substring(0, 10)}...`, // Log only part of the token for security
        },
        body: JSON.stringify({ resumeId }),
      });

      // ENHANCED: Make the request with improved error handling
      try {
        const response = await fetch("/api/analyze-resume", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ resumeId }),
          credentials: "include",
        });

        console.log("API response received:", {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
        });

        // Check for auth error and attempt to refresh token and retry
        if (response.status === 401) {
          console.log(
            "Authentication failed, attempting to refresh token and retry..."
          );

          try {
            // Force token refresh
            const { data: refreshData, error: refreshError } =
              await supabase.auth.refreshSession();

            if (refreshError || !refreshData?.session) {
              console.error("Failed to refresh token on 401:", refreshError);
              throw new Error("Authentication failed. Please log in again.");
            }

            // Retry with new token
            console.log("Retrying request with fresh token...");
            const retryResponse = await fetch("/api/analyze-resume", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${refreshData.session.access_token}`,
              },
              body: JSON.stringify({ resumeId }),
              credentials: "include",
            });

            if (!retryResponse.ok) {
              let errorMessage = "Failed to analyze resume after token refresh";
              try {
                const errorData = await retryResponse.json();
                errorMessage = errorData.error || errorMessage;
                const details = errorData.details
                  ? `: ${errorData.details}`
                  : "";
                errorMessage = `${errorMessage}${details}`;
                console.error("Retry failed, error details:", errorData);
              } catch (parseError) {
                console.error("Failed to parse error response:", parseError);
                errorMessage = `${errorMessage} (Status: ${retryResponse.status})`;
              }
              throw new Error(errorMessage);
            }

            const data = await retryResponse.json();
            console.log("Analysis completed successfully after token refresh");
            setAnalysis(data);
            return; // Exit since we've handled the response
          } catch (refreshErr) {
            console.error("Error during token refresh and retry:", refreshErr);
            throw new Error("Authentication failed after refresh attempt");
          }
        }

        if (!response.ok) {
          let errorMessage = "Failed to analyze resume";

          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
            const details = errorData.details ? `: ${errorData.details}` : "";
            errorMessage = `${errorMessage}${details}`;
            console.error("Resume analysis error details:", errorData);
          } catch (parseError) {
            console.error("Failed to parse error response:", parseError);
            errorMessage = `${errorMessage} (Status: ${response.status})`;
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log("Analysis completed successfully");
        setAnalysis(data);
      } catch (fetchError) {
        console.error("Error fetching analysis results:", fetchError);
        throw fetchError; // Re-throw to be caught by the outer try/catch
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error analyzing resume:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  const renderScoreRing = (score: number) => {
    const circumference = 2 * Math.PI * 45; // r = 45
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="relative h-28 w-28">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className="text-primary transition-all duration-1000 ease-out"
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
          <span className="text-2xl font-bold text-white">{score}</span>
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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-4xl w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-xl font-medium text-white mb-2">
            Analyzing Resume
          </h3>
          <p className="text-gray-300">
            Claude is reviewing your resume. This may take a minute...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-4xl w-full">
          <h3 className="text-xl font-medium text-white mb-4">
            Analysis Error
          </h3>
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-medium text-white">Resume Analysis</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-400"
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
          <div className="bg-gray-900 w-full md:w-64 p-4 border-r border-gray-700 flex-shrink-0">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                    activeSection === section.id
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-center mb-4">
                {renderScoreRing(analysis.overallScore)}
              </div>
              <p className="text-center text-sm text-gray-400">Overall Score</p>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Key Strengths
              </h4>
              <ul className="space-y-1">
                {analysis.strengths
                  .slice(0, 3)
                  .map((strength: string, index: number) => (
                    <li
                      key={index}
                      className="text-sm text-gray-400 flex items-start"
                    >
                      <span className="text-green-400 mr-2">•</span>
                      <span className="text-gray-300">{strength}</span>
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
                  <div className="bg-gray-750 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-3">
                      Summary
                    </h3>
                    <p className="text-gray-300">{analysis.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-750 p-6 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-3">
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {analysis.strengths.map(
                          (strength: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-400 mr-2">•</span>
                              <span className="text-gray-300">{strength}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="bg-gray-750 p-6 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-3">
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-2">
                        {analysis.areasForImprovement.map(
                          (area: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="text-amber-400 mr-2">•</span>
                              <span className="text-gray-300">{area}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-750 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-4">
                      Section Scores
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {analysis.contentQuality.score}
                        </div>
                        <div className="text-sm text-gray-400">
                          Content Quality
                        </div>
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {analysis.formatting.score}
                        </div>
                        <div className="text-sm text-gray-400">Formatting</div>
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {analysis.industryRelevance.score}
                        </div>
                        <div className="text-sm text-gray-400">
                          Industry Relevance
                        </div>
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {analysis.impactStatements.score}
                        </div>
                        <div className="text-sm text-gray-400">
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
                    <div className="bg-gray-800 rounded-full h-16 w-16 flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-white">
                        {analysis.contentQuality.score}
                      </span>
                    </div>
                    <h2 className="text-xl font-medium text-white">
                      Content Quality
                    </h2>
                  </div>

                  <div className="bg-gray-750 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-3">
                      Feedback
                    </h3>
                    <p className="text-gray-300">
                      {analysis.contentQuality.feedback}
                    </p>
                  </div>

                  <div className="bg-gray-750 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-3">
                      Improvement Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {analysis.contentQuality.suggestions.map(
                        (suggestion: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span className="text-gray-300">{suggestion}</span>
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
                    <div className="bg-gray-800 rounded-full h-16 w-16 flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-white">
                        {analysis.formatting.score}
                      </span>
                    </div>
                    <h2 className="text-xl font-medium text-white">
                      Formatting & Structure
                    </h2>
                  </div>

                  <div className="bg-gray-750 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-3">
                      Feedback
                    </h3>
                    <p className="text-gray-300">
                      {analysis.formatting.feedback}
                    </p>
                  </div>

                  <div className="bg-gray-750 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-3">
                      Improvement Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {analysis.formatting.suggestions.map(
                        (suggestion: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span className="text-gray-300">{suggestion}</span>
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
                    <div className="bg-gray-800 rounded-full h-16 w-16 flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-white">
                        {analysis.industryRelevance.score}
                      </span>
                    </div>
                    <h2 className="text-xl font-medium text-white">
                      Industry Relevance
                    </h2>
                  </div>

                  <div className="bg-gray-750 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-3">
                      Feedback
                    </h3>
                    <p className="text-gray-300">
                      {analysis.industryRelevance.feedback}
                    </p>
                  </div>

                  <div className="bg-gray-750 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-3">
                      Improvement Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {analysis.industryRelevance.suggestions.map(
                        (suggestion: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span className="text-gray-300">{suggestion}</span>
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
                    <div className="bg-gray-800 rounded-full h-16 w-16 flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-white">
                        {analysis.impactStatements.score}
                      </span>
                    </div>
                    <h2 className="text-xl font-medium text-white">
                      Impact Statements
                    </h2>
                  </div>

                  <div className="bg-gray-750 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-3">
                      Feedback
                    </h3>
                    <p className="text-gray-300">
                      {analysis.impactStatements.feedback}
                    </p>
                  </div>

                  <div className="bg-gray-750 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-3">
                      Improvement Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {analysis.impactStatements.suggestions.map(
                        (suggestion: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span className="text-gray-300">{suggestion}</span>
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
                  <h2 className="text-xl font-medium text-white mb-4">
                    Suggested Edits
                  </h2>

                  {analysis.suggestedEdits.length === 0 ? (
                    <div className="bg-gray-750 p-6 rounded-lg border border-gray-700 text-center">
                      <p className="text-gray-300">
                        No specific text edits suggested.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analysis.suggestedEdits.map((edit, index) => (
                        <div
                          key={index}
                          className="bg-gray-750 p-4 rounded-lg border border-gray-700 overflow-hidden"
                        >
                          <button
                            onClick={() =>
                              setSelectedEdit(
                                selectedEdit === index ? null : index
                              )
                            }
                            className="w-full text-left"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-white">
                                Edit Suggestion {index + 1}
                              </h4>
                              <svg
                                className={`w-5 h-5 text-gray-400 transition-transform ${
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
                                <div className="pt-2 border-t border-gray-700 mt-2">
                                  <div className="mb-4">
                                    <h5 className="text-sm text-gray-400 mb-1">
                                      Original Text:
                                    </h5>
                                    <div className="bg-gray-800 p-3 rounded text-gray-300 text-sm">
                                      {edit.original}
                                    </div>
                                  </div>

                                  <div className="mb-4">
                                    <h5 className="text-sm text-gray-400 mb-1">
                                      Improved Text:
                                    </h5>
                                    <div className="bg-primary/10 p-3 rounded text-white text-sm">
                                      {edit.improved}
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="text-sm text-gray-400 mb-1">
                                      Explanation:
                                    </h5>
                                    <p className="text-gray-300 text-sm">
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

        <div className="px-6 py-4 border-t border-gray-700 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center">
            <svg
              className="w-5 h-5 mr-2"
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
