'use client';

import { motion } from 'framer-motion';

// Step type definition
type Step = {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: JSX.Element;
};

export default function HowItWorks() {
  // Steps data
  const steps: Step[] = [
    {
      id: '1',
      number: 1,
      title: "Pick Your Role",
      description: "Choose from IB, PE, or RE interview tracks to match your career goals.",
      icon: (
        <svg className="w-14 h-14 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: '2',
      number: 2,
      title: "Practice with AI-Powered Mock Interviews",
      description: "Receive real finance interview questions and answer in a live AI-powered chat.",
      icon: (
        <svg className="w-14 h-14 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="8" cy="10" r="1" fill="currentColor"/>
          <circle cx="12" cy="10" r="1" fill="currentColor"/>
          <circle cx="16" cy="10" r="1" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: '3',
      number: 3,
      title: "Get Instant AI Feedback & Improve",
      description: "See where you can improve with AI-driven feedback on your answers.",
      icon: (
        <svg className="w-14 h-14 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-section relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">Fastest Path</span> to Landing a Finance Offer
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-300 max-w-3xl mx-auto text-lg"
          >
            In just 3 simple steps, you&apos;ll be interview-ready for top finance firms.
          </motion.p>
        </div>
        
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative rounded-xl p-8 flex flex-col h-full overflow-hidden"
            >
              {/* Gradient background with animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Blurred glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-primary-light/30 rounded-xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
              
              {/* Step number (background) */}
              <div className="absolute -right-4 -top-4 text-gray-800 font-bold text-[150px] opacity-10 select-none">
                {step.number}
              </div>
              
              {/* Content container */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Icon with hover animation */}
                <motion.div 
                  className="mb-6 relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-gray-800/70 w-20 h-20 rounded-lg flex items-center justify-center shadow-lg">
                    <motion.div
                      whileHover={{ 
                        color: "#a855f7",
                        transition: { duration: 0.3 }
                      }}
                    >
                      {step.icon}
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Step title with enhanced number */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <span className="text-2xl mr-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light group-hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.5)] transition-all duration-300">
                      Step {step.number}:
                    </span> 
                    {step.title}
                  </h3>
                </div>
                
                {/* Description */}
                <p className="text-gray-300">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 