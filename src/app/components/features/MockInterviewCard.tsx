"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PerformanceChart from "@/app/interview-dashboard/components/PerformanceChart";
import SkillsCard from "@/app/interview-dashboard/components/SkillsCard";
import FeedbackCard from "@/app/interview-dashboard/components/FeedbackCard";
import RecentInterviewsTable from "@/app/interview-dashboard/components/RecentInterviewsTable";
import {
  interviewScores,
  recentInterviews,
  getSkillsSummary,
  getFeedbackHighlights,
} from "@/app/interview-dashboard/data/mockData";
import InterviewAnalysis from "@/app/components/interview/InterviewAnalysis";

export default function MockInterviewCard() {
  return (
    <section className="py-16 bg-[#59B7F2] relative overflow-hidden w-full">
      {/* Cloud elements (optional, for visual consistency) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="absolute top-0 right-0 w-64 h-64 opacity-20"
          viewBox="0 0 200 200"
          fill="white"
        >
          <circle cx="60" cy="60" r="50" />
          <circle cx="100" cy="70" r="60" />
          <circle cx="140" cy="60" r="50" />
        </svg>
        <svg
          className="absolute bottom-0 left-10 w-72 h-72 opacity-5"
          viewBox="0 0 200 200"
          fill="white"
        >
          <circle cx="60" cy="60" r="50" />
          <circle cx="100" cy="70" r="60" />
          <circle cx="140" cy="60" r="50" />
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center justify-center mb-8">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              AI-Powered{" "}
              <span className="text-[#B3E5FC]">Mock Interview Practice</span>
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Prepare for finance interviews with realistic mock questions and
              instant feedback from our AI interviewer
            </p>
            {/* Cards Container */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* AI Interviewer Card */}
              <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center relative">
                <div className="bg-[#E0F2FE] rounded-full p-6 mb-4 relative">
                  <img
                    src="/assets/logos/wallstreetai-logo.svg"
                    alt="AI Interviewer"
                    width={64}
                    height={64}
                    className="w-16 h-16"
                  />
                </div>
                <h2 className="text-xl font-semibold text-[#1E3A8A] mb-2">
                  AI Interviewer
                </h2>
              </div>
              {/* User Card */}
              <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center">
                <div className="bg-[#E0F2FE] rounded-full p-6 mb-4">
                  <img
                    src="/assets/icons/user-placeholder.svg"
                    alt="You"
                    width={64}
                    height={64}
                    className="w-16 h-16"
                  />
                </div>
                <h2 className="text-xl font-semibold text-[#1E3A8A] mb-2">
                  You
                </h2>
              </div>
            </div>
            {/* Start Interview Button */}
            <div className="max-w-4xl mx-auto mt-8 w-full">
              <button className="w-full bg-[#22357A] hover:bg-[#1E3A8A]/90 text-white py-4 rounded-xl font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>Start Interview</span>
              </button>
            </div>
            {/* Interview Info */}
            <div className="max-w-4xl mx-auto mt-6 flex justify-between items-center px-4 w-full">
              <div className="text-white/80">
                <p className="text-lg">Goldman Sachs - Investment Banking</p>
                <p className="text-lg">5 Questions • Mixed</p>
              </div>
              <span className="px-3 py-1 rounded-full text-lg font-medium bg-white/10 text-white">
                Technical & Behavioral
              </span>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Mock Interview Dashboard Header */}
      <div className="flex flex-col items-center justify-center mb-8 mt-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
          AI-Powered{" "}
          <span className="text-[#B3E5FC]">Performance Tracking</span>
        </h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 text-center">
          Track interview progress, analyze your strengths and weaknesses, and
          review feedback from recent interviews.
        </p>
      </div>
      {/* Mock Interview Dashboard */}
      <div className="max-w-6xl mx-auto w-full mt-16">
        {/* Performance Overview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-8">
          <h2 className="text-lg font-semibold text-[#1e3a8a] mb-4">
            Performance Overview
          </h2>
          <PerformanceChart mockScores={interviewScores} />
        </div>
        {/* Recent Interviews */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <RecentInterviewsTable mockInterviews={recentInterviews} />
        </div>
      </div>
      {/* Interview Analysis Header */}
      <div className="flex flex-col items-center justify-center mt-16 mb-8">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
          AI-Powered <span className="text-[#B3E5FC]">Interview Analysis</span>
        </h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 text-center">
          Get feedback on your interview performance, review detailed analysis,
          and identify areas for improvement.
        </p>
      </div>
      {/* Mock Interview Analysis Module */}
      <div className="max-w-6xl mx-auto w-full mb-16">
        <InterviewAnalysis
          analysisId="mock-id"
          onClose={() => {}}
          initialData={{
            id: "mock-id",
            session_id: "mock-session",
            overall_score: 82,
            technical_score: 85,
            behavioral_score: 78,
            communication_score: 80,
            confidence_score: 75,
            strengths: [
              "Strong technical knowledge in finance concepts",
              "Clear and concise communication",
              "Confident delivery of answers",
            ],
            areas_for_improvement: [
              "Expand on behavioral examples",
              "Improve response structure for technical questions",
            ],
            detailed_feedback: {
              question_responses: [
                {
                  question: "Walk me through a DCF.",
                  response_quality:
                    "Good structure and explanation, but could elaborate more on terminal value.",
                  score: 80,
                },
                {
                  question: "Tell me about a time you worked in a team.",
                  response_quality:
                    "Strong example, but could highlight your specific contributions more.",
                  score: 75,
                },
              ],
              behavioral_insights:
                "You demonstrate strong teamwork skills but should provide more detail on your individual impact.",
              technical_proficiency:
                "Solid understanding of core finance concepts, especially valuation techniques.",
              communication_analysis:
                "Clear and professional communication style.",
              transcript_quality_notes:
                "Responses are generally well-structured, but some answers could be more concise.",
            },
            analysis_summary:
              "Overall, you performed well in both technical and behavioral areas. Focus on providing more detail in your examples and structuring your responses for maximum clarity.",
            created_at: new Date().toISOString(),
          }}
          isPreview={true}
        />
      </div>
    </section>
  );
}
