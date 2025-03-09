'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import ChatDemo from './ChatDemo';
import AnimatedBackground from './AnimatedBackground';

export default function Hero() {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = "Ace your Finance";
  const secondLineText = "Interviews with ";
  const [displaySecondLine, setDisplaySecondLine] = useState('');
  const [secondLineIndex, setSecondLineIndex] = useState(0);
  const [showAI, setShowAI] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  
  // Typewriter effect for the first line
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100); // Speed of typing
      
      return () => clearTimeout(timeout);
    } else if (!typingComplete) {
      // Start typing the second line after a short pause
      setTimeout(() => {
        const secondLineInterval = setInterval(() => {
          if (secondLineIndex < secondLineText.length) {
            setDisplaySecondLine(secondLineText.substring(0, secondLineIndex + 1));
            setSecondLineIndex(secondLineIndex + 1);
          } else {
            clearInterval(secondLineInterval);
            // Show the "AI." part after typing "Interviews with"
            setTimeout(() => {
              setShowAI(true);
              setTypingComplete(true);
            }, 300);
          }
        }, 100);
        
        return () => clearInterval(secondLineInterval);
      }, 500);
    }
  }, [currentIndex, secondLineIndex, typingComplete]);

  const scrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    const demoElement = document.getElementById('demo');
    if (demoElement) {
      demoElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 min-h-[200px]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          {displayText}<span className="inline-block w-0.5 h-[0.7em] bg-white ml-1 animate-blink"></span>
          <br />
          {displaySecondLine}
          {showAI && (
            <motion.span 
              className="text-primary-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              AI.
            </motion.span>
          )}
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: typingComplete ? 1 : 0, y: typingComplete ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Get instant feedback on your answers, improve technical & behavioral skills, and land your dream finance job.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: typingComplete ? 1 : 0, y: typingComplete ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button onClick={scrollToDemo} className="primary-button">
            Try a Demo Interview
          </button>
        </motion.div>
        
        <motion.div 
          className="mt-16 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: typingComplete ? 1 : 0, y: typingComplete ? 0 : 40 }}
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