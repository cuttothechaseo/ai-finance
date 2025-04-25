"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSkillsSummary } from "../data/mockData";

export default function SkillsCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { strengths, weaknesses } = getSkillsSummary();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full">
      {/* Card Header with Toggle */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleExpand}
      >
        <h3 className="text-lg font-semibold text-[#1e3a8a]">
          Top Skills & Weaknesses
        </h3>
        <button
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
              isExpanded ? "transform rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4">
              {/* Strongest Categories */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Strongest Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {strengths.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Areas to Improve */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Areas to improve
                </h4>
                <div className="flex flex-wrap gap-2">
                  {weaknesses.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
