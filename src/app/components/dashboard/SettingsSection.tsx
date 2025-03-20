'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface SettingsSectionProps {
  user: any;
}

export default function SettingsSection({ user }: SettingsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('account');
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email_notifications: true,
    browser_notifications: false,
    mobile_notifications: true,
    weekly_summary: true,
    job_matches: true,
    interview_reminders: true,
    marketing_emails: false,
    dark_mode: true,
    language: 'english',
    timezone: 'America/New_York'
  });
  
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
  
  const tabVariants = {
    inactive: { opacity: 0.7 },
    active: { 
      opacity: 1, 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleToggleChange = (setting: string) => {
    setFormData({ ...formData, [setting]: !formData[setting as keyof typeof formData] });
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSaveSettings = () => {
    // Here would be the API call to save settings
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
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
      
      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Settings Tabs */}
        <div className="p-6 border-r border-gray-700 space-y-2">
          <motion.button
            variants={tabVariants}
            animate={activeTab === 'account' ? 'active' : 'inactive'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTabChange('account')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'account' 
                ? 'bg-primary text-white' 
                : 'hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account
            </div>
          </motion.button>
          
          <motion.button
            variants={tabVariants}
            animate={activeTab === 'notifications' ? 'active' : 'inactive'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTabChange('notifications')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'notifications' 
                ? 'bg-primary text-white' 
                : 'hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notifications
            </div>
          </motion.button>
          
          <motion.button
            variants={tabVariants}
            animate={activeTab === 'appearance' ? 'active' : 'inactive'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTabChange('appearance')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'appearance' 
                ? 'bg-primary text-white' 
                : 'hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Appearance
            </div>
          </motion.button>
          
          <motion.button
            variants={tabVariants}
            animate={activeTab === 'privacy' ? 'active' : 'inactive'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTabChange('privacy')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'privacy' 
                ? 'bg-primary text-white' 
                : 'hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Privacy
            </div>
          </motion.button>
        </div>
        
        {/* Settings Content */}
        <div className="p-6 col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'account' && (
              <motion.div
                key="account"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-400 mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleSelectChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-400 mb-1">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleSelectChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <h3 className="text-lg font-medium mb-3">Danger Zone</h3>
                  <div className="flex flex-col space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 transition-colors"
                    >
                      Download Your Data
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 transition-colors"
                    >
                      Delete Account
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="email_notifications" className="text-sm font-medium text-gray-300">
                      Email Notifications
                    </label>
                    <button
                      type="button"
                      onClick={() => handleToggleChange('email_notifications')}
                      className={`${
                        formData.email_notifications ? 'bg-primary' : 'bg-gray-600'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                    >
                      <span
                        className={`${
                          formData.email_notifications ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label htmlFor="browser_notifications" className="text-sm font-medium text-gray-300">
                      Browser Notifications
                    </label>
                    <button
                      type="button"
                      onClick={() => handleToggleChange('browser_notifications')}
                      className={`${
                        formData.browser_notifications ? 'bg-primary' : 'bg-gray-600'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                    >
                      <span
                        className={`${
                          formData.browser_notifications ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label htmlFor="mobile_notifications" className="text-sm font-medium text-gray-300">
                      Mobile Notifications
                    </label>
                    <button
                      type="button"
                      onClick={() => handleToggleChange('mobile_notifications')}
                      className={`${
                        formData.mobile_notifications ? 'bg-primary' : 'bg-gray-600'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                    >
                      <span
                        className={`${
                          formData.mobile_notifications ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <h3 className="text-lg font-medium mb-3">Email Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="weekly_summary" className="text-sm font-medium text-gray-300">
                        Weekly Summary
                      </label>
                      <button
                        type="button"
                        onClick={() => handleToggleChange('weekly_summary')}
                        className={`${
                          formData.weekly_summary ? 'bg-primary' : 'bg-gray-600'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                      >
                        <span
                          className={`${
                            formData.weekly_summary ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="job_matches" className="text-sm font-medium text-gray-300">
                        Job Matches
                      </label>
                      <button
                        type="button"
                        onClick={() => handleToggleChange('job_matches')}
                        className={`${
                          formData.job_matches ? 'bg-primary' : 'bg-gray-600'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                      >
                        <span
                          className={`${
                            formData.job_matches ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="interview_reminders" className="text-sm font-medium text-gray-300">
                        Interview Reminders
                      </label>
                      <button
                        type="button"
                        onClick={() => handleToggleChange('interview_reminders')}
                        className={`${
                          formData.interview_reminders ? 'bg-primary' : 'bg-gray-600'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                      >
                        <span
                          className={`${
                            formData.interview_reminders ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="marketing_emails" className="text-sm font-medium text-gray-300">
                        Marketing Emails
                      </label>
                      <button
                        type="button"
                        onClick={() => handleToggleChange('marketing_emails')}
                        className={`${
                          formData.marketing_emails ? 'bg-primary' : 'bg-gray-600'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                      >
                        <span
                          className={`${
                            formData.marketing_emails ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'appearance' && (
              <motion.div
                key="appearance"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="dark_mode" className="text-sm font-medium text-gray-300">
                      Dark Mode
                    </label>
                    <button
                      type="button"
                      onClick={() => handleToggleChange('dark_mode')}
                      className={`${
                        formData.dark_mode ? 'bg-primary' : 'bg-gray-600'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                    >
                      <span
                        className={`${
                          formData.dark_mode ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <h3 className="text-lg font-medium mb-3">Theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 bg-primary/10 rounded-lg border-2 border-primary flex flex-col items-center"
                    >
                      <div className="w-full h-10 bg-primary rounded"></div>
                      <span className="mt-2 text-sm">Purple</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 bg-gray-700 rounded-lg border border-gray-600 flex flex-col items-center"
                    >
                      <div className="w-full h-10 bg-blue-500 rounded"></div>
                      <span className="mt-2 text-sm">Blue</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 bg-gray-700 rounded-lg border border-gray-600 flex flex-col items-center"
                    >
                      <div className="w-full h-10 bg-green-500 rounded"></div>
                      <span className="mt-2 text-sm">Green</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
                
                <div className="space-y-4">
                  <p className="text-gray-400">
                    Control your privacy settings and what data is shared with our service.
                  </p>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <h3 className="text-lg font-medium mb-3">Privacy Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">Make Profile Public</p>
                          <p className="text-xs text-gray-500">Allow employers to find your profile</p>
                        </div>
                        <button
                          type="button"
                          className="bg-primary relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                        >
                          <span
                            className="translate-x-5 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">Share Usage Data</p>
                          <p className="text-xs text-gray-500">Help us improve by sharing anonymous usage data</p>
                        </div>
                        <button
                          type="button"
                          className="bg-primary relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                        >
                          <span
                            className="translate-x-5 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <h3 className="text-lg font-medium mb-3">Data Management</h3>
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        View Your Data
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Download Your Data
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-8 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveSettings}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Save Changes
            </motion.button>
          </div>
          
          {/* Success Message */}
          <AnimatePresence>
            {showSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-3 bg-green-500/20 border border-green-500 text-green-400 rounded-md flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Settings saved successfully
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
} 