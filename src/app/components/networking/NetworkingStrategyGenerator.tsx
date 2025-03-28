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
  const [processingStep, setProcessingStep] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedMessage("");
    setError("");
    setIsGenerating(true);
    setProcessingStep("Starting...");
    setProgress(10);

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
        let errorMessage = "Failed to generate message";

        const responseClone = response.clone();

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError);

          try {
            const errorText = await responseClone.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            console.error("Failed to parse error response as text:", textError);
          }
        }

        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response stream");
      }

      const decoder = new TextDecoder();
      let receivedMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        const events = chunk.split("\n\n");
        for (const event of events) {
          if (event.startsWith("data: ")) {
            try {
              const data = JSON.parse(event.slice(6));

              if (data.status === "processing") {
                if (data.progress !== undefined) {
                  setProgress(data.progress);
                } else {
                  switch (data.step) {
                    case "starting":
                      setProcessingStep("Initializing...");
                      setProgress(10);
                      break;
                    case "authenticating":
                      setProcessingStep("Authenticating...");
                      setProgress(20);
                      break;
                    case "parsing_request":
                      setProcessingStep("Processing request...");
                      setProgress(30);
                      break;
                    case "generating_message":
                      setProcessingStep("Generating message with Claude...");
                      if (data.progress === undefined) {
                        setProgress(50);
                      }
                      break;
                    case "saving_message":
                      setProcessingStep("Saving generated message...");
                      if (data.progress === undefined) {
                        setProgress(80);
                      }
                      break;
                    default:
                      setProcessingStep(`Processing: ${data.step}`);
                  }
                }

                if (data.step === "generating_message") {
                  if (data.elapsed !== undefined) {
                    setProcessingStep(
                      `Generating message with Claude... (${data.elapsed}s)`
                    );
                  } else {
                    setProcessingStep("Generating message with Claude...");
                  }
                }
              } else if (data.status === "completed") {
                setProcessingStep("Complete!");
                setProgress(100);
                setGeneratedMessage(data.message);
              } else if (data.status === "error") {
                throw new Error(data.error || "An error occurred");
              }
            } catch (parseError) {
              console.error("Error parsing stream event:", parseError, event);
            }
          }
        }
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

  const renderProgressBar = () => {
    if (!isGenerating) return null;

    // Determine if we're in the Claude generation phase
    const isGeneratingPhase = processingStep.includes(
      "Generating message with Claude"
    );

    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-gray-300">{processingStep}</p>
          <p className="text-sm text-gray-300">{progress}%</p>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              isGeneratingPhase ? "bg-primary animate-pulse" : "bg-primary"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {isGeneratingPhase && (
          <p className="text-xs text-gray-400 mt-1">
            This may take a moment. Claude is crafting your message...
          </p>
        )}
      </div>
    );
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

            {renderProgressBar()}

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
