"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../../lib/supabase";

interface Section {
  id: string;
  label: string;
  question?: string;
}

interface InterviewAnalysisResult {
  id: string;
  session_id: string;
  overall_score: number;
  technical_score: number;
  behavioral_score: number;
  communication_score: number;
  confidence_score: number;
  strengths: string[];
  areas_for_improvement: string[];
  detailed_feedback: {
    question_responses: Array<{
      question: string;
      response_quality: string;
      score: number;
    }>;
    behavioral_insights: string;
    technical_proficiency: string;
    communication_analysis: string;
    transcript_quality_notes: string;
  };
  analysis_summary: string;
  created_at: string;
}

interface InterviewAnalysisProps {
  analysisId: string;
  onClose: () => void;
  initialData?: InterviewAnalysisResult;
  isPreview?: boolean;
}

export default function InterviewAnalysis({
  analysisId: interviewId,
  onClose,
  initialData,
  isPreview = false,
}: InterviewAnalysisProps) {
  const [analysis, setAnalysis] = useState<InterviewAnalysisResult | null>(
    initialData || null
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    if (!initialData && interviewId) {
      fetchAnalysis();
    }
  }, [interviewId, initialData]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: sessions, error: sessionError } = await supabase
        .from("interview_sessions")
        .select("id")
        .eq("interview_id", interviewId)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(1);

      if (sessionError) throw sessionError;
      if (!sessions || sessions.length === 0) {
        throw new Error("No completed session found for this interview");
      }

      const sessionId = sessions[0].id;

      const { data: analysisData, error: analysisError } = await supabase
        .from("interview_analyses")
        .select("*")
        .eq("session_id", sessionId)
        .single();

      if (analysisError) throw analysisError;
      if (!analysisData) throw new Error("Analysis not found");

      setAnalysis(analysisData as InterviewAnalysisResult);
      setLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const renderScoreRing = (score: number) => {
    const circumference = 2 * Math.PI * 45; // r = 45
    const offset = circumference - (score / 100) * circumference;

    // Use green for >= 80, yellow for 60-79, red for < 60
    const scoreColorClass =
      score >= 80
        ? "text-[#4ADE80]"
        : score >= 60
        ? "text-[#FACC15]"
        : "text-[#F87171]"; // Green-400, Yellow-400, Red-400

    return (
      <div className="relative h-28 w-28">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-[#E6E8F0]"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className={`transition-all duration-1000 ease-out ${scoreColorClass}`}
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
          </span>
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

  const getSections = (analysis: InterviewAnalysisResult): Section[] => {
    const sections: Section[] = [{ id: "overview", label: "Overview" }];

    // Add a section for each question
    analysis.detailed_feedback.question_responses.forEach((response, index) => {
      sections.push({
        id: `question_${index}`,
        label: `Question ${index + 1}`,
        question: response.question,
      });
    });

    return sections;
  };

  const renderSectionContent = (sectionId: string) => {
    if (!analysis) return null;

    switch (sectionId) {
      case "overview":
        return (
          <motion.div
            key="overview"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">Summary</h3>
              <p className="text-slate-700">{analysis.analysis_summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="flex flex-col h-full justify-between bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Strengths
                </h3>
                <div className="filter blur-sm select-none pointer-events-none">
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
                <div className="flex flex-col items-center justify-center mt-4">
                  <svg
                    className="w-8 h-8 text-[#1E3A8A] mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 17a2 2 0 002-2v-2a2 2 0 10-4 0v2a2 2 0 002 2zm6-2v-2a6 6 0 10-12 0v2a2 2 0 00-2 2v3a2 2 0 002 2h12a2 2 0 002-2v-3a2 2 0 00-2-2z"
                    />
                  </svg>
                  <button
                    className="bg-[#1E3A8A] text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-[#1E3A8A]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#59B7F2]"
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("join-waitlist");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    Unlock with Pro
                  </button>
                </div>
              </div>

              <div className="flex flex-col h-full justify-between bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Areas for Improvement
                </h3>
                <div className="filter blur-sm select-none pointer-events-none">
                  <ul className="space-y-2">
                    {analysis.areas_for_improvement.map(
                      (area: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-[#59B7F2] mr-2">•</span>
                          <span className="text-slate-700">{area}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="flex flex-col items-center justify-center mt-4">
                  <svg
                    className="w-8 h-8 text-[#1E3A8A] mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 17a2 2 0 002-2v-2a2 2 0 10-4 0v2a2 2 0 002 2zm6-2v-2a6 6 0 10-12 0v2a2 2 0 00-2 2v3a2 2 0 002 2h12a2 2 0 002-2v-3a2 2 0 00-2-2z"
                    />
                  </svg>
                  <button
                    className="bg-[#1E3A8A] text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-[#1E3A8A]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#59B7F2]"
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("join-waitlist");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    Unlock with Pro
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Technical Proficiency
                </h3>
                <div className="filter blur-sm select-none pointer-events-none">
                  <p className="text-slate-700">
                    {analysis.detailed_feedback.technical_proficiency}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Behavioral Insights
                </h3>
                <div className="filter blur-sm select-none pointer-events-none">
                  <p className="text-slate-700">
                    {analysis.detailed_feedback.behavioral_insights}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Communication Analysis
                </h3>
                <div className="filter blur-sm select-none pointer-events-none">
                  <p className="text-slate-700">
                    {analysis.detailed_feedback.communication_analysis}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Transcript Quality
                </h3>
                <div className="filter blur-sm select-none pointer-events-none">
                  <p className="text-slate-700">
                    {analysis.detailed_feedback.transcript_quality_notes}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        // Handle question sections
        if (sectionId.startsWith("question_")) {
          const questionIndex = parseInt(sectionId.split("_")[1]);
          const questionData =
            analysis.detailed_feedback.question_responses[questionIndex];

          if (!questionData) return null;

          return (
            <motion.div
              key={sectionId}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center mb-4">
                <div className="bg-[#1E3A8A]/10 rounded-full h-16 w-16 flex items-center justify-center mr-4">
                  <span className="text-2xl font-bold text-[#1E3A8A]">
                    {questionData.score}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#1E3A8A]">
                  Question {questionIndex + 1}
                </h2>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Question
                </h3>
                <p className="text-slate-700 mb-4 italic">
                  "{questionData.question}"
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Response Analysis
                </h3>
                <p className="text-slate-700">
                  {questionData.response_quality}
                </p>
              </div>
            </motion.div>
          );
        }
        return null;
    }
  };

  // If isPreview, render the full card layout (not modal)
  if (isPreview && analysis) {
    return (
      <div className="bg-white rounded-xl shadow-xl w-full overflow-hidden border border-slate-200">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-[#1E3A8A]/5 md:min-h-[600px] border-r border-slate-200 flex-shrink-0">
            <nav className="space-y-1 p-4">
              {analysis &&
                getSections(analysis).map((section) => (
                  <div
                    key={section.id}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                      section.id === "overview"
                        ? "bg-[#59B7F2] text-white"
                        : "text-[#1E3A8A]"
                    }`}
                  >
                    <div>
                      <div>{section.label}</div>
                      {section.question && (
                        <div className="text-xs mt-1 line-clamp-2 opacity-80">
                          {section.question}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </nav>
            <div className="mt-8 pt-6 border-t border-slate-200 px-4">
              <div className="flex items-center justify-center mb-4">
                {renderScoreRing(analysis.overall_score)}
              </div>
              <p className="text-center text-sm text-slate-600 mb-6">
                Overall Score
              </p>
              {/* Key Metrics */}
              <div className="space-y-6">
                {/* Strengths */}
                <div>
                  <h4 className="text-sm font-medium text-[#1E3A8A] mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    Key Strengths
                  </h4>
                  <div className="filter blur-sm select-none pointer-events-none">
                    <ul className="space-y-2">
                      {analysis.strengths.slice(0, 3).map((strength, index) => (
                        <li
                          key={index}
                          className="text-sm text-slate-700 flex items-start"
                        >
                          <span className="text-[#59B7F2] mr-2">•</span>
                          <span className="line-clamp-2">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Areas for Improvement */}
                <div>
                  <h4 className="text-sm font-medium text-[#1E3A8A] mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    Areas to Improve
                  </h4>
                  <div className="filter blur-sm select-none pointer-events-none">
                    <ul className="space-y-2">
                      {analysis.areas_for_improvement
                        .slice(0, 3)
                        .map((area, index) => (
                          <li
                            key={index}
                            className="text-sm text-slate-700 flex items-start"
                          >
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span className="line-clamp-2">{area}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                {/* Performance Metrics */}
                <div>
                  <h4 className="text-sm font-medium text-[#1E3A8A] mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Performance
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                      <div className="text-sm font-semibold text-[#1E3A8A]">
                        {analysis.technical_score}
                      </div>
                      <div className="text-xs text-slate-600">Technical</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                      <div className="text-sm font-semibold text-[#1E3A8A]">
                        {analysis.behavioral_score}
                      </div>
                      <div className="text-xs text-slate-600">Behavioral</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                      <div className="text-sm font-semibold text-[#1E3A8A]">
                        {analysis.communication_score}
                      </div>
                      <div className="text-xs text-slate-600">Comm.</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                      <div className="text-sm font-semibold text-[#1E3A8A]">
                        {analysis.confidence_score}
                      </div>
                      <div className="text-xs text-slate-600">Confidence</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Main content */}
          <div className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">
              {renderSectionContent("overview")}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl border border-white/10 shadow-sm max-w-4xl w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#59B7F2] mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-[#1E3A8A] mb-2">
            Loading Analysis
          </h3>
          <p className="text-slate-700">
            Retrieving your interview analysis results...
          </p>
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
          <h3 className="text-xl font-bold text-[#1E3A8A]">
            Interview Analysis
          </h3>
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
              {analysis &&
                getSections(analysis).map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                      activeSection === section.id
                        ? "bg-[#59B7F2] text-white"
                        : "text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
                    }`}
                  >
                    <div>
                      <div>{section.label}</div>
                      {section.question && (
                        <div className="text-xs mt-1 line-clamp-2 opacity-80">
                          {section.question}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-center mb-4">
                {renderScoreRing(analysis.overall_score)}
              </div>
              <p className="text-center text-sm text-slate-600 mb-6">
                Overall Score
              </p>

              {/* Key Metrics */}
              <div className="space-y-6">
                {/* Strengths */}
                <div>
                  <h4 className="text-sm font-medium text-[#1E3A8A] mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    Key Strengths
                  </h4>
                  <div className="filter blur-sm select-none pointer-events-none">
                    <ul className="space-y-2">
                      {analysis.strengths.slice(0, 3).map((strength, index) => (
                        <li
                          key={index}
                          className="text-sm text-slate-700 flex items-start"
                        >
                          <span className="text-[#59B7F2] mr-2">•</span>
                          <span className="line-clamp-2">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h4 className="text-sm font-medium text-[#1E3A8A] mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    Areas to Improve
                  </h4>
                  <div className="filter blur-sm select-none pointer-events-none">
                    <ul className="space-y-2">
                      {analysis.areas_for_improvement
                        .slice(0, 3)
                        .map((area, index) => (
                          <li
                            key={index}
                            className="text-sm text-slate-700 flex items-start"
                          >
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span className="line-clamp-2">{area}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h4 className="text-sm font-medium text-[#1E3A8A] mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Performance
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                      <div className="text-sm font-semibold text-[#1E3A8A]">
                        {analysis.technical_score}
                      </div>
                      <div className="text-xs text-slate-600">Technical</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                      <div className="text-sm font-semibold text-[#1E3A8A]">
                        {analysis.behavioral_score}
                      </div>
                      <div className="text-xs text-slate-600">Behavioral</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                      <div className="text-sm font-semibold text-[#1E3A8A]">
                        {analysis.communication_score}
                      </div>
                      <div className="text-xs text-slate-600">Comm.</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                      <div className="text-sm font-semibold text-[#1E3A8A]">
                        {analysis.confidence_score}
                      </div>
                      <div className="text-xs text-slate-600">Confidence</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">
              {renderSectionContent(activeSection)}
            </AnimatePresence>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1E3A8A]/10 hover:bg-[#B3E5FC] text-[#1E3A8A] rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
