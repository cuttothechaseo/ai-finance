"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getUserWithDetails } from "@/lib/auth";
import Sidebar from "@/app/components/dashboard/Sidebar";
import InterviewDashboardNavbar from "@/app/interview-dashboard/components/InterviewDashboardNavbar";

const roles = [
  "Investment Banking",
  "Private Equity",
  "Equity Research",
  "Asset Management",
  "Real Estate Development",
  "Real Estate Acquisitions",
];

const types = [
  { value: "technical", label: "Technical" },
  { value: "behavioral", label: "Behavioral" },
  { value: "mixed", label: "Mixed" },
];

export default function InterviewGenerationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: roles[0],
    jobDescription: "",
    questionCount: "4",
    type: "mixed",
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getUserWithDetails();
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { session },
        error: userError,
      } = await supabase.auth.getSession();
      console.log("Supabase session:", session, "Error:", userError);

      if (userError || !session) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/interview/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          questionCount: parseInt(formData.questionCount),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate interview");
      }

      const data = await response.json();
      router.push("/interview-dashboard/generated-interviews");
    } catch (error) {
      console.error("Error generating interview:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* Header Section with SVG Cloud Overlays (copied from networking/page.tsx) */}
          <div
            className="relative w-full flex flex-col items-center justify-center pt-16 pb-12 mb-8"
            style={{ minHeight: "220px" }}
          >
            {/* Top Right SVG Cloud */}
            <svg
              className="absolute top-0 right-0 w-64 h-64 opacity-20 z-0 pointer-events-none select-none"
              viewBox="0 0 200 200"
              fill="white"
            >
              <circle cx="60" cy="60" r="50" />
              <circle cx="100" cy="70" r="60" />
              <circle cx="140" cy="60" r="50" />
            </svg>
            {/* Bottom Left SVG Cloud */}
            <svg
              className="absolute bottom-0 left-10 w-72 h-72 opacity-5 z-0 pointer-events-none select-none"
              viewBox="0 0 200 200"
              fill="white"
            >
              <circle cx="60" cy="60" r="50" />
              <circle cx="100" cy="70" r="60" />
              <circle cx="140" cy="60" r="50" />
            </svg>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 z-10 text-center">
              Generate Interview
            </h1>
            <p className="text-white text-lg z-10 text-center max-w-2xl">
              Create a personalized mock interview for any finance role or
              company
            </p>
          </div>
          <div className="max-w-3xl mx-auto w-full">
            <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Input */}
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    placeholder="Goldman Sachs"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59B7F2] focus:border-transparent"
                    required
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59B7F2] focus:border-transparent"
                    required
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Description */}
                <div>
                  <label
                    htmlFor="jobDescription"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Job Description (Optional)
                  </label>
                  <textarea
                    id="jobDescription"
                    placeholder="Paste the job description here"
                    value={formData.jobDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jobDescription: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59B7F2] focus:border-transparent h-32"
                  />
                </div>

                {/* Number of Questions */}
                <div>
                  <label
                    htmlFor="questionCount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Number of Questions
                  </label>
                  <select
                    id="questionCount"
                    value={formData.questionCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        questionCount: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59B7F2] focus:border-transparent"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Question" : "Questions"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Interview Type */}
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Interview Type
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59B7F2] focus:border-transparent"
                    required
                  >
                    {types.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
                    ${
                      isLoading
                        ? "bg-[#59B7F2]/50 cursor-not-allowed"
                        : "bg-[#59B7F2] hover:bg-[#59B7F2]/90"
                    }
                  `}
                >
                  {isLoading ? "Generating Interview..." : "Generate Interview"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
