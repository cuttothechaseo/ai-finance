"use client";

import React from "react";
import { recentInterviews } from "../data/mockData";
import Link from "next/link";

export default function RecentInterviewsTable() {
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
            {recentInterviews.map((interview) => (
              <tr
                key={interview.id}
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
                    <span>{interview.interviewType}</span>
                    <span className="text-slate-500 text-xs">
                      {interview.interviewPosition}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {getCategoryDisplay(interview.categories)}
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <Link
                    href={`/interview-dashboard/report/${interview.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Report
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {recentInterviews.length > 0 && (
        <div className="px-6 py-3 text-center text-sm text-slate-500 border-t border-slate-200">
          Recent interviews
        </div>
      )}

      {recentInterviews.length === 0 && (
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
