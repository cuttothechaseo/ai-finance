"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type TabType = "linkedin" | "email" | "cover" | "examples";

interface NetworkingOutreachProps {
  isPreview?: boolean;
}

export default function NetworkingOutreachCard({
  isPreview = true,
}: NetworkingOutreachProps) {
  const [activeTab, setActiveTab] = useState<TabType>("linkedin");

  // Sample data for the networking outreach examples
  const outreachData = {
    tips: [
      "Personalize each message with specific details about the company and role",
      "Keep LinkedIn messages concise and under 150 words",
      "Follow up politely if you don&apos;t hear back within 1-2 weeks",
      "Highlight relevant experience and skills that match the position",
      "Always include a clear call to action in your message",
    ],
    linkedinExample: {
      subject:
        "Connection Request - Investment Banking Opportunity at Morgan Stanley",
      message:
        "Hi Sarah,\n\nI noticed your role as an Associate at Morgan Stanley and was impressed by your background in Technology Investment Banking. I&apos;m currently an undergraduate student at Cornell University focusing on a similar path.\n\nI&apos;d love to connect and possibly have a brief conversation about your experience in technology investment banking at Morgan Stanley. I&apos;m particularly interested in how your team evaluates M&A opportunities in the current market.\n\nThank you for considering my connection request.\n\nBest regards,\nJohn Smith",
    },
    emailExample: {
      subject: "Interest in Technology Investment Banking at Morgan Stanley",
      message:
        "Dear Ms. Fields,\n\nI hope this email finds you well. My name is John Smith, and I am reaching out to express my strong interest in the Summer Analyst position within the Technology Investment Banking team at Morgan Stanley. I am currently a junior at Cornell University majoring in Finance with a minor in Computer Science.\n\nLast summer, I completed an internship in the Technology Equity Capital Markets group at Credit Suisse, where I worked on several IPO and secondary offering transactions for software and fintech companies. During this experience, I developed skills in financial modeling, company valuation, and industry analysis. I contributed to pitch materials for client presentations and gained exposure to the execution process for public offerings.\n\nMy academic coursework in both finance and computer science has provided me with a strong foundation in understanding both the financial and technical aspects of technology companies. I am particularly drawn to Morgan Stanley&apos;s leadership in technology investment banking, having followed your firm&apos;s recent advisory roles in notable technology M&A transactions and IPOs.\n\nI am excited about the opportunity to bring my analytical skills, technical background, and passion for technology to Morgan Stanley&apos;s team. I would welcome the chance to discuss how my experiences align with the expectations for a Summer Analyst role in your Technology Investment Banking group.\n\nPlease find my resume attached for your review. Thank you for your time and consideration.\n\nBest regards,\nJohn Smith",
    },
    coverLetterExample: {
      subject: "Cover Letter for Analyst Opportunity at Morgan Stanley",
      message:
        "Dear Ms. Fields,\n\nI am writing to express my strong interest in the Summer Analyst position within the Technology Investment Banking team at Morgan Stanley. I am currently a junior at Cornell University majoring in Finance with a minor in Computer Science, and I am particularly drawn to Morgan Stanley&apos;s leadership in technology investment banking.\n\nLast summer, I completed an internship in the Technology Equity Capital Markets group at Credit Suisse, where I worked on several IPO and secondary offering transactions for software and fintech companies. During this experience, I developed skills in financial modeling, company valuation, and industry analysis. I contributed to pitch materials for client presentations and gained exposure to the execution process for public offerings.\n\nMy academic coursework in both finance and computer science has provided me with a strong foundation in understanding both the financial and technical aspects of technology companies. I have completed coursework in corporate finance, investment analysis, data structures, and algorithms, which I believe will allow me to contribute meaningfully to Morgan Stanley&apos;s technology banking team.\n\nI am particularly impressed by Morgan Stanley&apos;s recent advisory roles in notable technology M&A transactions and IPOs. Your firm&apos;s ability to navigate complex technology deals and maintain strong client relationships exemplifies the type of work environment where I would thrive and contribute.\n\nI am excited about the opportunity to bring my analytical skills, technical background, and passion for technology to Morgan Stanley&apos;s team. I would welcome the chance to discuss how my experiences align with the expectations for the Summer Analyst role in your Technology Investment Banking group.\n\nPlease find my resume attached for your review. Thank you for your time and consideration, and I look forward to the possibility of contributing to Morgan Stanley&apos;s continued success in the technology sector.\n\nSincerely,\nJohn Smith",
    },
  };

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
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
    <div className="bg-white rounded-xl shadow-xl w-full overflow-hidden border border-slate-200">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar with tabs */}
        <div className="w-full md:w-64 bg-[#1E3A8A]/5 md:min-h-[600px] border-r border-slate-200">
          <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible p-4 space-y-1">
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

          {/* Tips section */}
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
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === "linkedin" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  LinkedIn Message Example
                </h3>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Subject:</p>
                  <div className="bg-[#1E3A8A]/5 p-3 rounded text-[#1E293B] mb-4">
                    {outreachData.linkedinExample.subject}
                  </div>

                  <p className="text-sm text-slate-600 mb-2">Message:</p>
                  <div className="bg-[#F8FAFC] border border-[#E6E8F0] rounded-md p-5 whitespace-pre-wrap">
                    <p className="text-[#1E293B]">
                      {outreachData.linkedinExample.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Key Elements
                </h3>
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
                      <strong className="text-[#1E3A8A]">Brevity:</strong> Keep
                      messages under 150 words
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      <strong className="text-[#1E3A8A]">Clear request:</strong>{" "}
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
          )}

          {activeTab === "email" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Introduction Email Example
                </h3>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Subject:</p>
                  <div className="bg-[#1E3A8A]/5 p-3 rounded text-[#1E293B] mb-4">
                    {outreachData.emailExample.subject}
                  </div>

                  <p className="text-sm text-slate-600 mb-2">Email Body:</p>
                  <div className="bg-[#F8FAFC] border border-[#E6E8F0] rounded-md p-5 whitespace-pre-wrap">
                    <p className="text-[#1E293B]">
                      {outreachData.emailExample.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Email Structure
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      <strong className="text-[#1E3A8A]">Introduction:</strong>{" "}
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
          )}

          {activeTab === "cover" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Cover Letter Example
                </h3>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Subject:</p>
                  <div className="bg-[#1E3A8A]/5 p-3 rounded text-[#1E293B] mb-4">
                    {outreachData.coverLetterExample.subject}
                  </div>

                  <p className="text-sm text-slate-600 mb-2">Cover Letter:</p>
                  <div className="bg-[#F8FAFC] border border-[#E6E8F0] rounded-md p-5 whitespace-pre-wrap">
                    <p className="text-[#1E293B]">
                      {outreachData.coverLetterExample.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Cover Letter Structure
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#59B7F2] mr-2">•</span>
                    <span className="text-slate-700">
                      <strong className="text-[#1E3A8A]">
                        Opening paragraph:
                      </strong>{" "}
                      Specify the position you&apos;re applying for and express
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

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Cover Letter Best Practices
                </h3>
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
                      Tailor each cover letter to the specific company and role
                    </span>
                  </li>
                </ul>
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
                <ul className="space-y-2">
                  {outreachData.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#59B7F2] mr-2">•</span>
                      <span className="text-slate-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
                  Do&apos;s and Don&apos;ts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Do:</h4>
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
                          Make a specific connection to the recipient&apos;s
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
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">
                      Don&apos;t:
                    </h4>
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
          )}
        </div>
      </div>
    </div>
  );
}
