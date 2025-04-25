"use client";

import { motion } from "framer-motion";
import ResumeAnalysisCard from "./ResumeAnalysisCard";
import NetworkingOutreachCard from "./NetworkingOutreachCard";
import React from "react";

// Feature type definition
type Feature = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
};

export default function Features() {
  // Features data
  const features: Feature[] = [
    {
      id: "1",
      title: "Resume Analysis",
      description:
        "Get detailed AI-powered feedback on your resume to stand out to finance recruiters.",
      icon: (
        <svg
          className="w-14 h-14 text-[#1E293B]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "2",
      title: "Networking Outreach",
      description:
        "Generate personalized outreach messages for networking on LinkedIn and other platforms.",
      icon: (
        <svg
          className="w-14 h-14 text-[#1E293B]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "3",
      title: "Mock Interviews",
      description:
        "Practice with our AI interviewer that provides real-time feedback on your responses.",
      icon: (
        <svg
          className="w-14 h-14 text-[#1E293B]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="10" r="1" fill="currentColor" />
          <circle cx="12" cy="10" r="1" fill="currentColor" />
          <circle cx="16" cy="10" r="1" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="features"
      className="py-16 bg-[#59B7F2] relative overflow-hidden"
    >
      {/* Cloud elements */}
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

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            AI-Powered <span className="text-[#B3E5FC]">Features</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Our platform uses advanced AI to help you prepare for and land your
            dream finance job
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative rounded-xl p-8 flex flex-col h-full overflow-hidden bg-white border border-white/10 shadow-sm"
            >
              {/* Gradient background with animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/5 to-white/90 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Blurred glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-white/20 to-[#1E3A8A]/10 rounded-xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>

              {/* Content container */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Icon with hover animation */}
                <motion.div
                  className="mb-6 relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-[#1E3A8A]/10 w-20 h-20 rounded-lg flex items-center justify-center shadow-md">
                    <motion.div
                      whileHover={{
                        color: "#1E3A8A",
                        transition: { duration: 0.3 },
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        className: "w-14 h-14 text-[#1E3A8A]",
                      })}
                    </motion.div>
                  </div>
                </motion.div>

                {/* Feature title */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#1E3A8A]">
                    {feature.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-slate-700">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Resume Analysis Feature Detail */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            AI-Powered <span className="text-[#B3E5FC]">Resume Analysis</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Get comprehensive feedback on your resume to help you land your
            dream finance job
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto mb-24"
        >
          <ResumeAnalysisCard isPreview={false} />
        </motion.div>

        {/* Networking Outreach Feature Detail */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            AI-Powered{" "}
            <span className="text-[#B3E5FC]">Networking Outreach</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Generate personalized outreach messages to connect with finance
            professionals
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <NetworkingOutreachCard isPreview={false} />
        </motion.div>
      </div>
    </section>
  );
}
