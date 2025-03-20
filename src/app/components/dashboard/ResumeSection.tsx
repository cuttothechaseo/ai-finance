'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface ResumeSectionProps {
  user: any;
}

export default function ResumeSection({ user }: ResumeSectionProps) {
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

  const staggerItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const listItem = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
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
      <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Resumes</h1>
        <Link 
          href="/resume" 
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Upload New Resume
        </Link>
      </div>
      <div className="p-6">
        {user?.resumes && user.resumes.length > 0 ? (
          <motion.div 
            variants={staggerItems}
            className="space-y-4"
          >
            {user.resumes.map((resume: any, index: number) => (
              <motion.div 
                key={index} 
                variants={listItem}
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(75, 85, 99, 0.3)' }}
                className="bg-gray-700 rounded-lg p-4 flex items-start justify-between transition-all duration-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-gray-800 rounded-full p-2">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">{resume.file_name}</h3>
                    <p className="text-sm text-gray-400">
                      {resume.created_at 
                        ? `Uploaded on ${new Date(resume.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}`
                        : 'Recently uploaded'
                      }
                    </p>
                    {resume.file_size && (
                      <p className="text-xs text-gray-500 mt-1">
                        {(resume.file_size / 1024 / 1024).toFixed(2)} MB • {resume.file_type?.toUpperCase() || 'Document'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={resume.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-md hover:bg-gray-600 transition-colors"
                    title="View Resume"
                  >
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </a>
                  <button
                    className="p-2 bg-gray-800 rounded-md hover:bg-gray-600 transition-colors"
                    title="Get AI Feedback"
                  >
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </button>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-white">No resumes yet</h3>
            <p className="mt-1 text-sm text-gray-400">Get started by uploading your first resume.</p>
            <div className="mt-6">
              <Link
                href="/resume"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Upload Resume
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 