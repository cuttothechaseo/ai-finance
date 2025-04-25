"use client";

import { motion } from "framer-motion";
import React from "react";

// Step type definition
type Step = {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: JSX.Element;
};

export default function HowItWorks() {
  // Steps data
  const steps: Step[] = [
    {
      id: "1",
      number: 1,
      title: "Perfect Your Resume",
      description:
        "Get AI-powered analysis of your resume with detailed feedback on content, formatting, and industry relevance.",
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
      number: 2,
      title: "Craft Networking Messages",
      description:
        "Create personalized outreach messages for LinkedIn, email, and cover letters to connect with finance professionals.",
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
    {
      id: "3",
      number: 3,
      title: "Master Mock Interviews",
      description:
        "Practice with AI-powered finance interview questions and receive instant feedback to improve your responses.",
      icon: (
        <svg
          className="w-14 h-14 text-[#1E293B]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 4L12 14.01L9 11.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-16 relative overflow-hidden bg-[#59B7F2]"
    >
      {/* Cloud elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="absolute top-0 left-0 w-80 h-80 opacity-5"
          viewBox="0 0 200 200"
          fill="white"
        >
          <circle cx="60" cy="60" r="50" />
          <circle cx="100" cy="70" r="60" />
          <circle cx="140" cy="60" r="50" />
        </svg>

        <svg
          className="absolute bottom-20 right-0 w-72 h-72 opacity-5"
          viewBox="0 0 200 200"
          fill="white"
        >
          <circle cx="60" cy="60" r="50" />
          <circle cx="100" cy="70" r="60" />
          <circle cx="140" cy="60" r="50" />
        </svg>

        <svg
          className="absolute top-[30%] right-[25%] w-40 h-40 opacity-5"
          viewBox="0 0 200 200"
          fill="white"
        >
          <circle cx="60" cy="60" r="50" />
          <circle cx="100" cy="70" r="60" />
          <circle cx="140" cy="60" r="50" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white"
          >
            Your <span className="text-[#B3E5FC]">Guaranteed Path</span> to
            Elite Finance Offers
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/90 max-w-3xl mx-auto text-lg"
          >
            Students who follow these 3 steps are 4x more likely to receive
            offers from Goldman Sachs, JP Morgan, and other top-tier firms.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative rounded-xl p-8 flex flex-col h-full overflow-hidden bg-white border border-white/10 shadow-sm"
            >
              {/* Gradient background with animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/5 to-white/90 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Blurred glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-white/20 to-[#1E3A8A]/10 rounded-xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>

              {/* Step number (background) */}
              <div className="absolute -right-4 -top-4 text-[#E6E8F0] font-bold text-[150px] opacity-20 select-none">
                {step.number}
              </div>

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
                      {React.cloneElement(step.icon, {
                        className: "w-14 h-14 text-[#1E3A8A]",
                      })}
                    </motion.div>
                  </div>
                </motion.div>

                {/* Step title with enhanced number */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#1E3A8A] flex items-center">
                    <span className="text-2xl mr-2 text-[#1E3A8A] font-semibold group-hover:drop-shadow-[0_0_6px_rgba(30,58,138,0.5)] transition-all duration-300">
                      Step {step.number}:
                    </span>
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-slate-700">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
