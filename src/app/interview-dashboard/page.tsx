"use client";

import React from "react";
import PerformanceChart from "./components/PerformanceChart";
import SkillsCard from "./components/SkillsCard";
import FeedbackCard from "./components/FeedbackCard";
import RecentInterviewsTable from "./components/RecentInterviewsTable";
import DashboardLayout from "./components/DashboardLayout";

export default function InterviewDashboard() {
  return (
    <DashboardLayout>
      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-[#1e3a8a] mb-4">
          Performance Overview
        </h2>
        <PerformanceChart />
      </div>

      {/* Skills and Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <SkillsCard />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <FeedbackCard />
        </div>
      </div>

      {/* Recent Interviews Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-[#1e3a8a] mb-4">
          Recent Interviews
        </h2>
        <RecentInterviewsTable />
      </div>
    </DashboardLayout>
  );
}
