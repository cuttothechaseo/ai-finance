'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define message type
type Message = {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  feedback?: string;
};

// ChatDemo component
export default function ChatDemo() {
  // State for messages, input value, and AI typing status
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI finance interview coach. Let's practice a common investment banking interview question.",
      sender: 'ai'
    },
    {
      id: '2',
      text: "Can you walk me through how you would value a company using the Discounted Cash Flow (DCF) method?",
      sender: 'ai'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  // Reference for message container to auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI typing
    setIsAiTyping(true);
    
    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "That's a good start! In your DCF explanation, you correctly mentioned forecasting future cash flows and discounting them back to present value. I'd suggest also mentioning how you determine the discount rate using WACC and how you calculate terminal value. Additionally, consider discussing the sensitivity analysis to show how changes in assumptions affect the valuation.",
        sender: 'ai',
        feedback: "Strong points: Structured approach, technical accuracy\nAreas to improve: More detail on discount rate determination, terminal value calculation"
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsAiTyping(false);
    }, 3000);
  };

  return (
    <div className="bg-secondary-dark/80 border border-gray-800 shadow-2xl rounded-xl overflow-hidden flex flex-col h-[500px] md:h-[600px]">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-secondary-dark">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-sm text-gray-400">AI Finance Interview</div>
        <div className="w-12"></div> {/* Empty div for flex spacing */}
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-primary/30 text-white' 
                    : 'bg-gray-800 text-gray-200'
                }`}
              >
                <p className="text-sm md:text-base">{message.text}</p>
                
                {/* Feedback section for AI messages */}
                {message.feedback && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="mt-2 pt-2 border-t border-gray-700"
                  >
                    <p className="text-xs text-primary-light font-medium mb-1">Feedback:</p>
                    <p className="text-xs text-gray-400 whitespace-pre-line">{message.feedback}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
          
          {/* AI typing indicator */}
          {isAiTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-800 rounded-lg p-3 flex items-center space-x-2">
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              </div>
            </motion.div>
          )}
          
          {/* Invisible element for auto-scrolling */}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-800 bg-secondary-dark">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your answer..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            className="bg-primary hover:bg-primary-light text-white rounded-lg px-4 py-2 transition-colors"
          >
            Send
          </motion.button>
        </div>
      </div>
    </div>
  );
} 