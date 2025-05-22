"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";

const ResumeAnalysis = dynamic(() => import("../resume/ResumeAnalysis"), {
  ssr: false,
});

interface ResumeSectionProps {
  user: any;
}

export default function ResumeSection({ user }: ResumeSectionProps) {
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResumeId, setAnalysisResumeId] = useState<string | null>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const staggerItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const listItem = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const handleViewPreview = (resume: any) => {
    setSelectedResume(resume);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  const handleAnalyzeResume = async (resume: any) => {
    console.group("Resume Analysis Start");
    console.log("Resume data:", {
      id: resume?.id,
      file_name: resume?.file_name,
      has_user_id: Boolean(resume?.user_id),
    });

    if (!resume || !resume.id) {
      console.error("Invalid resume data:", resume);
      console.groupEnd();
      // Show an error toast or message to the user
      return;
    }

    // Validate resume ID format (UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isValidUuid =
      typeof resume.id === "string" && uuidRegex.test(resume.id);

    // Log the exact resume ID for debugging
    console.log("Resume ID for analysis:", {
      exactId: resume.id,
      formattedForLog: `${resume.id.substring(0, 8)}-${resume.id.substring(
        8,
        12
      )}-${resume.id.substring(12, 16)}-${resume.id.substring(
        16,
        20
      )}-${resume.id.substring(20)}`,
      isValid: isValidUuid,
      idType: typeof resume.id,
      idLength: resume.id.length,
    });

    if (!isValidUuid) {
      console.error("Invalid resume ID format:", resume.id);
      console.groupEnd();
      // Show an error toast or message to the user
      return;
    }

    try {
      // Validate the resume ID exists in the database
      const { data: resumeCheck, error: resumeCheckError } = await supabase
        .from("resumes")
        .select("id")
        .eq("id", resume.id)
        .maybeSingle();

      if (resumeCheckError) {
        console.error("Error verifying resume ID:", resumeCheckError);
        console.groupEnd();
        return;
      }

      if (!resumeCheck) {
        console.error("Resume ID not found in database:", resume.id);
        console.groupEnd();
        // Show an error message to the user
        return;
      }

      console.log("Resume ID verified in database:", resumeCheck.id);

      console.log(`Preparing to analyze resume: ${resume.id}`);
      setAnalysisResumeId(resume.id);
      setShowAnalysis(true);
      console.groupEnd();
    } catch (error) {
      console.error("Error preparing resume analysis:", error);
      console.groupEnd();
      // Show an error toast or message to the user
    }
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setAnalysisResumeId(null);
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-white shadow-md rounded-lg overflow-hidden border border-[#E6E8F0]"
      >
        <div className="px-6 py-5 border-b border-[#E6E8F0] flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1E293B]">Your Resumes</h1>
          <Link href="/resume" className="group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 border border-[#DCEFFB] shadow-sm text-sm font-medium rounded-md text-[#1E293B] bg-white hover:bg-[#E0F7FA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B3E5FC] transition-all duration-200"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-[#1E293B] group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Upload New Resume
            </motion.div>
          </Link>
        </div>
        <div className="p-6">
          {user?.resumes && user.resumes.length > 0 ? (
            <motion.div
              variants={staggerItems}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {user.resumes.map((resume: any, index: number) => (
                <motion.div
                  key={index}
                  variants={listItem}
                  className="bg-white rounded-lg overflow-hidden border border-[#E6E8F0] shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-[#E0F7FA] rounded-full p-2">
                        <svg
                          className="w-6 h-6 text-[#1E293B]"
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
                      <div className="flex-1">
                        <h3 className="font-medium text-lg truncate text-[#1E293B]">
                          {resume.file_name}
                        </h3>
                        <p className="text-sm text-[#475569]">
                          {resume.created_at
                            ? `Uploaded on ${new Date(
                                resume.created_at
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}`
                            : "Recently uploaded"}
                        </p>
                        {resume.file_size && (
                          <p className="text-xs text-[#475569] mt-1">
                            {(resume.file_size / 1024 / 1024).toFixed(2)} MB •{" "}
                            {resume.file_type?.toUpperCase() || "Document"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white px-4 py-3 flex justify-end space-x-2 border-t border-[#E6E8F0]">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewPreview(resume)}
                      className="p-2 bg-[#E6E8F0] rounded-md hover:bg-[#C9DFFF] transition-colors"
                      title="View Resume"
                    >
                      <svg
                        className="w-5 h-5 text-[#334155]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnalyzeResume(resume)}
                      className="p-2 bg-[#E0F7FA] rounded-md hover:bg-[#B3E5FC] transition-colors"
                      title="Get AI Feedback"
                    >
                      <svg
                        className="w-5 h-5 text-[#1E293B]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </motion.button>
                    <a
                      href={resume.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-[#B3E5FC] rounded-md hover:bg-[#A7C7E7] transition-colors"
                        title="Download Resume"
                      >
                        <svg
                          className="w-5 h-5 text-[#1E293B]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </motion.div>
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div variants={fadeIn} className="text-center py-10">
              <svg
                className="mx-auto h-12 w-12 text-[#94A3B8]"
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
              <h3 className="mt-2 text-sm font-medium text-[#1E293B]">
                No resumes yet
              </h3>
              <p className="mt-1 text-sm text-[#475569]">
                Get started by uploading your first resume.
              </p>
              <div className="mt-6">
                <Link href="/resume" className="group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2 border border-[#DCEFFB] shadow-sm text-sm font-medium rounded-md text-[#1E293B] bg-white hover:bg-[#E0F7FA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B3E5FC] transition-all duration-200"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5 text-[#1E293B] group-hover:rotate-90 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Upload Resume
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Resume Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedResume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-[#E6E8F0] flex justify-between items-center">
                <h3 className="text-xl font-medium text-[#1E293B]">
                  {selectedResume.file_name}
                </h3>
                <button
                  onClick={closePreview}
                  className="p-1 rounded-md hover:bg-[#E6E8F0] transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-[#475569]"
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
              <div className="p-6 overflow-auto h-[calc(90vh-8rem)]">
                <iframe
                  src={selectedResume.resume_url}
                  className="w-full h-full bg-white rounded border border-[#E6E8F0]"
                  title={selectedResume.file_name}
                />
              </div>
              <div className="px-6 py-4 border-t border-[#E6E8F0] flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closePreview}
                  className="px-4 py-2 rounded-md bg-[#E6E8F0] text-[#334155] hover:bg-[#C9DFFF] transition-colors"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    closePreview();
                    handleAnalyzeResume(selectedResume);
                  }}
                  className="px-4 py-2 rounded-md bg-[#B3E5FC] text-[#1E293B] hover:bg-[#A7C7E7] transition-colors flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2 text-[#1E293B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Get AI Feedback
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume Analysis Modal */}
      <AnimatePresence>
        {showAnalysis && analysisResumeId && (
          <ResumeAnalysis resumeId={analysisResumeId} onClose={closeAnalysis} />
        )}
      </AnimatePresence>
    </>
  );
}
