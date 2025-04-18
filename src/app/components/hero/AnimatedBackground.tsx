"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Subtle gradient overlay - using a lighter blue as the base color */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4CB1F5] to-[#59B7F2] opacity-70"></div>

      {/* Animated cloud-like shapes */}
      <motion.svg
        className="absolute top-1/4 left-1/3 w-40 h-40 opacity-10"
        viewBox="0 0 200 200"
        fill="white"
        animate={{
          y: [0, 15, 0],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <circle cx="60" cy="60" r="50" />
        <circle cx="100" cy="70" r="60" />
        <circle cx="140" cy="60" r="50" />
      </motion.svg>

      {/* Subtle shimmer effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 70%)",
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
