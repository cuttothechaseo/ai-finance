'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JoinWaitlist() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Glowing lock icon component
  const GlowingLockIcon = () => {
    return (
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-primary/30 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        {/* Lock icon */}
        <motion.div
          className="relative z-10 w-20 h-20 md:w-24 md:h-24 bg-gray-800/80 rounded-full flex items-center justify-center shadow-lg border border-gray-700"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <svg className="w-10 h-10 md:w-12 md:h-12 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
          </svg>
        </motion.div>
      </motion.div>
    );
  };

  // Modal component
  const Modal = () => {
    return (
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 overflow-y-auto"
              onClick={() => setIsModalOpen(false)}
            >
              <div className="min-h-screen px-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative bg-gray-900 rounded-xl p-6 md:p-8 w-full max-w-md z-50 shadow-2xl border border-gray-800 my-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 text-white text-center">Join the Waitlist</h3>
                  <p className="text-gray-300 mb-6 text-center">Be the first to access our premium AI interview coaching features.</p>
                  
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white"
                        placeholder="you@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="university" className="block text-sm font-medium text-gray-300 mb-1">University</label>
                      <input 
                        type="text" 
                        id="university" 
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white"
                        placeholder="Your university"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="interest" className="block text-sm font-medium text-gray-300 mb-1">I&apos;m interested in</label>
                      <select 
                        id="interest" 
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white"
                      >
                        <option value="">Select your interest</option>
                        <option value="ib">Investment Banking</option>
                        <option value="pe">Private Equity</option>
                        <option value="re">Real Estate</option>
                        <option value="other">Other Finance Role</option>
                      </select>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3 px-6 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-lg shadow-lg hover:shadow-primary/30 transition-all duration-300"
                      onClick={(e) => {
                        e.preventDefault();
                        // This would be where you'd handle form submission
                        // For now, just close the modal
                        setIsModalOpen(false);
                      }}
                    >
                      Join Waitlist
                    </motion.button>
                  </form>
                  
                  <p className="text-xs text-gray-400 mt-4 text-center">
                    We&apos;ll notify you when premium features become available. No spam, ever.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  return (
    <section id="join-waitlist" className="py-section relative overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-80"></div>
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-gray-800"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Lock Icon */}
            <div className="flex-shrink-0">
              <GlowingLockIcon />
            </div>
            
            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Unlock <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">Premium AI Coaching</span> (Coming Soon)
              </h2>
              
              <p className="text-gray-300 text-lg mb-8">
                Early members get exclusive access to premium features, including voice-based AI interviews & personalized feedback.
              </p>
              
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="py-4 px-8 bg-gradient-to-r from-primary to-primary-light text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                Join the Waitlist
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Modal */}
      <Modal />
    </section>
  );
} 