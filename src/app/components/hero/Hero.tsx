"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useContext } from "react";
import dynamic from "next/dynamic";
import { WaitlistContext } from "@/app/contexts/WaitlistContext";

// Dynamically import components to avoid hydration issues
const AnimatedBackground = dynamic(() => import("./AnimatedBackground"), {
  ssr: false,
});

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { setIsModalOpen } = useContext(WaitlistContext);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    // Clear initial content
    heading.innerHTML = "";

    // Define the text parts
    const firstLine = "Ace your Finance";
    const secondLine = "Interviews with AI";
    const fullText = firstLine + " " + secondLine; // Combine for smoother flow
    let index = 0;
    let lastTimestamp = 0;
    const charDelay = 60; // Adjusted to 60ms for a slightly faster typing speed

    // Typewriter animation using requestAnimationFrame
    const typeWriter = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;

      // Only update if enough time has passed (charDelay)
      if (timestamp - lastTimestamp >= charDelay) {
        if (index < fullText.length) {
          const currentText = fullText.slice(0, index + 1);

          // Handle line break and "AI" styling at the end
          if (index < firstLine.length) {
            heading.textContent = currentText; // First line
          } else if (index === firstLine.length) {
            heading.innerHTML = firstLine + "<br>"; // Add line break
          } else {
            const secondLineText = fullText.slice(
              firstLine.length + 1,
              index + 1
            );
            if (index >= fullText.length - 2) {
              // Reached "AI", apply styling
              heading.innerHTML = `${firstLine}<br>${secondLine.slice(
                0,
                -2
              )}<span class="text-[#B3E5FC]">AI</span>`;
            } else {
              heading.innerHTML = `${firstLine}<br>${secondLineText}`;
            }
          }
          index++;
          lastTimestamp = timestamp;
        } else {
          // Finish with the period
          heading.innerHTML = `${firstLine}<br>${secondLine.slice(
            0,
            -2
          )}<span class="text-[#B3E5FC]">AI.</span>`;
          return; // Stop animation
        }
      }

      requestAnimationFrame(typeWriter); // Continue animation
    };

    // Start after fade-in delay
    setTimeout(() => requestAnimationFrame(typeWriter), 200); // Matches 0.2s delay of motion.h1
  }, []); // Runs only once on mount

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#59B7F2] overflow-hidden pt-20">
      {/* Cloud elements */}
      <div className="absolute inset-0 z-0">
        {/* Top Right Cloud */}
        <motion.svg
          className="absolute top-0 right-0 w-64 h-64 opacity-20"
          viewBox="0 0 200 200"
          fill="white"
          animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="60" cy="60" r="50" />
          <circle cx="100" cy="70" r="60" />
          <circle cx="140" cy="60" r="50" />
        </motion.svg>

        {/* Middle Left Cloud */}
        <motion.svg
          className="absolute top-[30%] left-0 w-56 h-56 opacity-15"
          viewBox="0 0 200 200"
          fill="white"
          animate={{ y: [0, 10, 0], x: [0, 8, 0] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <circle cx="60" cy="60" r="50" />
          <circle cx="100" cy="70" r="60" />
          <circle cx="140" cy="60" r="50" />
        </motion.svg>

        {/* Bottom Left Cloud */}
        <motion.svg
          className="absolute bottom-0 left-0 w-72 h-72 opacity-20"
          viewBox="0 0 200 200"
          fill="white"
          animate={{ y: [0, -12, 0], x: [0, 10, 0] }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <circle cx="60" cy="60" r="50" />
          <circle cx="100" cy="70" r="60" />
          <circle cx="140" cy="60" r="50" />
        </motion.svg>

        {/* Small Bottom Right Cloud */}
        <motion.svg
          className="absolute bottom-[20%] right-[10%] w-40 h-40 opacity-15"
          viewBox="0 0 200 200"
          fill="white"
          animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <circle cx="60" cy="60" r="50" />
          <circle cx="100" cy="70" r="60" />
          <circle cx="140" cy="60" r="50" />
        </motion.svg>

        {/* Small Top Left Cloud */}
        <motion.svg
          className="absolute top-[15%] left-[20%] w-32 h-32 opacity-10"
          viewBox="0 0 200 200"
          fill="white"
          animate={{ y: [0, 6, 0], x: [0, 6, 0] }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <circle cx="60" cy="60" r="50" />
          <circle cx="100" cy="70" r="60" />
          <circle cx="140" cy="60" r="50" />
        </motion.svg>
      </div>

      <AnimatedBackground />

      <div className="container mx-auto px-4 py-16 text-center relative z-10">
        <motion.h1
          ref={headingRef} // Attach ref to manipulate content
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Initial content will be cleared and animated */}
          Ace your Finance
          <br />
          Interviews with <span className="text-[#B3E5FC]">AI.</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Get instant feedback on your answers, improve technical & behavioral
          skills, and land your dream finance job.
        </motion.p>

        <motion.div
          className="flex justify-center mb-6 sm:mb-8 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.button
            whileHover={{
              scale: 1.02,
              filter: "brightness(1.05)",
              boxShadow: "0 4px 15px rgba(255, 255, 255, 0.25)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="py-4 px-8 bg-white text-[#1E3A8A] text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            <span className="relative z-10">🚀 Secure Your Spot Now</span>
          </motion.button>
        </motion.div>

        {/* Urgency indicators */}
        <motion.div
          className="max-w-xs mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {/* Live counter */}
          <p className="text-white/80 text-xs sm:text-sm mb-3">
            <span className="font-semibold text-white">142</span> students have
            joined this week
          </p>

          {/* Progress bar */}
          <div className="w-full mx-auto mb-2 bg-[#1E3A8A]/30 rounded-full h-2.5 overflow-hidden">
            <motion.div
              className="bg-white h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "84%" }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
          <p className="text-white/80 text-xs font-medium">
            <motion.span
              className="font-semibold text-white"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              84%
            </motion.span>{" "}
            of early access spots are now filled
          </p>
        </motion.div>
      </div>
    </section>
  );
}
