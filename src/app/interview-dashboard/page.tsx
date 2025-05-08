"use client";

import React, { useEffect, useState } from "react";
import PerformanceChart from "./components/PerformanceChart";
import SkillsCard from "./components/SkillsCard";
import FeedbackCard from "./components/FeedbackCard";
import RecentInterviewsTable from "./components/RecentInterviewsTable";
import DashboardLayout from "./components/DashboardLayout";
import { fetchUserInterviewAnalyses } from "./data/fetchInterviewData";
import {
  interviewScores,
  recentInterviews,
  getSkillsSummary,
  getFeedbackHighlights,
} from "./data/mockData";
import {
  InterviewAnalysis,
  InterviewSession,
  GeneratedInterview,
} from "./data/types";
import { getUserWithDetails } from "@/lib/auth";
import InterviewAnalysisModal from "@/app/components/interview/InterviewAnalysis";

type AnalysisWithSession = InterviewAnalysis & {
  session: InterviewSession & { interview: GeneratedInterview };
};

export default function InterviewDashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisWithSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getUserWithDetails();
        setUserId(user.id);
      } catch (err) {
        setError("User not authenticated");
        setUserId(null);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        if (!userId) return;
        const data = await fetchUserInterviewAnalyses(userId);
        setAnalyses(data as AnalysisWithSession[]);
      } catch (err: any) {
        setError("Failed to load interview data");
        setAnalyses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  // Fallback to mock data if no real data
  const hasRealData = analyses && analyses.length > 0;

  const handleViewReport = (sessionId: string) => {
    setSelectedAnalysisId(sessionId);
  };

  if (!mounted) return null;
  if (error) return <div>{error}</div>;
  if (!userId) return <div>Loading user...</div>;

  return (
    <DashboardLayout>
      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-[#1e3a8a] mb-4">
          Performance Overview
        </h2>
        <PerformanceChart
          analyses={hasRealData ? analyses : undefined}
          mockScores={interviewScores}
        />
      </div>

      {/* Skills and Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <SkillsCard
            analyses={hasRealData ? analyses : undefined}
            mockSkills={getSkillsSummary()}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <FeedbackCard
            analyses={hasRealData ? analyses : undefined}
            mockFeedback={getFeedbackHighlights()}
          />
        </div>
      </div>

      {/* Recent Interviews Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-[#1e3a8a] mb-4">
          Recent Interviews
        </h2>
        <RecentInterviewsTable
          analyses={hasRealData ? analyses : undefined}
          mockInterviews={recentInterviews}
          onViewReport={handleViewReport}
        />
      </div>

      {/* Interview Analysis Modal */}
      {selectedAnalysisId && (
        <InterviewAnalysisModal
          analysisId={selectedAnalysisId}
          onClose={() => setSelectedAnalysisId(null)}
        />
      )}
    </DashboardLayout>
  );
}
