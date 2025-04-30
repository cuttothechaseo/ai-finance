"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getUserWithDetails } from "@/lib/auth";

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
  const router = useRouter();

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#59B7F2]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1E3A8A]">
          Generated Interviews
        </h1>
        <Link
          href="/interview-dashboard/interview-generation"
          className="bg-[#59B7F2] hover:bg-[#59B7F2]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Generate New Interview
        </Link>
      </div>

      {interviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No interviews generated yet.</p>
          <Link
            href="/interview-dashboard/interview-generation"
            className="text-[#59B7F2] hover:underline"
          >
            Generate your first interview
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
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

                <div className="flex space-x-3">
                  {interview.status === "generated" && (
                    <Link
                      href={`/interview-dashboard/interview/${interview.id}`}
                      className="flex-1 bg-[#59B7F2] hover:bg-[#59B7F2]/90 text-white text-center py-2 rounded-lg font-medium transition-colors"
                    >
                      Start Interview
                    </Link>
                  )}
                  {interview.status === "analyzed" && (
                    <Link
                      href={`/interview-dashboard/results/${interview.id}`}
                      className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-center py-2 rounded-lg font-medium transition-colors"
                    >
                      View Results
                    </Link>
                  )}
                  {interview.status === "completed" && (
                    <div className="flex-1 bg-gray-100 text-gray-500 text-center py-2 rounded-lg font-medium">
                      Analysis in Progress
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
