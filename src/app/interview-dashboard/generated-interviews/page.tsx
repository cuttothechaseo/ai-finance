"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getUserWithDetails } from "@/lib/auth";
import InterviewAnalysis from "@/app/components/interview/InterviewAnalysis";
import Sidebar from "@/app/components/dashboard/Sidebar";
import InterviewDashboardNavbar from "@/app/interview-dashboard/components/InterviewDashboardNavbar";

interface Interview {
  id: string;
  company: string;
  role: string;
  interview_type: "technical" | "behavioral" | "mixed";
  question_count: number;
  status: "pending" | "generated" | "completed" | "analyzed";
  created_at: string;
  questions: Array<{
    question: string;
    expectedAnswer: string;
    difficulty: "easy" | "medium" | "hard";
    category: "technical" | "behavioral" | "conceptual";
    topic: string;
  }>;
}

export default function GeneratedInterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzingIds, setAnalyzingIds] = useState<string[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(
    null
  );
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("newest");

  useEffect(() => {
    const checkAuthAndFetchInterviews = async () => {
      try {
        // Check auth first
        const user = await getUserWithDetails();

        // Fetch interviews
        const { data, error: dbError } = await supabase
          .from("generated_interviews")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (dbError) throw dbError;
        setInterviews(data || []);
      } catch (error) {
        console.error("Error:", error);
        if (
          error instanceof Error &&
          error.message.includes("not authenticated")
        ) {
          router.push("/login");
        } else {
          setError(
            error instanceof Error ? error.message : "Failed to load interviews"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchInterviews();
  }, [router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      setSidebarOpen(window.innerWidth >= 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  const getStatusColor = (status: Interview["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "generated":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "analyzed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleAnalyze = async (interview: Interview) => {
    try {
      setAnalyzingIds((prev) => [...prev, interview.id]);

      // Get the latest session for this interview
      const { data: sessions, error: sessionError } = await supabase
        .from("interview_sessions")
        .select("id")
        .eq("interview_id", interview.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(1);

      if (sessionError) throw sessionError;
      if (!sessions || sessions.length === 0) {
        throw new Error("No completed session found");
      }

      const session_id = sessions[0].id;

      // Call the analysis API
      const response = await fetch("/api/interview/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            (
              await supabase.auth.getSession()
            ).data.session?.access_token
          }`,
        },
        body: JSON.stringify({ session_id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to analyze interview");
      }

      // Refresh the interviews list to show updated status
      const { data: updatedInterviews, error: refreshError } = await supabase
        .from("generated_interviews")
        .select("*")
        .eq("user_id", (await getUserWithDetails()).id)
        .order("created_at", { ascending: false });

      if (refreshError) throw refreshError;
      setInterviews(updatedInterviews || []);
    } catch (error) {
      console.error("Analysis error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to analyze interview"
      );
    } finally {
      setAnalyzingIds((prev) => prev.filter((id) => id !== interview.id));
    }
  };

  // Sorting logic
  const sortedInterviews = [...interviews].sort((a, b) => {
    switch (sortOrder) {
      case "oldest":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "analyzed":
        // Move analyzed interviews to the top
        if (a.status === "analyzed" && b.status !== "analyzed") return -1;
        if (a.status !== "analyzed" && b.status === "analyzed") return 1;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "not_started":
        // Move generated (not started) interviews to the top
        if (a.status === "generated" && b.status !== "generated") return -1;
        if (a.status !== "generated" && b.status === "generated") return 1;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "newest":
      default:
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#59B7F2]">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
        <div
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
            sidebarOpen ? "md:pl-64" : "md:pl-20"
          } ${isMobile ? "pl-0" : ""}`}
        >
          <InterviewDashboardNavbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-[#59B7F2] p-6">
            <div className="min-h-screen bg-[#59B7F2] flex flex-col py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#59B7F2]"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#59B7F2]">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
        <div
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
            sidebarOpen ? "md:pl-64" : "md:pl-20"
          } ${isMobile ? "pl-0" : ""}`}
        >
          <InterviewDashboardNavbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-[#59B7F2] p-6">
            <div className="min-h-screen bg-[#59B7F2] flex flex-col py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto w-full">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#59B7F2]">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        } ${isMobile ? "pl-0" : ""}`}
      >
        <InterviewDashboardNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-[#59B7F2] p-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="bg-white/80 backdrop-blur-md shadow-md rounded-lg overflow-hidden border border-white/20 mb-8">
              <div className="px-6 py-5 border-b border-[#E6E8F0]">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#1E3A8A]">
                    Your Generated Interviews
                  </h2>
                  <Link
                    href="/interview-dashboard/interview-generation"
                    className="px-4 py-2 bg-[#1E3A8A] text-white text-sm font-medium rounded-lg hover:bg-[#59B7F2] transition-colors duration-200"
                  >
                    Generate New Interview
                  </Link>
                </div>
              </div>
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
                        <option value="analyzed">Analyzed</option>
                        <option value="not_started">Not Started</option>
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
                    {interviews.length}{" "}
                    {interviews.length === 1 ? "interview" : "interviews"} found
                  </div>
                </div>
              </div>
              <div className="p-6">
                {sortedInterviews.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">
                      No interviews generated yet.
                    </p>
                    <Link
                      href="/interview-dashboard/interview-generation"
                      className="text-[#59B7F2] hover:underline"
                    >
                      Generate your first interview
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedInterviews.map((interview: Interview) => (
                      <div
                        key={interview.id}
                        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-[#1E3A8A] mb-1">
                                {interview.company}
                              </h3>
                              <p className="text-gray-600">{interview.role}</p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                interview.status
                              )}`}
                            >
                              {interview.status.charAt(0).toUpperCase() +
                                interview.status.slice(1)}
                            </span>
                          </div>
                          <div className="space-y-2 mb-6">
                            <div className="flex items-center text-sm text-gray-600">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {formatDate(interview.created_at)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                              </svg>
                              {interview.question_count} Questions •{" "}
                              {interview.interview_type}
                            </div>
                          </div>
                          <div className="flex flex-col space-y-3">
                            {interview.status === "generated" && (
                              <Link
                                href={`/interview-dashboard/interview/${interview.id}`}
                                className="flex-1 bg-[#59B7F2] hover:bg-[#59B7F2]/90 text-white text-center py-2 rounded-lg font-medium transition-colors"
                              >
                                Start Interview
                              </Link>
                            )}
                            {interview.status === "completed" && (
                              <button
                                onClick={() => handleAnalyze(interview)}
                                disabled={analyzingIds.includes(interview.id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-center py-2 rounded-lg font-medium transition-colors disabled:bg-red-400"
                              >
                                {analyzingIds.includes(interview.id) ? (
                                  <span className="flex items-center justify-center">
                                    <svg
                                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Analyzing...
                                  </span>
                                ) : (
                                  "Analyze Interview"
                                )}
                              </button>
                            )}
                            {interview.status === "analyzed" && (
                              <button
                                onClick={() =>
                                  setSelectedAnalysisId(interview.id)
                                }
                                className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-center py-2 rounded-lg font-medium transition-colors"
                              >
                                View Results
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Interview Analysis Modal */}
              {selectedAnalysisId && (
                <InterviewAnalysis
                  analysisId={selectedAnalysisId}
                  onClose={() => setSelectedAnalysisId(null)}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
