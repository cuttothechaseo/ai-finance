import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getUserWithDetails } from "../lib/auth";
import { useRouter } from "next/router";
import Link from "next/link";

export default function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" or "error"
    const [user, setUser] = useState(null);
    const router = useRouter();

    // Check if user is authenticated
    useEffect(() => {
        async function fetchUser() {
            try {
                const userData = await getUserWithDetails();
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user:", error);
                router.push("/login");
            }
        }
        fetchUser();
    }, [router]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
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

        // Validate file type
        const fileExt = file.name.split(".").pop().toLowerCase();
        if (!["pdf", "docx", "doc"].includes(fileExt)) {
            setMessage("Please upload a PDF or Word document.");
            setMessageType("error");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage("File size should be less than 5MB.");
            setMessageType("error");
            return;
        }

        setUploading(true);
        setMessage("");
        
        try {
            // Create a unique file path
            const filePath = `resumes/${user.id}/${Date.now()}-${file.name}`;

            // Upload file to Supabase Storage
            const { data, error } = await supabase.storage
                .from("resumes")
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            // Get the public URL for the uploaded file
            const { data: urlData } = supabase.storage
                .from("resumes")
                .getPublicUrl(filePath);

            const publicURL = urlData.publicUrl;

            // Store resume information in the database
            const { error: dbError } = await supabase.from("resumes").insert([
                { 
                    user_id: user.id, 
                    resume_url: publicURL,
                    file_name: file.name,
                    file_type: fileExt,
                    file_size: file.size,
                    created_at: new Date()
                }
            ]);

            if (dbError) {
                throw dbError;
            }

            setMessage("Resume uploaded successfully! Redirecting to dashboard...");
            setMessageType("success");
            
            // Redirect to dashboard after successful upload
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
            
        } catch (error) {
            console.error("Upload error:", error);
            setMessage(`Upload failed: ${error.message}`);
            setMessageType("error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <nav className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/dashboard" className="text-xl font-bold text-primary">
                        AI Finance
                    </Link>
                    <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white">
                        &larr; Back to Dashboard
                    </Link>
                </div>
            </nav>

            <div className="flex-grow flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
                    <div className="px-6 py-5 border-b border-gray-700">
                        <h1 className="text-2xl font-bold">Upload Your Resume</h1>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <p className="text-gray-300 mb-4">
                                Upload your resume to get AI-powered feedback and improvement suggestions.
                                We accept PDF and Word documents.
                            </p>
                            
                            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                <label className="cursor-pointer">
                                    <input 
                                        type="file" 
                                        accept=".pdf,.docx,.doc" 
                                        onChange={handleFileChange} 
                                        className="hidden" 
                                    />
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        
                                        {file ? (
                                            <div className="mt-2">
                                                <p className="text-primary font-medium">{file.name}</p>
                                                <p className="text-xs text-gray-400">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="mt-2 text-sm text-gray-400">
                                                Click to select or drag and drop your resume<br />
                                                <span className="text-xs">(PDF, DOCX, max 5MB)</span>
                                            </p>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>

                        {message && (
                            <div className={`p-3 rounded-md mb-4 ${
                                messageType === "success" 
                                    ? "bg-green-900/50 border border-green-500 text-green-200" 
                                    : "bg-red-900/50 border border-red-500 text-red-200"
                            }`}>
                                <p>{message}</p>
                            </div>
                        )}

                        <button
                            onClick={uploadResume}
                            disabled={uploading || !file}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                !file 
                                    ? "bg-gray-600 cursor-not-allowed" 
                                    : "bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            }`}
                        >
                            {uploading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : "Upload Resume"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 