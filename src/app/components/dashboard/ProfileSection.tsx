'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileSectionProps {
  user: any;
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    background: user?.background?.replace('_', ' ') || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save changes to the backend
    console.log('Saving user data:', formData);
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div 
        custom={0} 
        variants={fadeIn} 
        className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700"
      >
        <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
              ${isEditing ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-primary text-white hover:bg-primary-dark'}`}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </motion.button>
        </div>
        
        <div className="p-6">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.form 
                key="edit-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="background" className="block text-sm font-medium text-gray-300 mb-1">
                        Professional Background
                      </label>
                      <select
                        id="background"
                        name="background"
                        value={formData.background}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select your background</option>
                        <option value="finance">Finance</option>
                        <option value="banking">Banking</option>
                        <option value="investment">Investment</option>
                        <option value="accounting">Accounting</option>
                        <option value="economics">Economics</option>
                        <option value="business">Business</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="City, Country"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                        Short Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Tell us a bit about yourself..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="profile-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    custom={1} 
                    variants={fadeIn}
                    className="bg-gray-700 rounded-lg p-5"
                  >
                    <h2 className="text-lg font-medium mb-4">Personal Information</h2>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-400">Full Name</label>
                        <p className="text-white font-medium">{user?.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400">Email Address</label>
                        <p className="text-white">{user?.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400">Background</label>
                        <p className="text-white capitalize">{user?.background?.replace('_', ' ') || 'Not provided'}</p>
                      </div>
                      {formData.location && (
                        <div>
                          <label className="block text-xs text-gray-400">Location</label>
                          <p className="text-white">{formData.location}</p>
                        </div>
                      )}
                      {formData.bio && (
                        <div>
                          <label className="block text-xs text-gray-400">Bio</label>
                          <p className="text-white text-sm">{formData.bio}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    custom={2} 
                    variants={fadeIn}
                    className="bg-gray-700 rounded-lg p-5"
                  >
                    <h2 className="text-lg font-medium mb-4">Account Statistics</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        className="bg-gray-800 p-4 rounded-lg transition-colors"
                      >
                        <p className="text-gray-400 text-sm">Resumes</p>
                        <p className="text-2xl font-bold text-primary">{user?.resumeCount || 0}</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        className="bg-gray-800 p-4 rounded-lg transition-colors"
                      >
                        <p className="text-gray-400 text-sm">Network Connections</p>
                        <p className="text-2xl font-bold text-primary">0</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        className="bg-gray-800 p-4 rounded-lg transition-colors"
                      >
                        <p className="text-gray-400 text-sm">Mock Interviews</p>
                        <p className="text-2xl font-bold text-primary">0</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        className="bg-gray-800 p-4 rounded-lg transition-colors"
                      >
                        <p className="text-gray-400 text-sm">AI Feedback</p>
                        <p className="text-2xl font-bold text-primary">0</p>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  custom={3} 
                  variants={fadeIn}
                  className="mt-6 bg-gray-700 rounded-lg p-5"
                >
                  <h2 className="text-lg font-medium mb-4">Getting Started</h2>
                  <div className="space-y-4">
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-start"
                    >
                      <div className="bg-gray-800 rounded-full p-2 mr-3">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Complete your profile</h3>
                        <p className="text-sm text-gray-400">Add more details about your career goals and preferences.</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-start"
                    >
                      <div className="bg-gray-800 rounded-full p-2 mr-3">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Upload your resume</h3>
                        <p className="text-sm text-gray-400">Get AI-powered feedback and improvement suggestions.</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-start"
                    >
                      <div className="bg-gray-800 rounded-full p-2 mr-3">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Grow your network</h3>
                        <p className="text-sm text-gray-400">Get AI suggestions for networking opportunities.</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-start"
                    >
                      <div className="bg-gray-800 rounded-full p-2 mr-3">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Practice interview skills</h3>
                        <p className="text-sm text-gray-400">Schedule AI-powered mock interviews for finance roles.</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
} 