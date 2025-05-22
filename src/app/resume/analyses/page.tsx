"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getUserWithDetails } from "../../../../lib/auth";
import ResumeAnalysis from "../../components/resume/ResumeAnalysis";

// Types for the analysis result (matching the ResumeAnalysis component)
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

// Types for the analysis job
interface AnalysisJob {
  id: string;
  resume_id: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  result: ResumeAnalysisResult | null;
  // Join with resume info
  resume?: {
    file_name: string;
    file_type: string;
    file_size: number;
    resume_url: string;
  };
}

export default function ResumeAnalysesPage() {
  const [analyses, setAnalyses] = useState<AnalysisJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisJob | null>(
    null
  );
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const router = useRouter();

  // Fetch analyses for the current user
  useEffect(() => {
    async function fetchAnalyses() {
      try {
        // Check auth first
        await getUserWithDetails();

        // Fetch completed analyses
        const { data, error } = await supabase
          .from("analysis_jobs")
          .select(
            `
            *,
            resume:resume_id (
              file_name,
              file_type,
              file_size,
              resume_url
            )
          `
          )
          .eq("status", "completed")
          .order("completed_at", { ascending: false });

        if (error) {
          throw error;
        }

        setAnalyses(data || []);
      } catch (err) {
        console.error("Error fetching analyses:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load analyses");
        }
        // Redirect to login if unauthorized
        if (err instanceof Error && err.message.includes("not authenticated")) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyses();
  }, [router]);

  const handleViewAnalysis = (analysis: AnalysisJob) => {
    setSelectedAnalysis(analysis);
    setShowAnalysisModal(true);
  };

  const closeAnalysisModal = () => {
    setShowAnalysisModal(false);
    setSelectedAnalysis(null);
  };

  // Animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const staggerItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemFade = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to get score color class
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-amber-600";
    return "text-rose-600";
  };

  // Sort analyses based on selected order
  const sortedAnalyses = [...analyses].sort((a, b) => {
    switch (sortOrder) {
      case "highest":
        return (b.result?.overallScore || 0) - (a.result?.overallScore || 0);
      case "lowest":
        return (a.result?.overallScore || 0) - (b.result?.overallScore || 0);
      case "oldest":
        return (
          new Date(a.completed_at || a.created_at).getTime() -
          new Date(b.completed_at || b.created_at).getTime()
        );
      case "newest":
      default:
        return (
          new Date(b.completed_at || b.created_at).getTime() -
          new Date(a.created_at || b.created_at).getTime()
        );
    }
  });

  // Debug the sorted analyses to identify any issues
  useEffect(() => {
    console.log("Sorted analyses:", sortedAnalyses);
  }, [sortedAnalyses]);

  return (
    <div className="min-h-screen bg-[#59B7F2] flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Resume Analyses</h1>
          <Link
            href="/dashboard"
            className="text-[#B3E5FC] hover:text-white transition-colors duration-200"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-md shadow-md rounded-lg overflow-hidden border border-white/20 mb-8">
          <div className="px-6 py-5 border-b border-[#E6E8F0]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#1E3A8A]">
                Your Resume Analysis History
              </h2>
              <Link
                href="/resume"
                className="px-4 py-2 bg-[#1E3A8A] text-white text-sm font-medium rounded-lg hover:bg-[#59B7F2] transition-colors duration-200"
              >
                Analyze New Resume
              </Link>
            </div>
          </div>

          {/* Sort bar */}
          <div className="bg-[#F8FAFC] px-6 py-3 border-b border-[#E6E8F0]">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#64748B]">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="appearance-none bg-white border border-[#E6E8F0] text-[#1E293B] rounded-lg py-1 px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#59B7F2] focus:border-[#59B7F2]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Score</option>
                    <option value="lowest">Lowest Score</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#64748B]">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-sm text-[#64748B]">
                {analyses.length}{" "}
                {analyses.length === 1 ? "analysis" : "analyses"} found
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#59B7F2]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            ) : sortedAnalyses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="bg-white rounded-lg border border-[#E6E8F0] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => handleViewAnalysis(analysis)}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg text-[#1E293B] truncate">
                            {analysis.resume?.file_name || "Unnamed Resume"}
                          </h3>
                          <p className="text-sm text-[#64748B]">
                            Analyzed on{" "}
                            {formatDate(
                              analysis.completed_at || analysis.created_at
                            )}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <div
                            className={`text-2xl font-bold ${getScoreColorClass(
                              analysis.result?.overallScore || 0
                            )}`}
                          >
                            {analysis.result?.overallScore || 0}
                          </div>
                          <div className="text-xs text-[#64748B] text-center">
                            Score
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-[#475569] line-clamp-3">
                        {analysis.result?.summary || "No summary available"}
                      </div>

                      {analysis.result?.strengths &&
                        analysis.result.strengths.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs font-medium text-[#64748B] mb-1">
                              Key Strengths:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {analysis.result.strengths
                                .slice(0, 3)
                                .map((strength, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-[#E0F7FA] text-[#0E7490] text-xs rounded-full truncate max-w-[150px]"
                                  >
                                    {strength.split(" ").slice(0, 3).join(" ")}
                                    ...
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="bg-[#F8FAFC] px-5 py-3 border-t border-[#E6E8F0] text-sm text-[#59B7F2] font-medium">
                      View full analysis
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-16 w-16 text-[#94A3B8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-[#1E293B]">
                  No analyses yet
                </h3>
                <p className="mt-1 text-[#475569]">
                  Upload a resume and get AI-powered analysis and feedback.
                </p>
                <div className="mt-6">
                  <Link
                    href="/resume"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1E3A8A] hover:bg-[#59B7F2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A]"
                  >
                    Upload Resume
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md shadow-md rounded-lg overflow-hidden border border-white/20">
          <div className="px-6 py-5 border-b border-[#E6E8F0]">
            <h2 className="text-xl font-bold text-[#1E3A8A]">
              Resume Analysis Tips
            </h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2 mt-1">•</span>
                <span className="text-[#475569]">
                  <strong className="text-[#1E3A8A]">
                    Compare different versions
                  </strong>{" "}
                  of your resume to see which scores higher.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2 mt-1">•</span>
                <span className="text-[#475569]">
                  <strong className="text-[#1E3A8A]">
                    Implement the suggestions
                  </strong>{" "}
                  from each analysis to improve your score.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2 mt-1">•</span>
                <span className="text-[#475569]">
                  <strong className="text-[#1E3A8A]">
                    Focus on impact statements
                  </strong>{" "}
                  to showcase your achievements more effectively.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2 mt-1">•</span>
                <span className="text-[#475569]">
                  <strong className="text-[#1E3A8A]">Tailor your resume</strong>{" "}
                  for specific roles by highlighting relevant experience.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Analysis Modal */}
      <AnimatePresence>
        {showAnalysisModal && selectedAnalysis && (
          <ResumeAnalysis
            resumeId={selectedAnalysis.resume_id}
            initialData={selectedAnalysis.result || undefined}
            onClose={closeAnalysisModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
