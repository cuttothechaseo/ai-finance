'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Predefined static messages
const staticMessages = [
  {
    id: '1',
    text: "Hi! I'm your finance coach - your second-round interview for the Goldman Sachs Investment Banking Role is on Wednesday. Do you want me to help you prepare?",
    sender: 'ai',
    label: 'AI Finance Coach'
  },
  {
    id: '2',
    text: "Yes, please! Let's practice a mock interview.",
    sender: 'user',
    label: 'You'
  },
  {
    id: '3',
    text: "Sure thing! Let's start off with a technical question. Can you walk me through how you would value a company using the Discounted Cash Flow (DCF) method?",
    sender: 'ai',
    label: 'AI Finance Coach'
  },
  {
    id: '4',
    text: "DCF values a company by forecasting future cash flows and discounting them back to present value using an appropriate discount rate. You start with projecting financial statements, calculate free cash flows, determine WACC, and estimate terminal value.",
    sender: 'user',
    label: 'You'
  },
  {
    id: '5',
    text: "That's a good start! In your DCF explanation, you correctly mentioned forecasting future cash flows and discounting them back to present value. I'd suggest also mentioning how you determine the discount rate using WACC and how you calculate terminal value. Additionally, consider discussing the sensitivity analysis to show how changes in assumptions affect the valuation.",
    sender: 'ai',
    label: 'AI Finance Coach',
    feedback: "Strong points: Structured approach, technical accuracy\nAreas to improve: More detail on discount rate determination, terminal value calculation"
  }
];

// ChatDemo component
export default function ChatDemo() {
  // State for current visible messages
  const [visibleMessages, setVisibleMessages] = useState<typeof staticMessages>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAITyping, setIsAITyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  
  // Reference for the chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Effect to handle the message animation loop
  useEffect(() => {
    // Function to add the next message
    const addNextMessage = () => {
      if (currentIndex < staticMessages.length) {
        const nextMessage = staticMessages[currentIndex];
        
        // Show typing indicator based on sender
        if (nextMessage.sender === 'ai') {
          setIsAITyping(true);
          setIsUserTyping(false);
        } else {
          setIsUserTyping(true);
          setIsAITyping(false);
        }
        
        // Add message after typing delay
        setTimeout(() => {
          setVisibleMessages(prev => [...prev, nextMessage]);
          setCurrentIndex(prev => prev + 1);
          setIsAITyping(false);
          setIsUserTyping(false);
        }, 1500); // 1.5 second typing delay
      } else {
        // Reset after a delay when all messages have been shown
        setTimeout(() => {
          setVisibleMessages([]);
          setCurrentIndex(0);
          setIsAITyping(false);
          setIsUserTyping(false);
        }, 4000);
      }
    };

    // Set interval to add messages with delay
    const messageTimer = setTimeout(() => {
      addNextMessage();
    }, currentIndex === 0 ? 500 : 3000); // Start quickly, then slow down

    // Clean up timeout on component unmount
    return () => clearTimeout(messageTimer);
  }, [currentIndex]);

  // Effect to handle auto-scrolling when messages update or typing indicators appear
  useEffect(() => {
    // Small delay to ensure smooth scrolling after content renders
    const scrollTimeout = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
    
    return () => clearTimeout(scrollTimeout);
  }, [visibleMessages, isAITyping, isUserTyping]);

  return (
    <div className="bg-secondary-dark/80 border border-gray-800 shadow-2xl rounded-xl overflow-hidden flex flex-col h-[500px] md:h-[600px]">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-secondary-dark">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-sm text-gray-400">Goldman Sachs Interview Prep</div>
        <div className="w-12"></div> {/* Empty div for flex spacing */}
      </div>
      
      {/* Messages container with ref for auto-scrolling */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6"
      >
        <AnimatePresence>
          {/* Render all visible messages */}
          {visibleMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* AI Chat Bubble Icon - Only show for AI messages */}
              {message.sender === 'ai' && (
                <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              <div className="flex flex-col max-w-[75%]">
                {/* Role label */}
                <div className={`text-xs font-medium mb-1 ${
                  message.sender === 'user' ? 'text-blue-300 text-right' : 'text-primary-light'
                }`}>
                  {message.label}
                </div>
                
                {/* Chat bubble */}
                <div 
                  className={`rounded-2xl p-4 ${
                    message.sender === 'user' 
                      ? 'bg-purple-600/80 text-white rounded-tr-none' 
                      : 'bg-blue-900/80 text-gray-200 rounded-tl-none'
                  } shadow-md`}
                >
                  <p className="text-sm md:text-base">{message.text}</p>
                  
                  {/* Feedback section for AI messages */}
                  {message.feedback && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      className="mt-3 pt-3 border-t border-gray-700"
                    >
                      <p className="text-xs text-primary-light font-medium mb-1">Feedback:</p>
                      <p className="text-xs text-gray-400 whitespace-pre-line">{message.feedback}</p>
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* User Chat Bubble Icon - Only show for User messages */}
              {message.sender === 'user' && (
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center ml-3 flex-shrink-0 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
          
          {/* AI Typing Indicator */}
          {isAITyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start justify-start"
            >
              <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div className="flex flex-col max-w-[75%]">
                <div className="text-xs font-medium mb-1 text-primary-light">
                  AI Finance Coach
                </div>
                <div className="bg-blue-900/80 text-gray-200 rounded-2xl rounded-tl-none p-3 shadow-md">
                  <div className="flex space-x-1">
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      className="w-2 h-2 bg-gray-300 rounded-full"
                    />
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-2 h-2 bg-gray-300 rounded-full"
                    />
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-2 h-2 bg-gray-300 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* User Typing Indicator */}
          {isUserTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start justify-end"
            >
              <div className="flex flex-col max-w-[75%]">
                <div className="text-xs font-medium mb-1 text-blue-300 text-right">
                  You
                </div>
                <div className="bg-purple-600/80 text-white rounded-2xl rounded-tr-none p-3 shadow-md">
                  <div className="flex space-x-1">
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      className="w-2 h-2 bg-gray-200 rounded-full"
                    />
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-2 h-2 bg-gray-200 rounded-full"
                    />
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-2 h-2 bg-gray-200 rounded-full"
                    />
                  </div>
                </div>
              </div>
              
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center ml-3 flex-shrink-0 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Static input area (non-functional) */}
      <div className="p-4 border-t border-gray-800 bg-secondary-dark">
        <div className="flex items-center space-x-2">
          {/* Microphone icon */}
          <button className="p-2 text-gray-400 hover:text-gray-300 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          
          <input
            type="text"
            placeholder="Type your answer..."
            disabled
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            className="bg-primary text-white rounded-lg px-4 py-2 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 