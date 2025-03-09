'use client';

import { motion } from 'framer-motion';
import ChatDemo from './ChatDemo';
import AnimatedBackground from './AnimatedBackground';

export default function Hero() {
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
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
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