"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileSectionProps {
  user: any;
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    background: user?.background?.replace("_", " ") || "",
    bio: user?.bio || "",
    location: user?.location || "",
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save changes to the backend
    console.log("Saving user data:", formData);
    setIsEditing(false);
  };

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-6">
      <motion.div
        custom={0}
        variants={fadeIn}
        className="bg-[#59B7F2]/90 backdrop-blur-md shadow-md rounded-lg overflow-hidden border border-white/20"
      >
        <div className="px-6 py-5 border-b border-white/20 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Your Profile</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 
              ${
                isEditing
                  ? "bg-white text-[#59B7F2] hover:bg-[#F8FAFC] focus:ring-white"
                  : "bg-[#1E3A8A] text-white border border-white/20 hover:bg-[#1E3A8A]/80 focus:ring-white"
              }`}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
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
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-white mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md bg-white/90 border border-white/30 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder:text-slate-400"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md bg-white/90 border border-white/30 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder:text-slate-400"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="background"
                        className="block text-sm font-medium text-white mb-1"
                      >
                        Professional Background
                      </label>
                      <select
                        id="background"
                        name="background"
                        value={formData.background}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md bg-white/90 border border-white/30 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
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
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-white mb-1"
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md bg-white/90 border border-white/30 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder:text-slate-400"
                        placeholder="City, Country"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-white mb-1"
                      >
                        Short Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md bg-white/90 border border-white/30 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-white focus:border-white resize-none placeholder:text-slate-400"
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
                    className="px-4 py-2 bg-[#1E3A8A] text-white font-semibold rounded-md text-sm hover:bg-[#1E3A8A]/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
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
                    className="bg-white/80 backdrop-blur-md border border-white/30 rounded-lg p-5"
                  >
                    <h2 className="text-lg font-medium mb-4 text-[#1E3A8A]">
                      Personal Information
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-[#1E3A8A]/70">
                          Full Name
                        </label>
                        <p className="text-[#1E3A8A] font-medium">
                          {user?.name || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs text-[#1E3A8A]/70">
                          Email Address
                        </label>
                        <p className="text-[#1E3A8A]">
                          {user?.email || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs text-[#1E3A8A]/70">
                          Background
                        </label>
                        <p className="text-[#1E3A8A] capitalize">
                          {user?.background?.replace("_", " ") ||
                            "Not provided"}
                        </p>
                      </div>
                      {formData.location && (
                        <div>
                          <label className="block text-xs text-[#1E3A8A]/70">
                            Location
                          </label>
                          <p className="text-[#1E3A8A]">{formData.location}</p>
                        </div>
                      )}
                      {formData.bio && (
                        <div>
                          <label className="block text-xs text-[#1E3A8A]/70">
                            Bio
                          </label>
                          <p className="text-[#1E3A8A] text-sm">
                            {formData.bio}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    custom={2}
                    variants={fadeIn}
                    className="bg-white/80 backdrop-blur-md border border-white/30 rounded-lg p-5"
                  >
                    <h2 className="text-lg font-medium mb-4 text-[#1E3A8A]">
                      Account Statistics
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.03, filter: "brightness(1.05)" }}
                        className="bg-[#59B7F2]/20 p-4 rounded-lg transition-colors"
                      >
                        <p className="text-[#1E3A8A] text-sm">Resumes</p>
                        <p className="text-2xl font-bold text-[#1E3A8A]">
                          {user?.resumeCount || 0}
                        </p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.03, filter: "brightness(1.05)" }}
                        className="bg-[#59B7F2]/20 p-4 rounded-lg transition-colors"
                      >
                        <p className="text-[#1E3A8A] text-sm">
                          Network Connections
                        </p>
                        <p className="text-2xl font-bold text-[#1E3A8A]">0</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.03, filter: "brightness(1.05)" }}
                        className="bg-[#59B7F2]/20 p-4 rounded-lg transition-colors"
                      >
                        <p className="text-[#1E3A8A] text-sm">
                          Mock Interviews
                        </p>
                        <p className="text-2xl font-bold text-[#1E3A8A]">0</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.03, filter: "brightness(1.05)" }}
                        className="bg-[#59B7F2]/20 p-4 rounded-lg transition-colors"
                      >
                        <p className="text-[#1E3A8A] text-sm">AI Feedback</p>
                        <p className="text-2xl font-bold text-[#1E3A8A]">0</p>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  custom={3}
                  variants={fadeIn}
                  className="mt-6 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg p-5"
                >
                  <h2 className="text-lg font-medium mb-4 text-[#1E3A8A]">
                    Getting Started
                  </h2>
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-start"
                    >
                      <div className="bg-[#59B7F2] rounded-full p-2 mr-3">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-[#1E3A8A]">
                          Complete your profile
                        </h3>
                        <p className="text-sm text-[#1E3A8A]/70">
                          Add more details about your career goals and
                          preferences.
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-start"
                    >
                      <div className="bg-[#59B7F2] rounded-full p-2 mr-3">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-[#1E3A8A]">
                          Upload your resume
                        </h3>
                        <p className="text-sm text-[#1E3A8A]/70">
                          Get AI-powered feedback and improvement suggestions.
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-start"
                    >
                      <div className="bg-[#59B7F2] rounded-full p-2 mr-3">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-[#1E3A8A]">
                          Grow your network
                        </h3>
                        <p className="text-sm text-[#1E3A8A]/70">
                          Get AI suggestions for networking opportunities.
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-start"
                    >
                      <div className="bg-[#59B7F2] rounded-full p-2 mr-3">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-[#1E3A8A]">
                          Practice interview skills
                        </h3>
                        <p className="text-sm text-[#1E3A8A]/70">
                          Schedule AI-powered mock interviews for finance roles.
                        </p>
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
