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
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "follow_up":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
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
        className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700"
      >
        <div className="px-6 py-5 border-b border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-bold">Professional Network</h1>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filterStatus === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Follow Up
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          {filteredContacts.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredContacts.map((contact: any) => (
                <motion.div
                  key={contact.id}
                  variants={cardVariant}
                  className="bg-gray-700 rounded-lg overflow-hidden shadow-md border border-gray-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-20 bg-gradient-to-r from-primary/30 to-primary-dark/30">
                    <div className="absolute -bottom-10 left-4">
                      <div className="h-20 w-20 rounded-full border-4 border-gray-700 overflow-hidden shadow-xl">
                        <Image
                          src={contact.avatar}
                          alt={contact.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          contact.status
                        )} text-white`}
                      >
                        {getStatusText(contact.status)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-12 px-4 pb-4">
                    <h3 className="font-medium text-lg">{contact.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {contact.position} at {contact.company}
                    </p>

                    {contact.last_contact && (
                      <p className="text-xs text-gray-500 mt-2">
                        Last contacted:{" "}
                        {new Date(contact.last_contact).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-750 px-4 py-3 flex justify-end space-x-2 border-t border-gray-600">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => viewContactDetails(contact)}
                      className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                      title="View Details"
                    >
                      <svg
                        className="w-5 h-5 text-gray-300"
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
                      className="p-2 bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
                      title="Send Message"
                    >
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                    </motion.button>
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-primary rounded-md hover:bg-primary-dark transition-colors"
                        title="View LinkedIn Profile"
                      >
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
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
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-white">
                No contacts found
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                No contacts match your current filter.
              </p>
              <div className="mt-6">
                <Link href="/networking">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
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
                    Add New Contact
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Contact Details Modal */}
      <AnimatePresence>
        {showContactModal && contactDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeContactModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-medium">Contact Details</h3>
                <button
                  onClick={closeContactModal}
                  className="p-1 rounded-md hover:bg-gray-700 transition-colors"
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

              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-16 w-16 rounded-full overflow-hidden">
                    <Image
                      src={contactDetails.avatar}
                      alt={contactDetails.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">
                      {contactDetails.name}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {contactDetails.position} at {contactDetails.company}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getStatusColor(
                        contactDetails.status
                      )} text-white`}
                    >
                      {getStatusText(contactDetails.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                    <a
                      href={`mailto:${contactDetails.email}`}
                      className="text-sm text-primary hover:underline truncate"
                    >
                      {contactDetails.email}
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <a
                      href={`tel:${contactDetails.phone}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {contactDetails.phone}
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <a
                      href={contactDetails.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline truncate"
                    >
                      {contactDetails.linkedin.replace(
                        "https://linkedin.com/in/",
                        ""
                      )}
                    </a>
                  </div>
                </div>

                {contactDetails.notes && (
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-300 mb-2">
                      Notes
                    </h5>
                    <p className="text-sm text-gray-400 bg-gray-750 p-3 rounded-md border border-gray-600">
                      {contactDetails.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeContactModal}
                  className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
                >
                  Schedule Follow-up
                </motion.button>
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-medium text-white">
                    {selectedMessage.company_name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {getMessageTypeLabel(selectedMessage.message_type)}
                  </p>
                </div>
                <button
                  onClick={closePreview}
                  className="p-1 rounded-md hover:bg-gray-700 transition-colors"
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
              <div className="p-6 overflow-auto max-h-[calc(90vh-8rem)]">
                <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                  <pre className="whitespace-pre-wrap font-sans text-gray-300">
                    {selectedMessage.generated_message}
                  </pre>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closePreview}
                  className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      selectedMessage.generated_message
                    );
                  }}
                  className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  Copy to Clipboard
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generator Modal */}
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
