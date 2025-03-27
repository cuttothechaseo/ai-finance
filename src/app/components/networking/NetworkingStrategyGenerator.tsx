"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface NetworkingStrategyGeneratorProps {
  onClose: () => void;
}

export default function NetworkingStrategyGenerator({
  onClose,
}: NetworkingStrategyGeneratorProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    contactName: "",
    contactRole: "",
    resumeText: "",
    messageType: "linkedin_message",
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // API call will be implemented here
      console.log("Generating message with:", formData);
    } catch (error) {
      console.error("Error generating message:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-medium text-white">
            Generate Networking Message
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-300"
              >
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-300"
              >
                Target Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="contactName"
                className="block text-sm font-medium text-gray-300"
              >
                Contact Name (Optional)
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="contactRole"
                className="block text-sm font-medium text-gray-300"
              >
                Contact Role (Optional)
              </label>
              <input
                type="text"
                id="contactRole"
                name="contactRole"
                value={formData.contactRole}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="resumeText"
                className="block text-sm font-medium text-gray-300"
              >
                Resume Text
              </label>
              <textarea
                id="resumeText"
                name="resumeText"
                value={formData.resumeText}
                onChange={handleInputChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="messageType"
                className="block text-sm font-medium text-gray-300"
              >
                Message Type
              </label>
              <select
                id="messageType"
                name="messageType"
                value={formData.messageType}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              >
                <option value="linkedin_message">LinkedIn Message</option>
                <option value="intro_email">Introduction Email</option>
                <option value="cover_letter">Cover Letter</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate Message"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
