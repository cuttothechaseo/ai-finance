'use client';

import { motion } from 'framer-motion';

export default function InterviewsSection() {
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
        <h1 className="text-2xl font-bold">Mock Interviews</h1>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </motion.svg>
          <h3 className="mt-2 text-sm font-medium text-white">No mock interviews yet</h3>
          <p className="mt-1 text-sm text-gray-400">Practice your interview skills with our AI interviewer.</p>
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
              Start Mock Interview
            </motion.button>
          </div>
          
          <div className="mt-10 border-t border-gray-700 pt-8">
            <h3 className="text-lg font-medium mb-4">Popular Interview Topics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition-colors"
              >
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-primary/10 rounded-full mr-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">Investment Banking</span>
                </div>
                <p className="text-sm text-gray-400 pl-10">Technical and behavioral questions for IB roles</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition-colors"
              >
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-primary/10 rounded-full mr-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <span className="font-medium">Financial Analysis</span>
                </div>
                <p className="text-sm text-gray-400 pl-10">Valuation, modeling, and forecasting questions</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition-colors"
              >
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-primary/10 rounded-full mr-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="font-medium">Portfolio Management</span>
                </div>
                <p className="text-sm text-gray-400 pl-10">Risk, diversification, and asset allocation</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 