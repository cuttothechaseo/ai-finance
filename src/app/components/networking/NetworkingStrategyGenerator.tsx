"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../../lib/supabase";

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
    messageType: "linkedin_message" as
      | "linkedin_message"
      | "intro_email"
      | "cover_letter",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError("");
    setGeneratedMessage("");

    try {
      // Add short timeout to avoid API overloading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        // Send a trimmed version of the resume text to reduce payload size
        const trimmedFormData = {
          ...formData,
          resumeText: formData.resumeText.substring(0, 500), // Limit to 500 chars
        };

        const response = await fetch("/api/networking/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trimmedFormData),
          signal: controller.signal,
        });

        // Check for timeout or network error first
        if (!response) {
          throw new Error(
            "Network error. Please check your connection and try again."
          );
        }

        // Get response text first to handle non-JSON responses
        const responseText = await response.text();

        // Early check for empty response
        if (!responseText || responseText.trim() === "") {
          throw new Error(
            "Server returned an empty response. Please try again."
          );
        }

        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse response as JSON:", responseText);
          throw new Error(
            "Server returned invalid JSON. This may indicate a server error."
          );
        }

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || `Error ${response.status}: Failed to generate message`
          );
        }

        setGeneratedMessage(data.message);
      } catch (fetchError: any) {
        if (fetchError.name === "AbortError") {
          throw new Error("Request timed out. Please try again.");
        }
        throw fetchError;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error: any) {
      console.error("Error generating message:", error);
      setError(
        error.message ||
          "An error occurred while generating the message. Please try again."
      );
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
        className="bg-[#151538] rounded-lg shadow-xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#2A2A4A] flex justify-between items-center">
          <h3 className="text-xl font-medium text-white">
            Generate Networking Message
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-[#2A2A4A] transition-colors"
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
                className="appearance-none block w-full px-3 py-3 border border-[#3A3A5A] rounded-lg shadow-sm placeholder-[#6C6C8A] bg-[#1E1E3F]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF] transition-all duration-200 sm:text-sm"
                placeholder="Company name"
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
                className="appearance-none block w-full px-3 py-3 border border-[#3A3A5A] rounded-lg shadow-sm placeholder-[#6C6C8A] bg-[#1E1E3F]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF] transition-all duration-200 sm:text-sm"
                placeholder="Position or role"
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
                className="appearance-none block w-full px-3 py-3 border border-[#3A3A5A] rounded-lg shadow-sm placeholder-[#6C6C8A] bg-[#1E1E3F]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF] transition-all duration-200 sm:text-sm"
                placeholder="Contact person's name"
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
                className="appearance-none block w-full px-3 py-3 border border-[#3A3A5A] rounded-lg shadow-sm placeholder-[#6C6C8A] bg-[#1E1E3F]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF] transition-all duration-200 sm:text-sm"
                placeholder="Contact's role or position"
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
                className="appearance-none block w-full px-3 py-3 border border-[#3A3A5A] rounded-lg shadow-sm placeholder-[#6C6C8A] bg-[#1E1E3F]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF] transition-all duration-200 sm:text-sm custom-scrollbar"
                placeholder="Paste your resume text here"
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
                className="appearance-none block w-full px-3 py-3 border border-[#3A3A5A] rounded-lg shadow-sm bg-[#1E1E3F]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF] transition-all duration-200 sm:text-sm"
              >
                <option value="linkedin_message">LinkedIn Message</option>
                <option value="intro_email">Introduction Email</option>
                <option value="cover_letter">Cover Letter</option>
              </select>
            </div>

            {error && <div className="text-red-400 text-sm mt-2">{error}</div>}

            {/* Generated Message Display */}
            {generatedMessage && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-white mb-2">
                  Generated Message
                </label>
                <div className="bg-gray-800 rounded-lg p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                  <pre className="text-gray-300 whitespace-pre-wrap font-sans">
                    {generatedMessage}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-[#2A2A4A] text-white hover:bg-[#3A3A5A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2 rounded-md bg-[#6C63FF] text-white hover:bg-[#5A52D5] transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
