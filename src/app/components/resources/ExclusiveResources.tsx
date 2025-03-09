'use client';

import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaitlistContext } from '@/app/contexts/WaitlistContext';

export default function ExclusiveResources() {
  const { isModalOpen, setIsModalOpen } = useContext(WaitlistContext);

  // Resources list with icons
  const resources = [
    {
      id: 'r1',
      text: 'Firm-Specific IB & PE Interview Questions',
      icon: (
        <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'r2',
      text: 'LBO & DCF Cheat Sheets',
      icon: (
        <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'r3',
      text: 'Superday Prep Guides',
      icon: (
        <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'r4',
      text: 'Early Access to AI Interview Coaching',
      icon: (
        <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  // Document preview components with floating animation
  const DocumentPreview = ({ delay = 0, scale = 1, rotate = 0 }) => {
    return (
      <motion.div
        className="absolute"
        initial={{ y: 0 }}
        animate={{ 
          y: [0, -10, 0],
          transition: {
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay
          }
        }}
        style={{ 
          transform: `scale(${scale}) rotate(${rotate}deg)` 
        }}
      >
        <div className="w-32 h-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden flex flex-col">
          <div className="h-6 bg-primary/20 flex items-center px-2">
            <div className="w-2 h-2 rounded-full bg-gray-400 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          </div>
          <div className="flex-1 p-3">
            <div className="w-full h-3 bg-gray-700 rounded mb-2"></div>
            <div className="w-3/4 h-3 bg-gray-700 rounded mb-2"></div>
            <div className="w-5/6 h-3 bg-gray-700 rounded mb-2"></div>
            <div className="w-2/3 h-3 bg-gray-700 rounded mb-4"></div>
            <div className="w-full h-8 bg-primary/30 rounded"></div>
          </div>
        </div>
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
              className="fixed inset-0 bg-black/70 z-40"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-xl p-6 md:p-8 w-11/12 max-w-md z-50 shadow-2xl border border-gray-800"
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
              
              <h3 className="text-2xl font-bold mb-4 text-white">Get Your Free Resources</h3>
              
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
                    placeholder="you@university.edu"
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
                  Send Me the Resources
                </motion.button>
              </form>
              
              <p className="text-xs text-gray-400 mt-4 text-center">
                By submitting, you agree to receive finance interview resources. We respect your privacy and will never spam you.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  return (
    <section id="exclusive-resources" className="py-20 bg-secondary-dark relative overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-70"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column: Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Get <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light font-extrabold">Exclusive</span> Finance Recruiting Resources
            </h2>
            
            <p className="text-xl text-gray-300 mb-8">
              Join our student community and receive:
            </p>
            
            <ul className="space-y-4 mb-10">
              {resources.map((resource) => (
                <motion.li 
                  key={resource.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    {resource.icon}
                  </div>
                  <span className="text-gray-200 text-lg">{resource.text}</span>
                </motion.li>
              ))}
            </ul>
            
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="py-4 px-8 bg-gradient-to-r from-primary to-primary-light text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              Claim Free Resources
            </motion.button>
          </motion.div>
          
          {/* Right column: Floating document previews */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] hidden md:block"
          >
            <div className="absolute inset-0">
              <div className="relative w-full h-full">
                {/* Document previews positioned around */}
                <div className="absolute top-[10%] left-[20%]">
                  <DocumentPreview delay={0} scale={1.1} rotate={-5} />
                </div>
                <div className="absolute top-[25%] right-[15%]">
                  <DocumentPreview delay={0.5} scale={0.9} rotate={5} />
                </div>
                <div className="absolute bottom-[15%] left-[10%]">
                  <DocumentPreview delay={1} scale={1} rotate={-3} />
                </div>
                <div className="absolute bottom-[30%] right-[25%]">
                  <DocumentPreview delay={1.5} scale={1.2} rotate={8} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Modal */}
      <Modal />
    </section>
  );
} 