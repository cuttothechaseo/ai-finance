'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useContext } from 'react';
import dynamic from 'next/dynamic';
import { WaitlistContext } from '@/app/contexts/WaitlistContext';

// Dynamically import components to avoid hydration issues
const AnimatedBackground = dynamic(() => import('./AnimatedBackground'), { ssr: false });
const ChatDemo = dynamic(() => import('./ChatDemo'), { ssr: false });

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
            heading.innerHTML = firstLine + '<br>'; // Add line break
          } else {
            const secondLineText = fullText.slice(firstLine.length + 1, index + 1);
            if (index >= fullText.length - 2) {
              // Reached "AI", apply styling
              heading.innerHTML = `${firstLine}<br>${secondLine.slice(0, -2)}<span class="text-primary-light">AI</span>`;
            } else {
              heading.innerHTML = `${firstLine}<br>${secondLineText}`;
            }
          }
          index++;
          lastTimestamp = timestamp;
        } else {
          // Finish with the period
          heading.innerHTML = `${firstLine}<br>${secondLine.slice(0, -2)}<span class="text-primary-light">AI.</span>`;
          return; // Stop animation
        }
      }

      requestAnimationFrame(typeWriter); // Continue animation
    };

    // Start after fade-in delay
    setTimeout(() => requestAnimationFrame(typeWriter), 200); // Matches 0.2s delay of motion.h1
  }, []); // Runs only once on mount

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden pt-20">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center bg-primary/20 rounded-full px-3 py-1 mb-6 border border-primary/30"
        >
          <span className="text-xs font-medium text-primary-light mr-2">NEW</span>
          <span className="text-xs text-gray-300">Latest integration just arrived</span>
        </motion.div>
        
        <motion.h1 
          ref={headingRef} // Attach ref to manipulate content
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Initial content will be cleared and animated */}
          Ace your Finance<br />
          Interviews with <span className="text-primary-light">AI.</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Get instant feedback on your answers, improve technical & behavioral skills, and land your dream finance job.
        </motion.p>
        
        <motion.div
          className="flex justify-center mb-6 sm:mb-8 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="py-5 px-10 bg-gradient-to-r from-primary to-primary-light text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center group relative overflow-hidden pulse-animation"
          >
            <span className="relative z-10">🚀 Secure Your Spot Now ➡</span>
            
            {/* Subtle pulsing glow effect */}
            <motion.div 
              className="absolute inset-0 bg-primary-light/20"
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        </motion.div>
        
        {/* Urgency indicators */}
        <motion.div
          className="max-w-xs mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {/* Live counter */}
          <p className="text-gray-300 text-xs sm:text-sm mb-3">
            <span className="font-semibold text-white">142</span> students have joined this week
          </p>
          
          {/* Progress bar */}
          <div className="w-full mx-auto mb-2 bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-primary-light h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '84%' }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
          <p className="text-gray-400 text-xs font-medium">
            <motion.span 
              className="font-bold text-primary-light"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              84%
            </motion.span> of early access spots are now filled
          </p>
        </motion.div>
        
        <motion.div 
          className="mt-8 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          id="demo"
        >
          <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden">
            <ChatDemo />
          </div>
        </motion.div>
      </div>
    </section>
  );
} 