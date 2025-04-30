"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getUserWithDetails } from "@/lib/auth";

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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-8">
        Generate Interview
      </h1>

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
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
              setFormData({ ...formData, jobDescription: e.target.value })
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
              setFormData({ ...formData, questionCount: e.target.value })
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
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
  );
}
