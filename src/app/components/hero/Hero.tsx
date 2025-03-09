'use client';

import { motion } from 'framer-motion';
import ChatDemo from './ChatDemo';
import AnimatedBackground from './AnimatedBackground';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const scrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    const demoElement = document.getElementById('demo');
    if (demoElement) {
      demoElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const headingRef = useRef<HTMLHeadingElement>(null);

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
    const charDelay = 70; // Adjusted to 70ms for a balanced typing speed

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
          className="mt-16 relative"
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