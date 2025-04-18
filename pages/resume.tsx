"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import Link from "next/link";
import ResumeAnalysis from "../src/app/components/resume/ResumeAnalysis";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>(""); // "success" or "error"
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [uploadedResumeId, setUploadedResumeId] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setMessage("");
    setMessageType("");
  };

  const uploadResume = async () => {
    if (!file) {
      setMessage("Please select a file.");
      setMessageType("error");
      return;
    }

    setUploading(true);
    const bucketName = "resumes"; // ✅ Ensure this matches your actual bucket name
    const filePath = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`; // ✅ Remove spaces from file name

    // Get authenticated user
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setMessage("User authentication failed.");
      setMessageType("error");
      setUploading(false);
      return;
    }

    const { data, error } = await supabase.storage
      .from(bucketName) // ✅ Use correct bucket reference
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      setMessage("Upload failed.");
      setMessageType("error");
      console.error(error);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    const publicURL = urlData.publicUrl;

    // Save the resume information to the database
    const { data: resumeData, error: dbError } = await supabase
      .from("resumes")
      .insert([
        {
          user_id: user.user.id,
          resume_url: publicURL,
          file_name: file.name,
          file_type: file.type,
          file_size: Math.round(file.size / 1024), // Convert to KB
          uploaded_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (dbError) {
      setMessage("Failed to save resume information.");
      setMessageType("error");
      console.error(dbError);
    } else {
      setMessage("Resume uploaded successfully!");
      setMessageType("success");
      // Reset file input after successful upload
      setFile(null);
      // Start analysis
      setUploadedResumeId(resumeData.id);
      setShowAnalysis(true);
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#59B7F2] flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Upload Your Resume</h1>
          <Link
            href="/dashboard"
            className="text-[#B3E5FC] hover:text-white transition-colors duration-200"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm mb-8">
          <div className="mb-6">
            <p className="text-slate-700 mb-4">
              Upload your resume to get personalized finance interview questions
              and feedback. We support PDF, DOCX, and TXT formats up to 5MB.
            </p>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  messageType === "success"
                    ? "bg-green-100 border border-green-300 text-green-700"
                    : "bg-red-100 border border-red-300 text-red-700"
                }`}
              >
                {message}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1E3A8A] mb-2">
              Select your resume file
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-700
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#1E3A8A]/10 file:text-[#1E3A8A]
                                hover:file:bg-[#B3E5FC] hover:file:text-[#1E3A8A]
                                file:cursor-pointer file:transition-colors
                                cursor-pointer"
            />
            {file && (
              <p className="mt-2 text-sm text-slate-600">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                MB)
              </p>
            )}
          </div>

          <button
            onClick={uploadResume}
            disabled={uploading || !file}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#59B7F2] focus:outline-none focus:ring-2 focus:ring-[#B3E5FC] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
          <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">Resume Tips</h2>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start">
              <span className="text-[#59B7F2] mr-2">•</span>
              Keep your resume to one page for finance roles.
            </li>
            <li className="flex items-start">
              <span className="text-[#59B7F2] mr-2">•</span>
              Quantify your achievements with numbers and percentages.
            </li>
            <li className="flex items-start">
              <span className="text-[#59B7F2] mr-2">•</span>
              Include relevant finance-specific skills and certifications.
            </li>
            <li className="flex items-start">
              <span className="text-[#59B7F2] mr-2">•</span>
              Tailor your resume to the specific finance role you&apos;re
              applying for.
            </li>
            <li className="flex items-start">
              <span className="text-[#59B7F2] mr-2">•</span>
              Proofread carefully - attention to detail is critical in finance.
            </li>
          </ul>
        </div>
      </div>

      {showAnalysis && uploadedResumeId && (
        <ResumeAnalysis
          resumeId={uploadedResumeId}
          onClose={() => {
            setShowAnalysis(false);
            setUploadedResumeId(null);
            router.push("/dashboard");
          }}
        />
      )}
    </div>
  );
}
