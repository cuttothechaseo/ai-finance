"use client";

import { motion } from "framer-motion";

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-green-500 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function Pricing() {
  return (
    <section
      id="join-waitlist"
      className="py-16 relative overflow-hidden bg-[#59B7F2]"
    >
      {/* Cloud elements for visual consistency */}
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
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-white text-center">
          Break Into <span className="text-[#B3E5FC]">Wall Street</span> — With{" "}
          <span className="text-[#B3E5FC]">AI</span> on Your Side
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-xl p-8 md:p-10 bg-white border border-white/10 shadow-lg max-w-md w-full"
        >
          <h2 className="text-2xl font-bold mb-1 text-[#1E3A8A]">
            Wall Street AI Pro
          </h2>
          <p className="text-[#1E3A8A]/80 mb-6">
            Land elite finance roles with AI on your side
          </p>
          <div className="mb-2 flex items-end gap-2">
            <span className="text-3xl font-extrabold text-[#1E3A8A]">$119</span>
            <span className="text-xs text-[#1E3A8A]/80 pb-1">
              USD (One-time payment)
            </span>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-lg text-gray-400 line-through">$200</span>
            <span className="text-xs text-[#1E3A8A]/70">
              — limited-time launch offer
            </span>
          </div>
          <ul className="mb-8 space-y-3">
            <li className="flex items-center gap-2 text-[#1E3A8A] text-sm">
              <CheckIcon /> AI-powered mock interviews (behavioral + technical)
            </li>
            <li className="flex items-center gap-2 text-[#1E3A8A] text-sm">
              <CheckIcon /> Smart resume + cover letter builder
            </li>
            <li className="flex items-center gap-2 text-[#1E3A8A] text-sm">
              <CheckIcon /> AI feedback on your interview performance
            </li>
            <li className="flex items-center gap-2 text-[#1E3A8A] text-sm">
              <CheckIcon /> Personalized networking message generator
            </li>
            <li className="flex items-center gap-2 text-[#1E3A8A] text-sm">
              <CheckIcon /> Lifetime access — no subscription
            </li>
          </ul>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 bg-[#1E3A8A] text-white text-lg font-semibold rounded-full shadow hover:bg-[#1E3A8A]/90 transition mb-2"
          >
            Get Instant Access
          </motion.button>
          <p className="text-xs text-[#1E3A8A]/70 text-center mt-2">
            One-time payment. Instant access forever.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
