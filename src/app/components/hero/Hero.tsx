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
    const firstLine = "Make Finance";
    const secondLine = "Recruiting a Breeze";
    const fullText = firstLine + " " + secondLine; // Combine for smoother flow
    const breezeWord = "Breeze";
    const breezeStartIndex = fullText.length - breezeWord.length;
    let index = 0;
    let lastTimestamp = 0;
    const charDelay = 60; // Adjusted to 60ms for a slightly faster typing speed

    // Typewriter animation using requestAnimationFrame
    const typeWriter = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;

      // Only update if enough time has passed (charDelay)
      if (timestamp - lastTimestamp >= charDelay) {
        if (index < fullText.length) {
          // Handle line break between first and second line
          if (index < firstLine.length) {
            heading.textContent = fullText.slice(0, index + 1); // First line
          } else if (index === firstLine.length) {
            heading.innerHTML = firstLine + "<br>"; // Add line break
          } else {
            const secondLineText = fullText.slice(
              firstLine.length + 1,
              index + 1
            );

            // Check if we've reached the "Breeze" part
            if (index >= breezeStartIndex) {
              // We're typing "Breeze", so style it the same as the rest
              const beforeBreeze = secondLine.slice(
                0,
                secondLine.length - breezeWord.length
              );
              const breezeTyped = breezeWord.slice(
                0,
                index - breezeStartIndex + 1
              );

              heading.innerHTML = `${firstLine}<br>${beforeBreeze}${breezeTyped}`;
            } else {
              heading.innerHTML = `${firstLine}<br>${secondLineText}`;
            }
          }

          index++;
          lastTimestamp = timestamp;
        } else {
          // Animation complete - final state
          const beforeBreeze = secondLine.slice(
            0,
            secondLine.length - breezeWord.length
          );
          heading.innerHTML = `${firstLine}<br>${beforeBreeze}${breezeWord}`;
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
      {/* Cloud elements using CSS */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Top Right Cloud - right to left */}
        <motion.div
          className="absolute top-0 right-0 w-64 h-64"
          initial={{ x: 0 }}
          animate={{ x: "-30vw" }}
          transition={{
            duration: 40,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        >
          <div className="cloud-shape opacity-20">
            <div className="cloud-circle cloud-circle-1"></div>
            <div className="cloud-circle cloud-circle-2"></div>
            <div className="cloud-circle cloud-circle-3"></div>
          </div>
        </motion.div>

        {/* Middle Left Cloud - left to right */}
        <motion.div
          className="absolute top-[30%] left-0 w-56 h-56"
          initial={{ x: 0 }}
          animate={{ x: "110vw" }}
          transition={{
            duration: 55,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: 10,
          }}
        >
          <div className="cloud-shape opacity-20">
            <div className="cloud-circle cloud-circle-1"></div>
            <div className="cloud-circle cloud-circle-2"></div>
            <div className="cloud-circle cloud-circle-3"></div>
          </div>
        </motion.div>

        {/* Bottom Left Cloud - left to right */}
        <motion.div
          className="absolute bottom-0 left-0 w-72 h-72"
          initial={{ x: 0 }}
          animate={{ x: "110vw" }}
          transition={{
            duration: 60,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: 20,
          }}
        >
          <div className="cloud-shape opacity-20">
            <div className="cloud-circle cloud-circle-1"></div>
            <div className="cloud-circle cloud-circle-2"></div>
            <div className="cloud-circle cloud-circle-3"></div>
          </div>
        </motion.div>

        {/* Small Bottom Right Cloud - right to left */}
        <motion.div
          className="absolute bottom-[20%] right-[10%] w-40 h-40"
          initial={{ x: 0 }}
          animate={{ x: "-30vw" }}
          transition={{
            duration: 35,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: 15,
          }}
        >
          <div className="cloud-shape opacity-20">
            <div className="cloud-circle cloud-circle-1"></div>
            <div className="cloud-circle cloud-circle-2"></div>
            <div className="cloud-circle cloud-circle-3"></div>
          </div>
        </motion.div>

        {/* Small Top Left Cloud - left to right */}
        <motion.div
          className="absolute top-[15%] left-[20%] w-32 h-32"
          initial={{ x: 0 }}
          animate={{ x: "110vw" }}
          transition={{
            duration: 45,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: 5,
          }}
        >
          <div className="cloud-shape opacity-20">
            <div className="cloud-circle cloud-circle-1"></div>
            <div className="cloud-circle cloud-circle-2"></div>
            <div className="cloud-circle cloud-circle-3"></div>
          </div>
        </motion.div>

        {/* Cloud Styling */}
        <style jsx>{`
          .cloud-shape {
            position: relative;
            width: 100%;
            height: 100%;
          }
          .cloud-circle {
            position: absolute;
            background-color: white;
            border-radius: 50%;
          }
          .cloud-circle-1 {
            width: 50%;
            height: 50%;
            top: 25%;
            left: 10%;
          }
          .cloud-circle-2 {
            width: 60%;
            height: 60%;
            top: 30%;
            left: 30%;
          }
          .cloud-circle-3 {
            width: 50%;
            height: 50%;
            top: 25%;
            left: 50%;
          }
        `}</style>
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
          Make Finance
          <br />
          Recruiting a Breeze.
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Your AI assistant for breaking into finance — polish your resume,
          master mock interviews, and send outreach that gets noticed.
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
            onClick={() => (window.location.href = "/login")}
            className="py-4 px-8 bg-white text-[#1E3A8A] text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            <span className="relative z-10">🚀 Get Started</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
