"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";
import { getUserWithDetails } from "../../lib/auth";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/dashboard/Sidebar";
import InterviewDashboardNavbar from "@/app/interview-dashboard/components/InterviewDashboardNavbar";

// Import the props type
import type { NetworkingStrategyGeneratorProps } from "../components/networking/NetworkingStrategyGenerator";

// Type the dynamic import
const NetworkingStrategyGenerator = dynamic<NetworkingStrategyGeneratorProps>(
  () => import("../components/networking/NetworkingStrategyGenerator"),
  { ssr: false }
);

export default function NetworkingPage() {
  const [showGenerator, setShowGenerator] = useState(false);
  const [hasGeneratedMessage, setHasGeneratedMessage] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [messageInfo, setMessageInfo] = useState({
    company: "",
    role: "",
    type: "",
  });
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("message");
  const [activeGuidanceTab, setActiveGuidanceTab] = useState(0);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getUserWithDetails();
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      setSidebarOpen(window.innerWidth >= 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  // Reset the copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleMessageGenerated = (
    message: string,
    company: string,
    role: string,
    type: string
  ) => {
    setHasGeneratedMessage(true);
    setShowGenerator(false);
    setGeneratedMessage(message);
    setMessageInfo({
      company,
      role,
      type:
        type === "linkedin_message"
          ? "LinkedIn Message"
          : type === "intro_email"
          ? "Introduction Email"
          : "Cover Letter",
    });
  };

  const handleViewMessages = () => {
    router.push("/networking/messages");
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage).then(
      () => {
        setCopied(true);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const formatMessageDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#59B7F2]">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        } ${isMobile ? "pl-0" : ""}`}
      >
        <InterviewDashboardNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-[#59B7F2] p-6">
          {/* Header Section with SVG Cloud Overlays (Features.tsx style) */}
          <div
            className="relative w-full flex flex-col items-center justify-center pt-16 pb-12 mb-8"
            style={{ minHeight: "220px" }}
          >
            {/* Top Right SVG Cloud */}
            <svg
              className="absolute top-0 right-0 w-64 h-64 opacity-20 z-0 pointer-events-none select-none"
              viewBox="0 0 200 200"
              fill="white"
            >
              <circle cx="60" cy="60" r="50" />
              <circle cx="100" cy="70" r="60" />
              <circle cx="140" cy="60" r="50" />
            </svg>
            {/* Bottom Left SVG Cloud */}
            <svg
              className="absolute bottom-0 left-10 w-72 h-72 opacity-5 z-0 pointer-events-none select-none"
              viewBox="0 0 200 200"
              fill="white"
            >
              <circle cx="60" cy="60" r="50" />
              <circle cx="100" cy="70" r="60" />
              <circle cx="140" cy="60" r="50" />
            </svg>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 z-10 text-center">
              Networking Outreach
            </h1>
            <p className="text-white text-lg z-10 text-center max-w-2xl">
              Create AI-generated personalized outreach messages for networking
            </p>
          </div>
          <div className="min-h-screen bg-[#59B7F2] flex flex-col py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions - full width if no generated message */}
                {!hasGeneratedMessage || !generatedMessage ? (
                  <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm flex flex-col items-start">
                      <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                        Quick Actions
                      </h2>
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => setShowGenerator(true)}
                          className="flex items-center justify-center px-5 py-2 rounded-md bg-[#1E3A8A] text-white font-semibold text-base shadow hover:bg-[#22357A] transition-colors duration-200 w-full sm:w-auto"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
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
                          Generate New Message
                        </button>
                        <a
                          href="/networking/messages"
                          className="flex items-center justify-center px-5 py-2 rounded-md bg-[#1E3A8A] text-white font-semibold text-base shadow hover:bg-[#22357A] transition-colors duration-200 w-full sm:w-auto"
                        >
                          View Recent Messages
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  [
                    <div className="lg:col-span-1" key="left-col">
                      <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm mb-8">
                        <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                          Quick Actions
                        </h2>
                        <div className="space-y-4">
                          <button
                            onClick={handleViewMessages}
                            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#59B7F2] focus:outline-none focus:ring-2 focus:ring-[#B3E5FC] transition-all duration-200"
                          >
                            <svg
                              className="w-5 h-5 mr-2 text-current"
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
                            View All Messages
                          </button>
                          <button
                            onClick={() => setShowGenerator(true)}
                            className="w-full flex items-center justify-center px-4 py-3 border border-[#1E3A8A]/20 rounded-lg shadow-sm text-sm font-semibold text-[#1E3A8A] bg-white hover:bg-[#1E3A8A]/5 focus:outline-none focus:ring-2 focus:ring-[#B3E5FC] transition-all duration-200"
                          >
                            <svg
                              className="w-5 h-5 mr-2 text-current"
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
                            Generate New Message
                          </button>
                        </div>
                      </div>
                    </div>,
                    <div className="lg:col-span-2" key="right-col">
                      <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
                        {hasGeneratedMessage && generatedMessage ? (
                          <>
                            <div className="flex justify-between items-center mb-4">
                              <h2 className="text-xl font-bold text-[#1E3A8A]">
                                Generated {messageInfo.type}
                              </h2>
                              <span className="text-sm text-slate-500">
                                {formatMessageDate()}
                              </span>
                            </div>
                            <div className="mb-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {messageInfo.company} - {messageInfo.role}
                              </span>
                            </div>

                            {/* Tab Navigation */}
                            <div className="border-b border-slate-200 mb-6">
                              <nav className="flex -mb-px space-x-6">
                                <button
                                  onClick={() => setActiveTab("message")}
                                  className={`py-3 border-b-2 font-medium text-sm ${
                                    activeTab === "message"
                                      ? "border-[#1E3A8A] text-[#1E3A8A]"
                                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                  }`}
                                >
                                  Message
                                </button>
                                <button
                                  onClick={() => setActiveTab("keyElements")}
                                  className={`py-3 border-b-2 font-medium text-sm ${
                                    activeTab === "keyElements"
                                      ? "border-[#1E3A8A] text-[#1E3A8A]"
                                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                  }`}
                                >
                                  Key Elements
                                </button>
                                <button
                                  onClick={() => setActiveTab("bestPractices")}
                                  className={`py-3 border-b-2 font-medium text-sm ${
                                    activeTab === "bestPractices"
                                      ? "border-[#1E3A8A] text-[#1E3A8A]"
                                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                  }`}
                                >
                                  Best Practices
                                </button>
                              </nav>
                            </div>

                            {/* Tab Content */}
                            {activeTab === "message" && (
                              <div className="bg-[#F8FAFC] border border-[#E6E8F0] rounded-md p-5 mb-6">
                                <div className="mb-3">
                                  <p className="text-sm text-slate-600 mb-2">
                                    Subject:
                                  </p>
                                  <div className="bg-[#1E3A8A]/5 p-3 rounded text-[#1E293B]">
                                    {messageInfo.type === "LinkedIn Message"
                                      ? "Connection Request - Investment Banking Opportunity at " +
                                        messageInfo.company
                                      : messageInfo.type ===
                                        "Introduction Email"
                                      ? "Interest in " +
                                        messageInfo.role +
                                        " Position at " +
                                        messageInfo.company
                                      : "Cover Letter for " +
                                        messageInfo.role +
                                        " Opportunity at " +
                                        messageInfo.company}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-slate-600 mb-2">
                                    {messageInfo.type === "Cover Letter"
                                      ? "Letter Body:"
                                      : "Message:"}
                                  </p>
                                  <div className="bg-[#F8FAFC] border border-[#E6E8F0] rounded-md p-5 whitespace-pre-wrap">
                                    <p className="text-[#1E293B]">
                                      {generatedMessage}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeTab === "keyElements" && (
                              <div className="space-y-6 mt-12">
                                {/* Key Elements */}
                                <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
                                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                                    Key Elements
                                  </h2>
                                  <ul className="space-y-2 text-slate-700">
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        <strong className="text-[#1E3A8A]">
                                          Personalization:
                                        </strong>{" "}
                                        Reference specific aspects of their
                                        profile
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        <strong className="text-[#1E3A8A]">
                                          Brevity:
                                        </strong>{" "}
                                        Keep messages under 150 words
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        <strong className="text-[#1E3A8A]">
                                          Clear request:
                                        </strong>{" "}
                                        Specific, reasonable ask (information,
                                        brief call)
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        <strong className="text-[#1E3A8A]">
                                          Professional tone:
                                        </strong>{" "}
                                        Formal but conversational language
                                      </span>
                                    </li>
                                  </ul>
                                </div>

                                {/* Email Structure */}
                                <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
                                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                                    Email Structure
                                  </h2>
                                  <ul className="space-y-2 text-slate-700">
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        <strong className="text-[#1E3A8A]">
                                          Introduction:
                                        </strong>{" "}
                                        Who you are and purpose of email
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        <strong className="text-[#1E3A8A]">
                                          Body:
                                        </strong>{" "}
                                        Your relevant experience and specific
                                        qualifications
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        <strong className="text-[#1E3A8A]">
                                          Value proposition:
                                        </strong>{" "}
                                        What you can offer to the company
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        <strong className="text-[#1E3A8A]">
                                          Call to action:
                                        </strong>{" "}
                                        Request for conversation or next steps
                                      </span>
                                    </li>
                                  </ul>
                                </div>

                                {/* Cover Letter Structure */}
                                <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
                                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                                    Cover Letter Structure
                                  </h2>
                                  <ul className="space-y-2 text-slate-700">
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        <strong className="text-[#1E3A8A]">
                                          Opening paragraph:
                                        </strong>{" "}
                                        Specify the position you are applying
                                        for and express your interest
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        <strong className="text-[#1E3A8A]">
                                          Experience paragraphs:
                                        </strong>{" "}
                                        Highlight relevant experience with
                                        specific examples and achievements
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        <strong className="text-[#1E3A8A]">
                                          Education & skills:
                                        </strong>{" "}
                                        Summarize relevant education and
                                        transferable skills
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        <strong className="text-[#1E3A8A]">
                                          Closing paragraph:
                                        </strong>{" "}
                                        Express enthusiasm and include a call to
                                        action
                                      </span>
                                    </li>
                                  </ul>
                                </div>

                                {/* Cover Letter Best Practices */}
                                <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
                                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                                    Cover Letter Best Practices
                                  </h2>
                                  <ul className="space-y-2 text-slate-700">
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        Keep cover letters concise – aim for one
                                        page maximum
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        Address the letter to a specific person
                                        rather than &quot;To Whom It May
                                        Concern&quot;
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        Quantify achievements with specific
                                        numbers and percentages when possible
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        Tailor each cover letter to the specific
                                        company and role
                                      </span>
                                    </li>
                                  </ul>
                                </div>

                                {/* Best Practices for Networking Outreach */}
                                <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
                                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                                    Best Practices for Networking Outreach
                                  </h2>
                                  <p className="text-slate-700 mb-4">
                                    Effective networking outreach can
                                    dramatically increase your chances of
                                    landing interviews at top finance firms.
                                    Follow these best practices to make your
                                    messages stand out.
                                  </p>
                                  <ul className="space-y-2 text-slate-700">
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        Personalize each message with specific
                                        details about the company and role
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        Keep LinkedIn messages concise and under
                                        150 words
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        Follow up politely if you do not hear
                                        back within 1-2 weeks
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        Highlight relevant experience and skills
                                        that match the position
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span>
                                        Always include a clear call to action in
                                        your message
                                      </span>
                                    </li>
                                  </ul>
                                </div>

                                {/* Dos and Donts */}
                                <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
                                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                                    Dos and Donts
                                  </h2>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h3 className="font-semibold text-green-600 mb-2">
                                        Do:
                                      </h3>
                                      <ul className="space-y-2 text-slate-700">
                                        <li className="flex items-start">
                                          <span className="text-green-600 mr-2">
                                            ✓
                                          </span>
                                          <span>
                                            Research the person and company
                                            thoroughly before reaching out
                                          </span>
                                        </li>
                                        <li className="flex items-start">
                                          <span className="text-green-600 mr-2">
                                            ✓
                                          </span>
                                          <span>
                                            Make a specific connection to the
                                            recipient's background
                                          </span>
                                        </li>
                                        <li className="flex items-start">
                                          <span className="text-green-600 mr-2">
                                            ✓
                                          </span>
                                          <span>
                                            Offer something of value when
                                            possible
                                          </span>
                                        </li>
                                        <li className="flex items-start">
                                          <span className="text-green-600 mr-2">
                                            ✓
                                          </span>
                                          <span>
                                            Proofread multiple times for grammar
                                            and spelling
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-red-600 mb-2">
                                        Do not:
                                      </h3>
                                      <ul className="space-y-2 text-slate-700">
                                        <li className="flex items-start">
                                          <span className="text-red-600 mr-2">
                                            ✗
                                          </span>
                                          <span>
                                            Send generic messages that could
                                            apply to anyone
                                          </span>
                                        </li>
                                        <li className="flex items-start">
                                          <span className="text-red-600 mr-2">
                                            ✗
                                          </span>
                                          <span>
                                            Make unreasonable requests (like
                                            lengthy calls) in first contact
                                          </span>
                                        </li>
                                        <li className="flex items-start">
                                          <span className="text-red-600 mr-2">
                                            ✗
                                          </span>
                                          <span>
                                            Forget to follow up after initial
                                            contact
                                          </span>
                                        </li>
                                        <li className="flex items-start">
                                          <span className="text-red-600 mr-2">
                                            ✗
                                          </span>
                                          <span>
                                            Use overly casual language or slang
                                            in professional communication
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeTab === "bestPractices" && (
                              <div className="space-y-6 mb-6">
                                <div className="bg-white p-6 rounded-lg border border-slate-200">
                                  <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                                    Best Practices for Networking Outreach
                                  </h3>
                                  <p className="text-slate-700 mb-4">
                                    Effective networking outreach can
                                    dramatically increase your chances of
                                    landing interviews at top finance firms.
                                    Follow these best practices to make your
                                    messages stand out.
                                  </p>
                                  <ul className="space-y-2">
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span className="text-slate-700">
                                        Personalize each message with specific
                                        details about the company and role
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span className="text-slate-700">
                                        Keep LinkedIn messages concise and under
                                        150 words
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span className="text-slate-700">
                                        Follow up politely if you do not hear
                                        back within 1-2 weeks
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span className="text-slate-700">
                                        Highlight relevant experience and skills
                                        that match the position
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#59B7F2] mr-2">
                                        •
                                      </span>
                                      <span className="text-slate-700">
                                        Always include a clear call to action in
                                        your message
                                      </span>
                                    </li>
                                  </ul>
                                </div>

                                <div className="bg-white p-6 rounded-lg border border-slate-200">
                                  <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                                    Dos and Donts
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="font-semibold text-green-600 mb-2">
                                        Do:
                                      </h4>
                                      <ul className="space-y-2">
                                        <li className="flex items-start">
                                          <span className="text-green-600 mr-2">
                                            ✓
                                          </span>
                                          <span className="text-slate-700">
                                            Research the person and company
                                            thoroughly before reaching out
                                          </span>
                                        </li>
                                        <li className="flex items-start">
                                          <span className="text-green-600 mr-2">
                                            ✓
                                          </span>
                                          <span className="text-slate-700">
                                            Make a specific connection to the
                                            recipient's background
                                          </span>
                                        </li>
                                        <li className="flex items-start">
                                          <span className="text-green-600 mr-2">
                                            ✓
                                          </span>
                                          <span className="text-slate-700">
                                            Offer something of value when
                                            possible
                                          </span>
                                        </li>
                                        <li className="flex items-start">
                                          <span className="text-green-600 mr-2">
                                            ✓
                                          </span>
                                          <span className="text-slate-700">
                                            Proofread multiple times for grammar
                                            and spelling
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-red-600 mb-2">
                                        Do not:
                                      </h4>
                                      <ul className="space-y-2">
                                        <li className="flex items-start">
                                          <span className="text-red-600 mr-2">
                                            ✗
                                          </span>
                                          <span className="text-slate-700">
                                            Send generic messages that could
                                            apply to anyone
                                          </span>
                                        </li>
                                        <li className="flex items-start">
                                          <span className="text-red-600 mr-2">
                                            ✗
                                          </span>
                                          <span className="text-slate-700">
                                            Make unreasonable requests (like
                                            lengthy calls) in first contact
                                          </span>
                                        </li>
                                        <li className="flex items-start">
                                          <span className="text-red-600 mr-2">
                                            ✗
                                          </span>
                                          <span className="text-slate-700">
                                            Forget to follow up after initial
                                            contact
                                          </span>
                                        </li>
                                        <li className="flex items-start">
                                          <span className="text-red-600 mr-2">
                                            ✗
                                          </span>
                                          <span className="text-slate-700">
                                            Use overly casual language or slang
                                            in professional communication
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end space-x-3 mt-6">
                              <button
                                onClick={handleCopyToClipboard}
                                className="relative px-4 py-2 rounded-md text-sm font-medium text-[#1E3A8A] bg-[#1E3A8A]/10 hover:bg-[#B3E5FC] transition-colors flex items-center"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                  />
                                </svg>
                                Copy to Clipboard
                                {/* Popup notification */}
                                {copied && (
                                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg">
                                    Text copied!
                                  </span>
                                )}
                              </button>
                              <button
                                onClick={handleViewMessages}
                                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-[#1E3A8A] hover:bg-[#59B7F2] transition-colors"
                              >
                                View All Messages
                              </button>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>,
                  ]
                )}
              </div>

              {/* Guidance Module with Sidebar */}
              <div className="mt-12 w-full">
                <div className="bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col md:flex-row w-full">
                  {/* Sidebar */}
                  <div className="w-full md:w-64 bg-[#1E3A8A]/5 border-b md:border-b-0 md:border-r border-slate-200 p-4 flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                    {[
                      "Tips",
                      "Key Elements",
                      "Email Structure",
                      "Cover Letter Structure",
                      "Cover Letter Best Practices",
                      "Best Practices for Networking Outreach",
                      "Do's and Don'ts",
                    ].map((section, idx) => (
                      <button
                        key={section}
                        className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2 rounded-lg flex items-center transition-colors font-medium text-sm ${
                          activeGuidanceTab === idx
                            ? "bg-[#59B7F2] text-white"
                            : "text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
                        }`}
                        onClick={() => setActiveGuidanceTab(idx)}
                      >
                        {section}
                      </button>
                    ))}
                  </div>
                  {/* Main Content */}
                  <div className="flex-1 p-4 md:p-8">
                    {activeGuidanceTab === 0 && (
                      // Tips
                      <div>
                        <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                          Tips
                        </h2>
                        <ul className="space-y-3 text-slate-700">
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            Personalize your messages for each recipient
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            Keep LinkedIn messages concise and professional
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            Follow up within 1-2 weeks if no response
                          </li>
                        </ul>
                      </div>
                    )}
                    {activeGuidanceTab === 1 && (
                      // Key Elements
                      <div>
                        <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                          Key Elements
                        </h2>
                        <ul className="space-y-2 text-slate-700">
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              <strong className="text-[#1E3A8A]">
                                Personalization:
                              </strong>{" "}
                              Reference specific aspects of their profile
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              <strong className="text-[#1E3A8A]">
                                Brevity:
                              </strong>{" "}
                              Keep messages under 150 words
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              <strong className="text-[#1E3A8A]">
                                Clear request:
                              </strong>{" "}
                              Specific, reasonable ask (information, brief call)
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              <strong className="text-[#1E3A8A]">
                                Professional tone:
                              </strong>{" "}
                              Formal but conversational language
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}
                    {activeGuidanceTab === 2 && (
                      // Email Structure
                      <div>
                        <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                          Email Structure
                        </h2>
                        <ul className="space-y-2 text-slate-700">
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              <strong className="text-[#1E3A8A]">
                                Introduction:
                              </strong>{" "}
                              Who you are and purpose of email
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              <strong className="text-[#1E3A8A]">Body:</strong>{" "}
                              Your relevant experience and specific
                              qualifications
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              <strong className="text-[#1E3A8A]">
                                Value proposition:
                              </strong>{" "}
                              What you can offer to the company
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              <strong className="text-[#1E3A8A]">
                                Call to action:
                              </strong>{" "}
                              Request for conversation or next steps
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}
                    {activeGuidanceTab === 3 && (
                      // Cover Letter Structure
                      <div>
                        <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                          Cover Letter Structure
                        </h2>
                        <ul className="space-y-2 text-slate-700">
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              <strong className="text-[#1E3A8A]">
                                Opening paragraph:
                              </strong>{" "}
                              Specify the position you are applying for and
                              express your interest
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              <strong className="text-[#1E3A8A]">
                                Experience paragraphs:
                              </strong>{" "}
                              Highlight relevant experience with specific
                              examples and achievements
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              <strong className="text-[#1E3A8A]">
                                Education & skills:
                              </strong>{" "}
                              Summarize relevant education and transferable
                              skills
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              <strong className="text-[#1E3A8A]">
                                Closing paragraph:
                              </strong>{" "}
                              Express enthusiasm and include a call to action
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}
                    {activeGuidanceTab === 4 && (
                      // Cover Letter Best Practices
                      <div>
                        <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                          Cover Letter Best Practices
                        </h2>
                        <ul className="space-y-2 text-slate-700">
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              Keep cover letters concise – aim for one page
                              maximum
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              Address the letter to a specific person rather
                              than "To Whom It May Concern"
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              Quantify achievements with specific numbers and
                              percentages when possible
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              Tailor each cover letter to the specific company
                              and role
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}
                    {activeGuidanceTab === 5 && (
                      // Best Practices for Networking Outreach
                      <div>
                        <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                          Best Practices for Networking Outreach
                        </h2>
                        <p className="text-slate-700 mb-4">
                          Effective networking outreach can dramatically
                          increase your chances of landing interviews at top
                          finance firms. Follow these best practices to make
                          your messages stand out.
                        </p>
                        <ul className="space-y-2 text-slate-700">
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              Personalize each message with specific details
                              about the company and role
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              Keep LinkedIn messages concise and under 150 words
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              Follow up politely if you do not hear back within
                              1-2 weeks
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              Highlight relevant experience and skills that
                              match the position
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span>
                              Always include a clear call to action in your
                              message
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}
                    {activeGuidanceTab === 6 && (
                      // Do's and Don'ts
                      <div>
                        <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                          Do's and Don'ts
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-semibold text-green-600 mb-2">
                              Do:
                            </h3>
                            <ul className="space-y-2 text-slate-700">
                              <li className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>
                                  Research the person and company thoroughly
                                  before reaching out
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>
                                  Make a specific connection to the recipient's
                                  background
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>
                                  Offer something of value when possible
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>
                                  Proofread multiple times for grammar and
                                  spelling
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-semibold text-red-600 mb-2">
                              Do not:
                            </h3>
                            <ul className="space-y-2 text-slate-700">
                              <li className="flex items-start">
                                <span className="text-red-600 mr-2">✗</span>
                                <span>
                                  Send generic messages that could apply to
                                  anyone
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-red-600 mr-2">✗</span>
                                <span>
                                  Make unreasonable requests (like lengthy
                                  calls) in first contact
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-red-600 mr-2">✗</span>
                                <span>
                                  Forget to follow up after initial contact
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-red-600 mr-2">✗</span>
                                <span>
                                  Use overly casual language or slang in
                                  professional communication
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generator Modal */}
          <AnimatePresence>
            {showGenerator && (
              <NetworkingStrategyGenerator
                onClose={() => setShowGenerator(false)}
                onMessageGenerated={handleMessageGenerated}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Test 2
