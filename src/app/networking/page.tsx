"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabase";
import { getUserWithDetails } from "../../lib/auth";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
    <div className="min-h-screen bg-[#59B7F2] flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Networking Strategies
          </h1>
          <Link
            href="/dashboard"
            className="text-[#B3E5FC] hover:text-white transition-colors duration-200"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* White line divider */}
        <div className="h-px bg-white/30 w-full mb-8 rounded-full"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                Quick Actions
              </h2>
              <div className="space-y-4">
                {hasGeneratedMessage ? (
                  <>
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
                  </>
                ) : (
                  <button
                    onClick={() => setShowGenerator(true)}
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Generate New Message
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
              <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">Tips</h2>
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
          </div>

          {/* Right Column - Message Display */}
          <div className="lg:col-span-2">
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
                        <p className="text-sm text-slate-600 mb-2">Subject:</p>
                        <div className="bg-[#1E3A8A]/5 p-3 rounded text-[#1E293B]">
                          {messageInfo.type === "LinkedIn Message"
                            ? "Connection Request - Investment Banking Opportunity at " +
                              messageInfo.company
                            : messageInfo.type === "Introduction Email"
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
                          <p className="text-[#1E293B]">{generatedMessage}</p>
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

                      {/* Email Structure */}
                      <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
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

                      {/* Cover Letter Structure */}
                      <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
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

                      {/* Cover Letter Best Practices */}
                      <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
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
                              than &quot;To Whom It May Concern&quot;
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

                      {/* Best Practices for Networking Outreach */}
                      <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
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
                    </div>
                  )}

                  {activeTab === "bestPractices" && (
                    <div className="space-y-6 mb-6">
                      <div className="bg-white p-6 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                          Best Practices for Networking Outreach
                        </h3>
                        <p className="text-slate-700 mb-4">
                          Effective networking outreach can dramatically
                          increase your chances of landing interviews at top
                          finance firms. Follow these best practices to make
                          your messages stand out.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span className="text-slate-700">
                              Personalize each message with specific details
                              about the company and role
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span className="text-slate-700">
                              Keep LinkedIn messages concise and under 150 words
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span className="text-slate-700">
                              Follow up politely if you do not hear back within
                              1-2 weeks
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span className="text-slate-700">
                              Highlight relevant experience and skills that
                              match the position
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#59B7F2] mr-2">•</span>
                            <span className="text-slate-700">
                              Always include a clear call to action in your
                              message
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
                                <span className="text-green-600 mr-2">✓</span>
                                <span className="text-slate-700">
                                  Research the person and company thoroughly
                                  before reaching out
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span className="text-slate-700">
                                  Make a specific connection to the recipient's
                                  background
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span className="text-slate-700">
                                  Offer something of value when possible
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span className="text-slate-700">
                                  Proofread multiple times for grammar and
                                  spelling
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
                                <span className="text-red-600 mr-2">✗</span>
                                <span className="text-slate-700">
                                  Send generic messages that could apply to
                                  anyone
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-red-600 mr-2">✗</span>
                                <span className="text-slate-700">
                                  Make unreasonable requests (like lengthy
                                  calls) in first contact
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-red-600 mr-2">✗</span>
                                <span className="text-slate-700">
                                  Forget to follow up after initial contact
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-red-600 mr-2">✗</span>
                                <span className="text-slate-700">
                                  Use overly casual language or slang in
                                  professional communication
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
              ) : (
                <>
                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-6">
                    Recent Messages
                  </h2>
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4-4-4z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-[#1E3A8A]">
                      No messages yet
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Get started by generating your first message
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowGenerator(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#59B7F2] focus:outline-none focus:ring-2 focus:ring-[#B3E5FC] transition-all duration-200"
                      >
                        <svg
                          className="-ml-1 mr-2 h-5 w-5 text-current"
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
                        Generate Message
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Guidance Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Key Elements */}
          <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
            <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
              Key Elements
            </h2>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  <strong className="text-[#1E3A8A]">Personalization:</strong>{" "}
                  Reference specific aspects of their profile
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  <strong className="text-[#1E3A8A]">Brevity:</strong> Keep
                  messages under 150 words
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  <strong className="text-[#1E3A8A]">Clear request:</strong>{" "}
                  Specific, reasonable ask (information, brief call)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  <strong className="text-[#1E3A8A]">Professional tone:</strong>{" "}
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
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  <strong className="text-[#1E3A8A]">Introduction:</strong> Who
                  you are and purpose of email
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  <strong className="text-[#1E3A8A]">Body:</strong> Your
                  relevant experience and specific qualifications
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  <strong className="text-[#1E3A8A]">Value proposition:</strong>{" "}
                  What you can offer to the company
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  <strong className="text-[#1E3A8A]">Call to action:</strong>{" "}
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
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  <strong className="text-[#1E3A8A]">Opening paragraph:</strong>{" "}
                  Specify the position you are applying for and express your
                  interest
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  <strong className="text-[#1E3A8A]">
                    Experience paragraphs:
                  </strong>{" "}
                  Highlight relevant experience with specific examples and
                  achievements
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  <strong className="text-[#1E3A8A]">
                    Education & skills:
                  </strong>{" "}
                  Summarize relevant education and transferable skills
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  <strong className="text-[#1E3A8A]">Closing paragraph:</strong>{" "}
                  Express enthusiasm and include a call to action
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
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  Keep cover letters concise – aim for one page maximum
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  Address the letter to a specific person rather than &quot;To
                  Whom It May Concern&quot;
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  Quantify achievements with specific numbers and percentages
                  when possible
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  Tailor each cover letter to the specific company and role
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
              Effective networking outreach can dramatically increase your
              chances of landing interviews at top finance firms. Follow these
              best practices to make your messages stand out.
            </p>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  Personalize each message with specific details about the
                  company and role
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>Keep LinkedIn messages concise and under 150 words</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  Follow up politely if you do not hear back within 1-2 weeks
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  Highlight relevant experience and skills that match the
                  position
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#59B7F2] mr-2">•</span>
                <span>
                  Always include a clear call to action in your message
                </span>
              </li>
            </ul>
          </div>

          {/* Dos and Donts */}
          <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
            <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
              Do's and Don'ts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-600 mb-2">Do:</h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>
                      Research the person and company thoroughly before reaching
                      out
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>
                      Make a specific connection to the recipient's background
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Offer something of value when possible</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>
                      Proofread multiple times for grammar and spelling
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-600 mb-2">Do not:</h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>
                      Send generic messages that could apply to anyone
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>
                      Make unreasonable requests (like lengthy calls) in first
                      contact
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Forget to follow up after initial contact</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>
                      Use overly casual language or slang in professional
                      communication
                    </span>
                  </li>
                </ul>
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
    </div>
  );
}
