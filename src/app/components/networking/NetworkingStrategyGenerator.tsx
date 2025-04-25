"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../../lib/supabase";

export interface NetworkingStrategyGeneratorProps {
  onClose: () => void;
  onMessageGenerated?: (
    message: string,
    company: string,
    role: string,
    type: string
  ) => void;
}

export default function NetworkingStrategyGenerator({
  onClose,
  onMessageGenerated,
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
    setGeneratedMessage("");
    setError("");
    setIsGenerating(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        setError("You must be logged in to generate messages");
        setIsGenerating(false);
        return;
      }

      const response = await fetch("/api/networking/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Clone the response for potential text reading
        const responseClone = response.clone();
        let errorMessage = "Failed to generate message";

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, try reading as text from the cloned response
          try {
            const errorText = await responseClone.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            console.error("Failed to read error response as text:", textError);
          }
        }
        throw new Error(errorMessage);
      }

      // Clone response for safe parsing
      const responseForParsing = response.clone();
      try {
        const data = await response.json();
        setGeneratedMessage(data.message);
        // Call the onMessageGenerated callback if it exists
        if (onMessageGenerated) {
          onMessageGenerated(
            data.message,
            formData.companyName,
            formData.role,
            formData.messageType
          );
        }
      } catch (parseError) {
        console.error("Error parsing success response as JSON:", parseError);
        try {
          const text = await responseForParsing.text();
          console.error("Raw response content:", text);
        } catch (textError) {
          console.error("Failed to read response as text:", textError);
        }
        throw new Error("Failed to parse response from server");
      }
    } catch (error: any) {
      console.error("Error generating message:", error);
      setError(
        error.message || "An error occurred while generating your message"
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-xl border border-white/10 shadow-sm max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#1E3A8A]">
            Generate Networking Message
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-[#1E3A8A]/10 transition-colors"
          >
            <svg
              className="w-6 h-6 text-slate-600"
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
                className="block text-sm font-medium text-[#1E3A8A]"
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
                className="appearance-none block w-full px-3 py-3 border border-slate-200 rounded-lg shadow-sm placeholder-slate-400 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] transition-all duration-200 sm:text-sm"
                placeholder="Company name"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-[#1E3A8A]"
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
                className="appearance-none block w-full px-3 py-3 border border-slate-200 rounded-lg shadow-sm placeholder-slate-400 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] transition-all duration-200 sm:text-sm"
                placeholder="Position or role"
              />
            </div>

            <div>
              <label
                htmlFor="contactName"
                className="block text-sm font-medium text-[#1E3A8A]"
              >
                Contact Name (Optional)
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-3 border border-slate-200 rounded-lg shadow-sm placeholder-slate-400 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] transition-all duration-200 sm:text-sm"
                placeholder="Contact person's name"
              />
            </div>

            <div>
              <label
                htmlFor="contactRole"
                className="block text-sm font-medium text-[#1E3A8A]"
              >
                Contact Role (Optional)
              </label>
              <input
                type="text"
                id="contactRole"
                name="contactRole"
                value={formData.contactRole}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-3 border border-slate-200 rounded-lg shadow-sm placeholder-slate-400 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] transition-all duration-200 sm:text-sm"
                placeholder="Contact's role or position"
              />
            </div>

            <div>
              <label
                htmlFor="resumeText"
                className="block text-sm font-medium text-[#1E3A8A]"
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
                className="appearance-none block w-full px-3 py-3 border border-slate-200 rounded-lg shadow-sm placeholder-slate-400 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] transition-all duration-200 sm:text-sm custom-scrollbar"
                placeholder="Copy all text from your resume document and paste it here"
              />
            </div>

            <div>
              <label
                htmlFor="messageType"
                className="block text-sm font-medium text-[#1E3A8A]"
              >
                Message Type
              </label>
              <select
                id="messageType"
                name="messageType"
                value={formData.messageType}
                onChange={handleInputChange}
                required
                className="appearance-none block w-full px-3 py-3 border border-slate-200 rounded-lg shadow-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] transition-all duration-200 sm:text-sm"
              >
                <option value="linkedin_message">LinkedIn Message</option>
                <option value="intro_email">Introduction Email</option>
                <option value="cover_letter">Cover Letter</option>
              </select>
            </div>

            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

            {/* Generated Message Display */}
            {generatedMessage && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-[#1E3A8A] mb-2">
                  Generated Message
                </label>
                <div className="bg-[#1E3A8A]/5 border border-slate-200 rounded-lg p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                  <pre className="text-slate-700 whitespace-pre-wrap font-sans">
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
              className="px-4 py-2 rounded-md bg-[#1E3A8A]/10 text-[#1E3A8A] hover:bg-[#B3E5FC] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#59B7F2] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
