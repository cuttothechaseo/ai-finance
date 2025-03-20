'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SettingsSection() {
  const [activeTab, setActiveTab] = useState('account');
  
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
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="border-b border-gray-700">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('account')}
            className={`ml-6 py-4 px-3 border-b-2 font-medium text-sm ${
              activeTab === 'account'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`ml-8 py-4 px-3 border-b-2 font-medium text-sm ${
              activeTab === 'preferences'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`ml-8 py-4 px-3 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`ml-8 py-4 px-3 border-b-2 font-medium text-sm ${
              activeTab === 'privacy'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Privacy
          </button>
        </nav>
      </div>
      
      <div className="p-6">
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-5 border-t border-gray-700">
              <h3 className="text-lg font-medium mb-4">Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Save Changes
              </motion.button>
            </div>
          </div>
        )}
        
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Career Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Industry Focus
                </label>
                <select
                  className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option>Investment Banking</option>
                  <option>Private Equity</option>
                  <option>Venture Capital</option>
                  <option>Asset Management</option>
                  <option>Corporate Finance</option>
                  <option>Hedge Fund</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Experience Level
                </label>
                <select
                  className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option>Entry Level</option>
                  <option>Associate</option>
                  <option>Mid-Level</option>
                  <option>Senior</option>
                  <option>Executive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Job Location Preference
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. New York, Remote, London"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Save Preferences
              </motion.button>
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div>
                  <h4 className="font-medium">Resume Feedback</h4>
                  <p className="text-sm text-gray-400">Get notified when AI generates feedback on your resume</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="relative w-10 h-5 bg-gray-600 rounded-full peer peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary">
                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:left-5"></div>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div>
                  <h4 className="font-medium">Network Opportunities</h4>
                  <p className="text-sm text-gray-400">Get notified about new networking opportunities</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="relative w-10 h-5 bg-gray-600 rounded-full peer peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary">
                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:left-5"></div>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div>
                  <h4 className="font-medium">Account Updates</h4>
                  <p className="text-sm text-gray-400">Receive important account notifications</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="relative w-10 h-5 bg-gray-600 rounded-full peer peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary">
                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:left-5"></div>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div>
                  <h4 className="font-medium">Marketing Emails</h4>
                  <p className="text-sm text-gray-400">Receive promotional content and updates</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="relative w-10 h-5 bg-gray-600 rounded-full peer peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary">
                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:left-5"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div>
                  <h4 className="font-medium">Data Analytics</h4>
                  <p className="text-sm text-gray-400">Allow us to use your data to improve our services</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="relative w-10 h-5 bg-gray-600 rounded-full peer peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary">
                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:left-5"></div>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div>
                  <h4 className="font-medium">Profile Visibility</h4>
                  <p className="text-sm text-gray-400">Make your profile visible to recruiters and employers</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="relative w-10 h-5 bg-gray-600 rounded-full peer peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary">
                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:left-5"></div>
                  </div>
                </label>
              </div>
              
              <div className="mt-6">
                <button className="text-red-400 hover:text-red-300 transition-colors">
                  Delete Account
                </button>
                <p className="mt-1 text-xs text-gray-400">
                  This will permanently delete your account and all associated data.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 