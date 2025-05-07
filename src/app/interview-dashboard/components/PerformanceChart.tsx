"use client";

import React, { useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Area,
  ComposedChart,
} from "recharts";
import { InterviewAnalysis } from "../data/types";
import { InterviewScore, TimeRangeOption } from "../data/mockData";

// Custom tooltip for the latest score
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`bg-white p-3 border border-slate-200 rounded-md shadow-md`}
      >
        <p className="font-semibold mb-1">{label}</p>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-[#59B7F2] rounded-full mr-2"></span>
          <span className="text-sm">
            AI score: <span className="font-semibold">{payload[0].value}</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

type Props = {
  analyses?: InterviewAnalysis[];
  mockScores: InterviewScore[];
};

export default function PerformanceChart({ analyses, mockScores }: Props) {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>("30");

  // Prepare data for chart display
  let chartData: { date: string; score: number }[] = [];
  if (analyses && analyses.length > 0) {
    // Prepare unsanitized data with rawDate for filtering/sorting
    let unsanitized = analyses
      .map((a) => ({
        date: new Date(a.created_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        score: a.overall_score,
        rawDate: a.created_at,
      }))
      .sort(
        (a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
      );
    // Filter by timeRange
    if (timeRange !== "all") {
      const days = parseInt(timeRange, 10);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      unsanitized = unsanitized.filter(
        (item) => new Date(item.rawDate) >= cutoff
      );
    }
    chartData = unsanitized.map(({ date, score }) => ({ date, score }));
  } else {
    // Fallback to mock data
    chartData = mockScores.map((item) => ({
      date: item.formattedDate || item.date,
      score: item.score,
    }));
  }

  // Get the latest score for the reference point
  const latestScore =
    chartData.length > 0 ? chartData[chartData.length - 1] : null;

  return (
    <div className="w-full bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Performance Over Time
        </h2>

        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRangeOption)}
            className="appearance-none bg-white border border-slate-200 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="all">All time</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickCount={6}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Add a light blue area beneath the line */}
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#59B7F2" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#59B7F2" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="score"
                stroke="none"
                fillOpacity={1}
                fill="url(#colorScore)"
              />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#59B7F2"
                strokeWidth={3}
                dot={{ r: 4, fill: "#59B7F2", stroke: "#59B7F2" }}
                activeDot={{
                  r: 6,
                  fill: "#59B7F2",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />

              {/* Latest score reference point with pop-up label */}
              {latestScore && (
                <ReferenceDot
                  x={latestScore.date}
                  y={latestScore.score}
                  r={8}
                  fill="#59B7F2"
                  stroke="white"
                  strokeWidth={2}
                >
                  <Label
                    value={latestScore.score}
                    position="top"
                    fill="#0F172A"
                    fontSize={14}
                    fontWeight="bold"
                  />
                </ReferenceDot>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            No interview data available for the selected time range
          </div>
        )}
      </div>
    </div>
  );
}

const Label = ({ value, position, fill, fontSize, fontWeight }: any) => {
  return (
    <g>
      <text
        x={0}
        y={0}
        dy={-20}
        fill={fill}
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAnchor="middle"
      >
        {value}
      </text>
    </g>
  );
};
