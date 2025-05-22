"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { supabase } from "../../../../lib/supabase";
import { getUserWithDetails } from "../../../../lib/auth";
import { useRouter } from "next/navigation";

// Import the props type
import type { NetworkingStrategyGeneratorProps } from "../networking/NetworkingStrategyGenerator";

// Type the dynamic import
const NetworkingStrategyGenerator = dynamic<NetworkingStrategyGeneratorProps>(
  () => import("../networking/NetworkingStrategyGenerator"),
  { ssr: false }
);

interface NetworkingSectionProps {
  user: any;
}

export default function NetworkingSection({ user }: NetworkingSectionProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [contactDetails, setContactDetails] = useState<any>(null);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  const contacts = user?.contacts || [
    {
      id: 1,
      name: "Jane Smith",
      company: "Tech Innovations",
      position: "Senior Software Engineer",
      status: "connected",
      last_contact: "2023-07-15",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      email: "jane.smith@example.com",
      phone: "+1 (555) 123-4567",
      linkedin: "https://linkedin.com/in/janesmith",
      notes: "Met at ReactConf 2023. Interested in frontend opportunities.",
    },
    {
      id: 2,
      name: "David Johnson",
      company: "DataViz Corp",
      position: "Product Manager",
      status: "pending",
      last_contact: null,
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      email: "david.johnson@example.com",
      phone: "+1 (555) 987-6543",
      linkedin: "https://linkedin.com/in/davidjohnson",
      notes: "Connected on LinkedIn. Scheduled intro call for next week.",
    },
    {
      id: 3,
      name: "Sarah Chen",
      company: "AI Solutions",
      position: "Machine Learning Engineer",
      status: "follow_up",
      last_contact: "2023-06-28",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
      email: "sarah.chen@example.com",
      phone: "+1 (555) 456-7890",
      linkedin: "https://linkedin.com/in/sarahchen",
      notes:
        "Discussed potential collaboration on ML project. Need to follow up with proposal.",
    },
  ];

  const filteredContacts =
    filterStatus === "all"
      ? contacts
      : contacts.filter((contact: any) => contact.status === filterStatus);

  const viewContactDetails = (contact: any) => {
    setContactDetails(contact);
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-[#BBF7D0]";
      case "pending":
        return "bg-[#FEF08A]";
      case "follow_up":
        return "bg-[#BFDBFE]";
      default:
        return "bg-[#E2E8F0]";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-[#166534]";
      case "pending":
        return "text-[#854D0E]";
      case "follow_up":
        return "text-[#1E40AF]";
      default:
        return "text-[#334155]";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Connected";
      case "pending":
        return "Pending";
      case "follow_up":
        return "Follow Up";
      default:
        return "Unknown";
    }
  };

  const handleGenerateMessage = () => {
    setShowGenerator(true);
  };

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedMessage(null);
  };

  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case "cover_letter":
        return "Cover Letter";
      case "linkedin_message":
        return "LinkedIn Message";
      case "intro_email":
        return "Introduction Email";
      default:
        return type;
    }
  };

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

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-white/80 backdrop-blur-md shadow-md rounded-lg overflow-hidden border border-white/20"
      >
        <div className="px-6 py-5 border-b border-[#E6E8F0] flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-bold text-[#1E293B]">
            Professional Network
          </h1>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filterStatus === "all"
                  ? "bg-[#1E3A8A] text-white"
                  : "bg-[#F1F5F9] text-[#475569] hover:bg-[#59B7F2] hover:text-white"
              }`}
            >
              All Contacts
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus("connected")}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filterStatus === "connected"
                  ? "bg-[#BBF7D0] text-[#166534]"
                  : "bg-[#F1F5F9] text-[#475569] hover:bg-[#59B7F2] hover:text-white"
              }`}
            >
              Connected
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus("pending")}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filterStatus === "pending"
                  ? "bg-[#FEF08A] text-[#854D0E]"
                  : "bg-[#F1F5F9] text-[#475569] hover:bg-[#59B7F2] hover:text-white"
              }`}
            >
              Pending
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus("follow_up")}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filterStatus === "follow_up"
                  ? "bg-[#BFDBFE] text-[#1E40AF]"
                  : "bg-[#F1F5F9] text-[#475569] hover:bg-[#59B7F2] hover:text-white"
              }`}
            >
              Follow Up
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#1E293B]">
              {filteredContacts.length}{" "}
              {filterStatus === "all"
                ? "Contacts"
                : `${getStatusText(filterStatus)} Contacts`}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateMessage}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1E3A8A] hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A]/50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Generate Networking Message
            </motion.button>
          </div>

          {filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#475569]">No contacts found.</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredContacts.map((contact: any) => (
                <motion.div
                  key={contact.id}
                  variants={cardVariant}
                  className="bg-white border border-[#E6E8F0] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {contact.avatar ? (
                            <Image
                              className="h-10 w-10 rounded-full"
                              src={contact.avatar}
                              alt={contact.name}
                              width={40}
                              height={40}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-[#E0F7FA] flex items-center justify-center text-[#1E293B] font-medium">
                              {contact.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-[#1E293B]">
                            {contact.name}
                          </h3>
                          <p className="text-xs text-[#475569]">
                            {contact.position}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          contact.status
                        )} ${getStatusTextColor(contact.status)}`}
                      >
                        {getStatusText(contact.status)}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-[#475569]">
                        {contact.company}
                      </p>
                      {contact.last_contact && (
                        <p className="text-xs text-[#64748B] mt-1">
                          Last contact:{" "}
                          {new Date(contact.last_contact).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => viewContactDetails(contact)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-[#1E3A8A] bg-[#E0F7FA] hover:bg-[#59B7F2] hover:text-white transition-colors"
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Recent Messages Section - Would be fetched from a database in a real app */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-md shadow-md rounded-lg overflow-hidden border border-white/20 mt-8"
      >
        <div className="px-6 py-5 border-b border-[#E6E8F0]">
          <h2 className="text-xl font-bold text-[#1E293B]">
            Recent Networking Messages
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Sample message items */}
            <div className="border border-[#E6E8F0] rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-[#1E293B]">
                    LinkedIn Connection Request
                  </h3>
                  <p className="text-sm text-[#475569] mt-1">
                    Personalized message for Sarah Chen at AI Solutions
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E0F7FA] text-[#1E293B]">
                  LinkedIn Message
                </span>
              </div>
              <div className="mt-3 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    handleViewMessage({
                      title: "LinkedIn Connection Request",
                      type: "linkedin_message",
                      recipient: "Sarah Chen",
                      company: "AI Solutions",
                      content:
                        "Hi Sarah,\n\nI came across your profile and was impressed by your work in machine learning at AI Solutions. I'm currently developing my skills in ML and would love to connect and potentially learn from your experience.\n\nBest regards,\nDavid",
                    })
                  }
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-[#1E3A8A] bg-[#E0F7FA] hover:bg-[#59B7F2] hover:text-white transition-colors"
                >
                  View Message
                </motion.button>
              </div>
            </div>

            <div className="border border-[#E6E8F0] rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-[#1E293B]">
                    Software Engineer Application
                  </h3>
                  <p className="text-sm text-[#475569] mt-1">
                    Cover letter for Tech Innovations job opening
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#DCEFFB] text-[#1E293B]">
                  Cover Letter
                </span>
              </div>
              <div className="mt-3 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    handleViewMessage({
                      title: "Software Engineer Application",
                      type: "cover_letter",
                      recipient: "Hiring Manager",
                      company: "Tech Innovations",
                      content:
                        "Dear Hiring Manager,\n\nI am writing to express my interest in the Software Engineer position at Tech Innovations. With my background in full-stack development and passion for innovative technologies, I believe I would be a valuable addition to your team.\n\nThroughout my career, I have focused on building scalable web applications and implementing efficient APIs. My experience with React, Node.js, and cloud infrastructure aligns well with the technologies mentioned in your job description.\n\nI am particularly drawn to Tech Innovations' mission to revolutionize the way people interact with technology, and I am excited about the possibility of contributing to your projects.\n\nThank you for considering my application. I look forward to the opportunity to discuss how my skills and experiences align with your needs.\n\nSincerely,\nDavid Johnson",
                    })
                  }
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-[#1E3A8A] bg-[#E0F7FA] hover:bg-[#59B7F2] hover:text-white transition-colors"
                >
                  View Message
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Details Modal */}
      <AnimatePresence>
        {showContactModal && contactDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeContactModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-[#E6E8F0] flex justify-between items-center">
                <h3 className="text-xl font-medium text-[#1E293B]">
                  Contact Details
                </h3>
                <button
                  onClick={closeContactModal}
                  className="p-1 rounded-md hover:bg-[#E6E8F0] transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-[#64748B]"
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
              <div className="p-6">
                <div className="flex items-center mb-6">
                  {contactDetails.avatar ? (
                    <Image
                      className="h-16 w-16 rounded-full mr-4"
                      src={contactDetails.avatar}
                      alt={contactDetails.name}
                      width={64}
                      height={64}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-[#E0F7FA] flex items-center justify-center text-[#1E293B] text-xl font-medium mr-4">
                      {contactDetails.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-[#1E293B]">
                      {contactDetails.name}
                    </h2>
                    <p className="text-[#475569]">
                      {contactDetails.position} at {contactDetails.company}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                        contactDetails.status
                      )} ${getStatusTextColor(contactDetails.status)}`}
                    >
                      {getStatusText(contactDetails.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-[#475569] mb-1">
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-[#1E293B] flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-[#1E3A8A]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {contactDetails.email}
                      </p>
                      <p className="text-sm text-[#1E293B] flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-[#1E3A8A]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {contactDetails.phone}
                      </p>
                      <p className="text-sm text-[#1E293B] flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-[#1E3A8A]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        <a
                          href={contactDetails.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1E3A8A] hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </p>
                    </div>
                  </div>

                  {contactDetails.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-[#475569] mb-1">
                        Notes
                      </h3>
                      <p className="text-sm text-[#1E293B] bg-[#F8FAFC] p-3 rounded-md">
                        {contactDetails.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeContactModal}
                    className="px-4 py-2 border border-[#E6E8F0] rounded-md text-[#475569] hover:bg-[#F1F5F9] transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleGenerateMessage}
                    className="px-4 py-2 rounded-md text-white bg-[#1E3A8A] hover:brightness-105 transition-colors"
                  >
                    Generate Message
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-[#E6E8F0] flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-medium text-[#1E293B]">
                    {selectedMessage.title}
                  </h3>
                  <p className="text-sm text-[#475569]">
                    {getMessageTypeLabel(selectedMessage.type)} for{" "}
                    {selectedMessage.recipient} at {selectedMessage.company}
                  </p>
                </div>
                <button
                  onClick={closePreview}
                  className="p-1 rounded-md hover:bg-[#E6E8F0] transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-[#64748B]"
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
              <div className="p-6">
                <div className="bg-[#F8FAFC] border border-[#E6E8F0] rounded-lg p-4 mb-6 whitespace-pre-wrap">
                  {selectedMessage.content}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closePreview}
                    className="px-4 py-2 border border-[#E6E8F0] rounded-md text-[#475569] hover:bg-[#F1F5F9] transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 rounded-md text-white bg-[#1E3A8A] hover:brightness-105 transition-colors flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                      />
                    </svg>
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Networking Strategy Generator */}
      <AnimatePresence>
        {showGenerator && (
          <NetworkingStrategyGenerator
            onClose={() => setShowGenerator(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
