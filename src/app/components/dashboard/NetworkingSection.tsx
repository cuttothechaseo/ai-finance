'use client';

import { motion } from 'framer-motion';

export default function NetworkingSection() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700"
    >
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Networking Suggestions</h1>
      </div>
      <div className="p-6">
        <div className="text-center py-10">
          <motion.svg 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </motion.svg>
          <h3 className="mt-2 text-sm font-medium text-white">No networking suggestions yet</h3>
          <p className="mt-1 text-sm text-gray-400">Complete your profile to get personalized networking suggestions.</p>
          <div className="mt-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Generate Suggestions
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 