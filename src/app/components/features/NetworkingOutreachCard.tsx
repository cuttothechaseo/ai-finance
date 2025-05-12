"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type TabType = "input" | "linkedin" | "email" | "cover" | "examples";

interface NetworkingOutreachProps {
  isPreview?: boolean;
}

export default function NetworkingOutreachCard({
  isPreview = true,
}: NetworkingOutreachProps) {
  const [activeTab, setActiveTab] = useState<TabType>("input");
  const [selectedMessageType, setSelectedMessageType] =
    useState<string>("linkedin");

  // Sample data for the networking outreach examples
  const outreachData = {
    tips: [
      "Personalize each message with specific details about the company and role",
      "Keep LinkedIn messages concise and under 150 words",
      "Follow up politely if you do not hear back within 1-2 weeks",
      "Highlight relevant experience and skills that match the position",
      "Always include a clear call to action in your message",
    ],
    linkedinExample: {
      subject:
        "Connection Request - Investment Banking Opportunity at Morgan Stanley",
      message:
        "Hi Sarah,\n\nI noticed your role as an Associate at Morgan Stanley and was impressed by your background in Technology Investment Banking. I am currently an undergraduate student at Cornell University focusing on a similar path.\n\nI would love to connect and possibly have a brief conversation about your experience in technology investment banking at Morgan Stanley. I am particularly interested in how your team evaluates M&A opportunities in the current market.\n\nThank you for considering my connection request.\n\nBest regards,\nJohn Smith",
    },
    emailExample: {
      subject: "Interest in Technology Investment Banking at Morgan Stanley",
      message:
        "Dear Ms. Fields,\n\nI hope this email finds you well. My name is John Smith, and I am reaching out to express my strong interest in the Analyst position within the Technology Investment Banking team at Morgan Stanley. I am currently a junior at Cornell University majoring in Finance with a minor in Computer Science.\n\nLast summer, I completed an internship in the Technology Equity Capital Markets group at Credit Suisse, where I worked on several IPO and secondary offering transactions for software and fintech companies. During this experience, I developed skills in financial modeling, company valuation, and industry analysis. I contributed to pitch materials for client presentations and gained exposure to the execution process for public offerings.\n\nMy academic coursework in both finance and computer science has provided me with a strong foundation in understanding both the financial and technical aspects of technology companies. I am particularly drawn to Morgan Stanley's leadership in technology investment banking, having followed your firm's recent advisory roles in notable technology M&A transactions and IPOs.\n\nI am excited about the opportunity to bring my analytical skills, technical background, and passion for technology to Morgan Stanley's team. I would welcome the chance to discuss how my experiences align with the expectations for a Analyst role in your Technology Investment Banking group.\n\nPlease find my resume attached for your review. Thank you for your time and consideration.\n\nBest regards,\nJohn Smith",
    },
    coverLetterExample: {
      subject: "Cover Letter for Analyst Opportunity at Morgan Stanley",
      message:
        "Dear Ms. Fields,\n\nI am writing to express my strong interest in the Analyst position within the Technology Investment Banking team at Morgan Stanley. I am currently a junior at Cornell University majoring in Finance with a minor in Computer Science, and I am particularly drawn to Morgan Stanley's leadership in technology investment banking.\n\nLast summer, I completed an internship in the Technology Equity Capital Markets group at Credit Suisse, where I worked on several IPO and secondary offering transactions for software and fintech companies. During this experience, I developed skills in financial modeling, company valuation, and industry analysis. I contributed to pitch materials for client presentations and gained exposure to the execution process for public offerings.\n\nMy academic coursework in both finance and computer science has provided me with a strong foundation in understanding both the financial and technical aspects of technology companies. I have completed coursework in corporate finance, investment analysis, data structures, and algorithms, which I believe will allow me to contribute meaningfully to Morgan Stanley's technology banking team.\n\nI am particularly impressed by Morgan Stanley's recent advisory roles in notable technology M&A transactions and IPOs. Your firm's ability to navigate complex technology deals and maintain strong client relationships exemplifies the type of work environment where I would thrive and contribute.\n\nI am excited about the opportunity to bring my analytical skills, technical background, and passion for technology to Morgan Stanley's team. I would welcome the chance to discuss how my experiences align with the expectations for the Analyst role in your Technology Investment Banking group.\n\nPlease find my resume attached for your review. Thank you for your time and consideration, and I look forward to the possibility of contributing to Morgan Stanley's continued success in the technology sector.\n\nSincerely,\nJohn Smith",
    },
  };

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    // Prevent scrolling by maintaining current scroll position
    const currentScrollY = window.scrollY;
    setTimeout(() => {
      window.scrollTo(0, currentScrollY);
    }, 0);
  };

  // If preview mode is enabled, show the card only
  if (isPreview) {
    return (
      <div className="relative">
        <motion.div
          className="bg-white p-6 rounded-xl border border-white/10 shadow-sm cursor-pointer h-full"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-14 h-14 bg-[#1E3A8A]/10 rounded-lg flex items-center justify-center mb-6 text-[#1E3A8A]">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-[#1E3A8A]">
            Networking Outreach
          </h3>
          <p className="text-slate-700">
            Generate personalized networking messages for LinkedIn and email to
            connect with finance professionals.
          </p>
        </motion.div>
      </div>
    );
  }

  // Full outreach view
  return (
    <div className="bg-white rounded-xl shadow-xl w-full border border-slate-200">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar with tabs */}
        <div className="w-full md:w-64 bg-[#1E3A8A]/5 md:min-h-[600px] border-r border-slate-200">
          <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible p-4 space-x-2 md:space-x-0 md:space-y-1">
            <button
              className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                activeTab === "input"
                  ? "bg-[#59B7F2] text-white"
                  : "text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
              }`}
              onClick={() => handleTabClick("input")}
            >
              Input
            </button>
            <button
              className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                activeTab === "linkedin"
                  ? "bg-[#59B7F2] text-white"
                  : "text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
              }`}
              onClick={() => handleTabClick("linkedin")}
            >
              LinkedIn Message
            </button>
            <button
              className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                activeTab === "email"
                  ? "bg-[#59B7F2] text-white"
                  : "text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
              }`}
              onClick={() => handleTabClick("email")}
            >
              Introduction Email
            </button>
            <button
              className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                activeTab === "cover"
                  ? "bg-[#59B7F2] text-white"
                  : "text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
              }`}
              onClick={() => handleTabClick("cover")}
            >
              Cover Letter
            </button>
            <button
              className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                activeTab === "examples"
                  ? "bg-[#59B7F2] text-white"
                  : "text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
              }`}
              onClick={() => handleTabClick("examples")}
            >
              Best Practices
            </button>
          </nav>

          {/* Tips section - show on desktop only */}
          <div className="hidden md:block mt-8 pt-6 border-t border-slate-200 px-4">
            <h4 className="text-sm font-medium text-[#1E3A8A] mb-2">
              Networking Tips
            </h4>
            <ul className="space-y-1">
              {outreachData.tips.slice(0, 3).map((tip, index) => (
                <li
                  key={index}
                  className="text-sm text-slate-700 flex items-start"
                >
                  <span className="text-[#59B7F2] mr-2">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-4 md:p-6">
          {/* Tips section for mobile - show above main card */}
          <div className="block md:hidden mb-4">
            <h4 className="text-sm font-medium text-[#1E3A8A] mb-2">
              Networking Tips
            </h4>
            <ul className="space-y-1">
              {outreachData.tips.slice(0, 3).map((tip, index) => (
                <li
                  key={index}
                  className="text-sm text-slate-700 flex items-start"
                >
                  <span className="text-[#59B7F2] mr-2">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {activeTab === "input" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-6">
                  Generate Networking Message
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-black"
                      placeholder="Company name"
                      defaultValue="Morgan Stanley"
                      readOnly
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="targetRole"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Target Role
                    </label>
                    <input
                      type="text"
                      id="targetRole"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-black"
                      placeholder="Position or role"
                      defaultValue="Analyst"
                      readOnly
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contactName"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Contact Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-black"
                      placeholder="Contact person's name"
                      defaultValue="Sarah Fields"
                      readOnly
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contactRole"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Contact Role (Optional)
                    </label>
                    <input
                      type="text"
                      id="contactRole"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-black"
                      placeholder="Contact's role or position"
                      defaultValue="Associate"
                      readOnly
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="resume"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Resume
                    </label>
                    <div className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 flex items-center">
                      <svg
                        className="w-5 h-5 text-slate-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-slate-700">
                        John Smith Resume - April 2025.pdf
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="messageType"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Message Type
                    </label>
                    <select
                      id="messageType"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-black"
                      value={selectedMessageType}
                      onChange={(e) => setSelectedMessageType(e.target.value)}
                    >
                      <option value="linkedin">LinkedIn Message</option>
                      <option value="email">Intro Email</option>
                      <option value="cover">Cover Letter</option>
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      className="bg-[#1E3A8A] text-white px-4 py-2 rounded-md hover:bg-[#1E3A8A]/90 transition-colors"
                      onClick={() => {
                        // Map the selected message type to the corresponding tab
                        const tabMapping: Record<string, TabType> = {
                          linkedin: "linkedin",
                          email: "email",
                          cover: "cover",
                        };

                        // Switch to the appropriate tab
                        if (tabMapping[selectedMessageType]) {
                          handleTabClick(tabMapping[selectedMessageType]);
                        }
                      }}
                    >
                      Generate Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "linkedin" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  LinkedIn Message Generation
                </h3>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Subject:</p>
                  <div className="bg-[#1E3A8A]/5 p-3 rounded text-[#1E293B] mb-4">
                    {outreachData.linkedinExample.subject}
                  </div>

                  <p className="text-sm text-slate-600 mb-2">Message:</p>
                  <div className="relative">
                    <div className="bg-[#F8FAFC] border border-[#E6E8F0] rounded-md p-5 whitespace-pre-wrap filter blur-sm select-none pointer-events-none">
                      <p className="text-[#1E293B]">
                        {outreachData.linkedinExample.message}
                      </p>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-md">
                      <svg
                        className="w-8 h-8 text-[#1E3A8A] mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 17a2 2 0 002-2v-2a2 2 0 10-4 0v2a2 2 0 002 2zm6-2v-2a6 6 0 10-12 0v2a2 2 0 00-2 2v3a2 2 0 002 2h12a2 2 0 002-2v-3a2 2 0 00-2-2z"
                        />
                      </svg>
                      <button
                        className="bg-[#1E3A8A] text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-[#1E3A8A]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#59B7F2] mt-1"
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("join-waitlist");
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                      >
                        Unlock with Pro
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Key Elements
                </h3>
                <div className="filter blur-sm select-none pointer-events-none">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        <strong className="text-[#1E3A8A]">
                          Personalization:
                        </strong>{" "}
                        Reference specific aspects of their profile
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        <strong className="text-[#1E3A8A]">Brevity:</strong>{" "}
                        Keep messages under 150 words
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        <strong className="text-[#1E3A8A]">
                          Clear request:
                        </strong>{" "}
                        Specific, reasonable ask (information, brief call)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        <strong className="text-[#1E3A8A]">
                          Professional tone:
                        </strong>{" "}
                        Formal but conversational language
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Introduction Email Generation
                </h3>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Subject:</p>
                  <div className="bg-[#1E3A8A]/5 p-3 rounded text-[#1E293B] mb-4">
                    {outreachData.emailExample.subject}
                  </div>

                  <p className="text-sm text-slate-600 mb-2">Email Body:</p>
                  <div className="relative">
                    <div className="bg-[#F8FAFC] border border-[#E6E8F0] rounded-md p-5 whitespace-pre-wrap filter blur-sm select-none pointer-events-none">
                      <p className="text-[#1E293B]">
                        {outreachData.emailExample.message}
                      </p>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-md">
                      <svg
                        className="w-8 h-8 text-[#1E3A8A] mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 17a2 2 0 002-2v-2a2 2 0 10-4 0v2a2 2 0 002 2zm6-2v-2a6 6 0 10-12 0v2a2 2 0 00-2 2v3a2 2 0 002 2h12a2 2 0 002-2v-3a2 2 0 00-2-2z"
                        />
                      </svg>
                      <button
                        className="bg-[#1E3A8A] text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-[#1E3A8A]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#59B7F2] mt-1"
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("join-waitlist");
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                      >
                        Unlock with Pro
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Email Structure
                </h3>
                <div className="filter blur-sm select-none pointer-events-none">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        <strong className="text-[#1E3A8A]">
                          Introduction:
                        </strong>{" "}
                        Who you are and purpose of email
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        <strong className="text-[#1E3A8A]">Body:</strong> Your
                        relevant experience and specific qualifications
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        <strong className="text-[#1E3A8A]">
                          Value proposition:
                        </strong>{" "}
                        What you can offer to the company
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        <strong className="text-[#1E3A8A]">
                          Call to action:
                        </strong>{" "}
                        Request for conversation or next steps
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cover" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Cover Letter Generation
                </h3>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Subject:</p>
                  <div className="bg-[#1E3A8A]/5 p-3 rounded text-[#1E293B] mb-4">
                    {outreachData.coverLetterExample.subject}
                  </div>

                  <p className="text-sm text-slate-600 mb-2">Cover Letter:</p>
                  <div className="relative">
                    <div className="bg-[#F8FAFC] border border-[#E6E8F0] rounded-md p-5 whitespace-pre-wrap filter blur-sm select-none pointer-events-none">
                      <p className="text-[#1E293B]">
                        {outreachData.coverLetterExample.message}
                      </p>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-md">
                      <svg
                        className="w-8 h-8 text-[#1E3A8A] mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 17a2 2 0 002-2v-2a2 2 0 10-4 0v2a2 2 0 002 2zm6-2v-2a6 6 0 10-12 0v2a2 2 0 00-2 2v3a2 2 0 002 2h12a2 2 0 002-2v-3a2 2 0 00-2-2z"
                        />
                      </svg>
                      <button
                        className="bg-[#1E3A8A] text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-[#1E3A8A]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#59B7F2] mt-1"
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("join-waitlist");
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                      >
                        Unlock with Pro
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Cover Letter Structure
                </h3>
                <div className="filter blur-sm select-none pointer-events-none">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        <strong className="text-[#1E3A8A]">
                          Opening paragraph:
                        </strong>{" "}
                        Specify the position you are applying for and express
                        your interest
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        <strong className="text-[#1E3A8A]">
                          Experience paragraphs:
                        </strong>{" "}
                        Highlight relevant experience with specific examples and
                        achievements
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        <strong className="text-[#1E3A8A]">
                          Education & skills:
                        </strong>{" "}
                        Summarize relevant education and transferable skills
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        <strong className="text-[#1E3A8A]">
                          Closing paragraph:
                        </strong>{" "}
                        Express enthusiasm and include a call to action
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Cover Letter Best Practices
                </h3>
                <div className="filter blur-sm select-none pointer-events-none">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        Keep cover letters concise – aim for one page maximum
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        Address the letter to a specific person rather than
                        &quot;To Whom It May Concern&quot;
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        Quantify achievements with specific numbers and
                        percentages when possible
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">
                        Tailor each cover letter to the specific company and
                        role
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "examples" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Best Practices for Networking Outreach
                </h3>
                <p className="text-slate-700 mb-4">
                  Effective networking outreach can dramatically increase your
                  chances of landing interviews at top finance firms. Follow
                  these best practices to make your messages stand out.
                </p>
                <div className="filter blur-sm select-none pointer-events-none">
                  <ul className="space-y-2">
                    {outreachData.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#59B7F2] mr-2">•</span>
                        <span className="text-slate-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Do's and Don'ts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Do:</h4>
                    <div className="filter blur-sm select-none pointer-events-none">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span className="text-slate-700">
                            Research the person and company thoroughly before
                            reaching out
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
                            Proofread multiple times for grammar and spelling
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Do not:</h4>
                    <div className="filter blur-sm select-none pointer-events-none">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✗</span>
                          <span className="text-slate-700">
                            Send generic messages that could apply to anyone
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✗</span>
                          <span className="text-slate-700">
                            Make unreasonable requests (like lengthy calls) in
                            first contact
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
          )}
        </div>
      </div>
    </div>
  );
}
