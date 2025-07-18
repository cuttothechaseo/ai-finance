"use client";

import React from "react";
import Link from "next/link";
import { InterviewAnalysis } from "../data/types";

// For fallback
import { InterviewSession } from "../data/mockData";

type Props = {
  analyses?: (InterviewAnalysis & {
    session: {
      interview: {
        id: string;
        company: string;
        role: string;
        interview_type: string;
      };
      id: string;
      created_at: string;
    };
  })[];
  mockInterviews: InterviewSession[];
  onViewReport?: (interviewId: string) => void;
};

export default function RecentInterviewsTable({
  analyses,
  mockInterviews,
  onViewReport,
}: Props) {
  let rows: any[] = [];
  if (analyses && analyses.length > 0) {
    rows = analyses.map((a) => ({
      id: a.session.interview.id,
      sessionId: a.session.id,
      formattedDate: new Date(a.session.created_at).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
        }
      ),
      score: a.overall_score,
      company: a.session.interview.company,
      interviewPosition: a.session.interview.role,
      categories: [
        ...(a.technical_score !== undefined ? ["Technical"] : []),
        ...(a.behavioral_score !== undefined ? ["Behavioral"] : []),
        ...(a.communication_score !== undefined ? ["Communication"] : []),
        ...(a.confidence_score !== undefined ? ["Confidence"] : []),
      ],
    }));
  } else {
    rows = mockInterviews.map((interview) => ({
      id: interview.id,
      sessionId: interview.id,
      date: interview.date,
      formattedDate: interview.formattedDate,
      score: interview.score,
      company: (interview as any).company || interview.interviewType,
      interviewPosition:
        (interview as any).role ||
        interview.interviewPosition ||
        interview.interviewType,
      categories: interview.categories,
    }));
  }

  // Only show the last 3 interviews
  const rowsToShow = rows.slice(0, 3);

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <h2 className="text-xl font-semibold text-slate-800 p-6 border-b border-slate-200">
        Recent Interviews
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-sm font-medium text-slate-700">
                Date
              </th>
              <th className="px-6 py-3 text-sm font-medium text-slate-700">
                Score
              </th>
              <th className="px-6 py-3 text-sm font-medium text-slate-700">
                Interview Type
              </th>
              <th className="px-6 py-3 text-sm font-medium text-slate-700">
                CategoryBreakdown
              </th>
              <th className="px-6 py-3 text-sm font-medium text-slate-700"></th>
            </tr>
          </thead>
          <tbody>
            {rowsToShow.map((interview) => (
              <tr
                key={interview.sessionId || interview.id}
                className="border-b border-slate-200 hover:bg-slate-50"
              >
                <td className="px-6 py-4 text-sm text-slate-700">
                  {interview.formattedDate}
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  <span className={getScoreColorClass(interview.score)}>
                    {interview.score}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  <div className="flex flex-col">
                    <span>{interview.company}</span>
                    <span className="text-slate-500 text-xs">
                      {interview.interviewPosition}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {getCategoryDisplay(interview.categories)}
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  {onViewReport ? (
                    <button
                      onClick={() => onViewReport(interview.id)}
                      className="inline-block px-4 py-2 rounded-md bg-[#1E3A8A] text-white font-medium shadow-sm hover:bg-[#59B7F2] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    >
                      View Report
                    </button>
                  ) : (
                    <span className="inline-block px-4 py-2 rounded-md bg-[#1E3A8A] text-white font-medium shadow-sm cursor-default">
                      View Report
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <div className="px-6 py-3 text-center text-sm border-t border-slate-200">
          <a
            href="/interview-dashboard/generated-interviews"
            className="text-[#1E3A8A] hover:underline font-medium"
          >
            View All
          </a>
        </div>
      )}

      {rows.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-slate-500">No interview data available.</p>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getScoreColorClass(score: number): string {
  if (score >= 70) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

function getCategoryDisplay(categories: string[]): JSX.Element {
  return (
    <div className="flex flex-wrap gap-1">
      {categories.map((category, index) => {
        let categoryClass = "";

        switch (category) {
          case "Behavioral":
            categoryClass = "bg-blue-100 text-blue-800";
            break;
          case "Technical":
            categoryClass = "bg-purple-100 text-purple-800";
            break;
          case "Market Sizing":
            categoryClass = "bg-green-100 text-green-800";
            break;
          case "Communication":
            categoryClass = "bg-yellow-100 text-yellow-800";
            break;
          case "Confidence":
            categoryClass = "bg-pink-100 text-pink-800";
            break;
          default:
            categoryClass = "bg-slate-100 text-slate-800";
        }

        return (
          <span
            key={index}
            className={`${categoryClass} text-xs px-2 py-1 rounded`}
          >
            {category}
          </span>
        );
      })}
    </div>
  );
}
