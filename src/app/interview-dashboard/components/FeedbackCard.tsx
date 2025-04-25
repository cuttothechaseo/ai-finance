"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getFeedbackHighlights } from "../data/mockData";

export default function FeedbackCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const feedbackPoints = getFeedbackHighlights();

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
          Feedback Highlights
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
            <div className="mt-4 space-y-3">
              {feedbackPoints.length > 0 ? (
                feedbackPoints.map((feedback: string, index: number) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700"
                  >
                    {feedback}
                  </div>
                ))
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-500 italic">
                  No feedback available yet. Complete more interviews to receive
                  feedback.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
