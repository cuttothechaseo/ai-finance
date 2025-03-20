'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

interface InterviewsSectionProps {
  user: any;
}

export default function InterviewsSection({ user }: InterviewsSectionProps) {
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };
  
  const mockInterviews = user?.interviews || [
    {
      id: 1,
      company: 'TechCorp Inc.',
      position: 'Senior Frontend Developer',
      date: '2023-08-15T14:00:00',
      status: 'completed',
      feedback: 'Strong technical skills. Work on system design explanations.',
      score: 8.5,
      interviewer: 'AI Assistant',
      duration: 45,
      questions: [
        'Explain your experience with React hooks',
        'How would you optimize a slow-loading web application?',
        'Describe your approach to responsive design'
      ]
    },
    {
      id: 2,
      company: 'DataViz Solutions',
      position: 'Full Stack Engineer',
      date: '2023-08-22T15:30:00',
      status: 'scheduled',
      interviewer: 'AI Assistant',
      duration: 60,
      questions: []
    },
    {
      id: 3,
      company: 'Cloud Systems',
      position: 'DevOps Engineer',
      date: '2023-07-28T11:00:00',
      status: 'completed',
      feedback: 'Good knowledge of CI/CD pipelines. Could improve on Kubernetes concepts.',
      score: 7.2,
      interviewer: 'AI Assistant',
      duration: 50,
      questions: [
        'Explain the difference between Docker and Kubernetes',
        'How would you set up a CI/CD pipeline for a microservice architecture?',
        'Describe your experience with cloud providers'
      ]
    }
  ];
  
  const viewInterviewDetails = (interview: any) => {
    setSelectedInterview(interview);
    setShowDetailsModal(true);
  };
  
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed':
        return 'bg-green-500';
      case 'scheduled':
        return 'bg-blue-500';
      case 'canceled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed':
        return 'Completed';
      case 'scheduled':
        return 'Scheduled';
      case 'canceled':
        return 'Canceled';
      default:
        return 'Unknown';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getScoreClass = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700"
      >
        <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mock Interviews</h1>
          <Link href="/interviews">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Schedule Interview
            </motion.div>
          </Link>
        </div>
        
        <div className="p-6">
          {mockInterviews.length > 0 ? (
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {mockInterviews.map((interview: any) => (
                <motion.div
                  key={interview.id}
                  variants={cardVariant}
                  className="bg-gray-700 rounded-lg overflow-hidden shadow-md border border-gray-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className="px-6 py-4 border-b border-gray-600">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{interview.position}</h3>
                        <p className="text-sm text-gray-400">{interview.company}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interview.status)} text-white`}>
                        {getStatusText(interview.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">{formatDate(interview.date)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{interview.duration} minutes</span>
                    </div>
                    
                    {interview.status === 'completed' && (
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">
                          Score: <span className={getScoreClass(interview.score)}>{interview.score}</span>/10
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-750 px-4 py-3 flex justify-end space-x-2 border-t border-gray-600">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => viewInterviewDetails(interview)}
                      className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                      title="View Details"
                    >
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </motion.button>
                    
                    {interview.status === 'completed' ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
                        title="Download Transcript"
                      >
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-red-500/10 rounded-md hover:bg-red-500/20 transition-colors"
                        title="Cancel Interview"
                      >
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    )}
                    
                    {interview.status === 'scheduled' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-primary rounded-md hover:bg-primary-dark transition-colors"
                        title="Start Interview"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              variants={fadeIn}
              className="text-center py-10"
            >
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-white">No mock interviews</h3>
              <p className="mt-1 text-sm text-gray-400">Schedule your first mock interview to practice for your next job.</p>
              <div className="mt-6">
                <Link href="/interviews">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Schedule Interview
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Interview Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedInterview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeDetailsModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-medium">{selectedInterview.position}</h3>
                  <p className="text-sm text-gray-400">{selectedInterview.company}</p>
                </div>
                <button 
                  onClick={closeDetailsModal}
                  className="p-1 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-10rem)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(selectedInterview.date)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{selectedInterview.duration} minutes</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{selectedInterview.interviewer || 'AI Assistant'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedInterview.status)} text-white`}>
                        {getStatusText(selectedInterview.status)}
                      </span>
                    </div>
                    
                    {selectedInterview.status === 'completed' && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            Score: <span className={getScoreClass(selectedInterview.score)}>{selectedInterview.score}</span>/10
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedInterview.feedback && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Feedback</h4>
                    <p className="text-sm text-gray-400 bg-gray-750 p-3 rounded-md border border-gray-600">
                      {selectedInterview.feedback}
                    </p>
                  </div>
                )}
                
                {selectedInterview.questions && selectedInterview.questions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Questions Asked</h4>
                    <ul className="space-y-2">
                      {selectedInterview.questions.map((question: string, index: number) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-sm text-gray-400 bg-gray-750 p-3 rounded-md border border-gray-600"
                        >
                          {question}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeDetailsModal}
                  className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Close
                </motion.button>
                
                {selectedInterview.status === 'completed' ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    Download Transcript
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    {selectedInterview.status === 'scheduled' ? 'Start Now' : 'Reschedule'}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 