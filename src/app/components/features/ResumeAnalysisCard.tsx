"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type TabType =
  | "overview"
  | "content"
  | "formatting"
  | "relevance"
  | "impact"
  | "edits";

interface ResumeAnalysisProps {
  isPreview?: boolean;
}

// Function to determine color based on score
const getScoreColor = (score: number) => {
  if (score >= 80) return "#4ADE80"; // Green for high scores
  if (score > 60) return "#FBBF24"; // Yellow/amber for medium scores
  return "#EF4444"; // Red for low scores
};

export default function ResumeAnalysisCard({
  isPreview = true,
}: ResumeAnalysisProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Sample data for the resume analysis
  const analysisData = {
    overallScore: 85,
    sections: {
      content: { score: 90, label: "Content Quality" },
      formatting: { score: 60, label: "Formatting" },
      relevance: { score: 85, label: "Industry Relevance" },
      impact: { score: 75, label: "Impact Statements" },
    },
    strengths: [
      "Strong technical background with Finance major and Computer Science minor",
      "Relevant internship experience in Technology Equity Capital Markets",
      "Demonstrated skills in financial modeling and company valuation",
      "Experience with IPO execution and secondary offerings for technology companies",
    ],
    improvements: [
      "Quantify achievements more specifically to showcase impact in financial transactions",
      "Add more technical skills relevant to technology investment banking",
      "Highlight specific M&A or IPO transactions worked on with measurable results",
      "Incorporate more technology industry keywords to demonstrate domain knowledge",
    ],
    summary:
      "This resume demonstrates a solid foundation for a career in Technology Investment Banking, with relevant academic credentials and internship experience at Credit Suisse. The candidate has gained exposure to IPO execution and secondary offerings in software and fintech sectors. While the resume shows good potential, it could be strengthened by quantifying achievements, highlighting specific technical skills, and showcasing more technology sector knowledge to stand out to firms like Morgan Stanley.",
  };

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  // If preview mode is enabled, show the card only
  if (isPreview) {
    return (
      <div className="relative">
        <motion.div
          className="bg-white p-6 rounded-xl border border-white/10 shadow-sm cursor-pointer h-full"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-14 h-14 bg-[#1E3A8A]/10 rounded-lg flex items-center justify-center mb-6 text-[#1E3A8A]">
            <svg
              className="w-6 h-6"
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
          </div>
          <h3 className="text-xl font-bold mb-3 text-[#1E3A8A]">
            Resume Analysis
          </h3>
          <p className="text-slate-700">
            Get detailed feedback on your resume with AI-powered analysis of
            content, formatting, and industry relevance.
          </p>

          {/* Preview of score */}
          <div className="mt-4 flex justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="white"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-green-500"
                  strokeWidth="4"
                  strokeDasharray={251.2}
                  strokeDashoffset={
                    251.2 - (251.2 * analysisData.overallScore) / 100
                  }
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span
                  className="text-2xl font-bold"
                  style={{ color: getScoreColor(analysisData.overallScore) }}
                >
                  {analysisData.overallScore}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Full analysis view
  return (
    <div className="bg-white rounded-xl shadow-xl w-full overflow-hidden border border-slate-200">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar with tabs */}
        <div className="w-full md:w-64 bg-[#1E3A8A]/5 md:min-h-[600px] border-r border-slate-200">
          <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible p-4 space-y-1">
            <button
              className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                activeTab === "overview"
                  ? "bg-[#59B7F2] text-white"
                  : "text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
              }`}
              onClick={() => handleTabClick("overview")}
            >
              Overview
            </button>
            <button
              className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                activeTab === "content"
                  ? "bg-[#59B7F2] text-white"
                  : "text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
              }`}
              onClick={() => handleTabClick("content")}
            >
              Content Quality
            </button>
            <button
              className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                activeTab === "formatting"
                  ? "bg-[#59B7F2] text-white"
                  : "text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
              }`}
              onClick={() => handleTabClick("formatting")}
            >
              Formatting
            </button>
            <button
              className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                activeTab === "relevance"
                  ? "bg-[#59B7F2] text-white"
                  : "text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
              }`}
              onClick={() => handleTabClick("relevance")}
            >
              Industry Relevance
            </button>
            <button
              className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                activeTab === "impact"
                  ? "bg-[#59B7F2] text-white"
                  : "text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
              }`}
              onClick={() => handleTabClick("impact")}
            >
              Impact Statements
            </button>
            <button
              className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                activeTab === "edits"
                  ? "bg-[#59B7F2] text-white"
                  : "text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
              }`}
              onClick={() => handleTabClick("edits")}
            >
              Suggested Edits
            </button>
          </nav>

          {/* Score indicator */}
          <div className="hidden md:block mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-center mb-4">
              <div className="relative h-28 w-28">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    className="text-gray-200"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="white"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                  {/* Progress circle */}
                  <circle
                    className="text-[#4ADE80]"
                    strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={
                      2 * Math.PI * 45 * (1 - analysisData.overallScore / 100)
                    }
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: getScoreColor(analysisData.overallScore) }}
                  >
                    {analysisData.overallScore}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-slate-600">Overall Score</p>
          </div>

          {/* Key strengths */}
          <div className="hidden md:block mt-6 px-4">
            <h4 className="text-sm font-medium text-[#1E3A8A] mb-2">
              Key Strengths
            </h4>
            <ul className="space-y-1">
              {analysisData.strengths.slice(0, 3).map((strength, index) => (
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

        {/* Main content area */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="md:hidden mb-6 flex justify-center">
                <div className="relative h-28 w-28">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      className="text-gray-200"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="white"
                      r="45"
                      cx="50"
                      cy="50"
                    />
                    {/* Progress circle */}
                    <circle
                      className="text-[#4ADE80]"
                      strokeWidth="4"
                      strokeDasharray={2 * Math.PI * 45}
                      strokeDashoffset={
                        2 * Math.PI * 45 * (1 - analysisData.overallScore / 100)
                      }
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="45"
                      cx="50"
                      cy="50"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-2xl font-bold"
                      style={{
                        color: getScoreColor(analysisData.overallScore),
                      }}
                    >
                      {analysisData.overallScore}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Summary
                </h3>
                <p className="text-slate-700">{analysisData.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysisData.strengths.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#59B7F2] mr-2">•</span>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {analysisData.improvements.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#59B7F2] mr-2">•</span>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-4">
                  Section Scores
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analysisData.sections).map(
                    ([key, section]) => (
                      <div
                        key={key}
                        className="bg-white p-4 rounded-lg text-center border border-[#1E3A8A]/30"
                      >
                        <div
                          className="text-2xl font-bold mb-1"
                          style={{ color: getScoreColor(section.score) }}
                        >
                          {section.score}
                        </div>
                        <div className="text-sm text-slate-600">
                          {section.label}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <div className="bg-white rounded-full h-16 w-16 flex items-center justify-center mr-4 border-2 border-[#1E3A8A]/30">
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color: getScoreColor(analysisData.sections.content.score),
                    }}
                  >
                    {analysisData.sections.content.score}
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
                  Your resume content demonstrates strong experience in finance
                  with prestigious firms. However, it could be improved by
                  adding more specific metrics and achievements.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Improvement Suggestions
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      Add specific metrics and achievements to showcase your
                      impact
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      Enhance role descriptions to focus more on your
                      contributions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      Tailor your experience to align with the requirements of
                      target positions
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "formatting" && (
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <div className="bg-white rounded-full h-16 w-16 flex items-center justify-center mr-4 border-2 border-[#1E3A8A]/30">
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color: getScoreColor(
                        analysisData.sections.formatting.score
                      ),
                    }}
                  >
                    {analysisData.sections.formatting.score}
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
                  The formatting of your resume needs significant improvement.
                  The current layout is difficult to scan and lacks visual
                  hierarchy, potentially causing recruiters to miss key
                  information. Inconsistent spacing and formatting decrease
                  overall readability.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Improvement Suggestions
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      Restructure content with clear section headings and
                      consistent formatting
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      Use bullet points consistently with action verbs at the
                      beginning of each point
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      Balance white space and create clear visual separation
                      between sections
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      Consider using a modern resume template with professional
                      formatting
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "relevance" && (
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <div className="bg-white rounded-full h-16 w-16 flex items-center justify-center mr-4 border-2 border-[#1E3A8A]/30">
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color: getScoreColor(
                        analysisData.sections.relevance.score
                      ),
                    }}
                  >
                    {analysisData.sections.relevance.score}
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
                  Your experience is highly relevant to finance roles, with
                  particularly strong alignment to investment management and
                  distressed debt positions. The financial expertise you
                  showcase is valuable for the target industry.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Improvement Suggestions
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      Highlight industry-specific keywords and skills
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      Showcase relevant technical skills for finance roles
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      Emphasize your educational qualifications in finance
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "impact" && (
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <div className="bg-white rounded-full h-16 w-16 flex items-center justify-center mr-4 border-2 border-[#1E3A8A]/30">
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color: getScoreColor(analysisData.sections.impact.score),
                    }}
                  >
                    {analysisData.sections.impact.score}
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
                  Your impact statements could be strengthened to better
                  highlight your contributions and results. Currently, they
                  focus more on responsibilities than on measurable
                  achievements.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Improvement Suggestions
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      Add more quantifiable results like portfolio size and
                      return percentages
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      Highlight leadership contributions and initiative-taking
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      Demonstrate problem-solving abilities and how you overcame
                      challenges
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "edits" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                Suggested Edits
              </h2>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <h4 className="font-bold text-[#1E3A8A] mb-3">
                    Experience Section
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        Original Text:
                      </p>
                      <div className="bg-[#1E3A8A]/5 p-3 rounded text-slate-700 text-sm">
                        &quot;Managed technology portfolio at Credit
                        Suisse&quot;
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        Improved Text:
                      </p>
                      <div className="bg-[#59B7F2]/10 border border-[#B3E5FC] p-3 rounded text-[#1E3A8A] text-sm">
                        &quot;Analyzed and valued 15+ software and fintech
                        companies for IPO readiness at Credit Suisse,
                        contributing to successful public offerings raising over
                        $2.3B in capital&quot;
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <h4 className="font-bold text-[#1E3A8A] mb-3">
                    Skills Section
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        Original Text:
                      </p>
                      <div className="bg-[#1E3A8A]/5 p-3 rounded text-slate-700 text-sm">
                        &quot;Financial analysis, Excel, portfolio
                        management&quot;
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        Improved Text:
                      </p>
                      <div className="bg-[#59B7F2]/10 border border-[#B3E5FC] p-3 rounded text-[#1E3A8A] text-sm">
                        &quot;Financial modeling (DCF, LBO, M&amp;A), Python for
                        data analysis, Excel/VBA, company valuation, pitch book
                        creation, IPO execution process, SQL, Bloomberg
                        Terminal&quot;
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <h4 className="font-bold text-[#1E3A8A] mb-3">
                    Education Format
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        Original Text:
                      </p>
                      <div className="bg-[#1E3A8A]/5 p-3 rounded text-slate-700 text-sm">
                        &quot;Cornell University - Finance - 2026&quot;
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        Improved Text:
                      </p>
                      <div className="bg-[#59B7F2]/10 border border-[#B3E5FC] p-3 rounded text-[#1E3A8A] text-sm">
                        &quot;CORNELL UNIVERSITY | Ithaca, NY
                        <br />
                        Bachelor of Science in Finance, Minor in Computer
                        Science | GPA: 3.8/4.0 | May 2026
                        <br />• Relevant Coursework: Corporate Finance,
                        Investment Banking, Financial Modeling, Data Structures,
                        Algorithms, Database Systems&quot;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
