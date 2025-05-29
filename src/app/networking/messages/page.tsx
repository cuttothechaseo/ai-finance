"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getUserWithDetails } from "../../../../lib/auth";
import Sidebar from "@/app/components/dashboard/Sidebar";
import InterviewDashboardNavbar from "@/app/interview-dashboard/components/InterviewDashboardNavbar";

// Types for networking messages
interface NetworkingMessage {
  id: string;
  user_id: string;
  company_name: string;
  role: string;
  contact_name: string | null;
  contact_role: string | null;
  message_type: string;
  generated_message: string;
  created_at: string;
  updated_at: string;
  status?: string; // For tracking connection status (pending, connected, etc.)
}

// Message View Component
const MessageView = ({
  message,
  onClose,
}: {
  message: NetworkingMessage;
  onClose: () => void;
}) => {
  // Function to get a readable message type label
  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case "cover_letter":
        return "Cover Letter";
      case "linkedin_message":
        return "LinkedIn Message";
      case "intro_email":
        return "Introduction Email";
      default:
        return type.replace("_", " ");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#E6E8F0] flex justify-between items-center">
          <div>
            <h3 className="text-xl font-medium text-[#1E293B]">
              {getMessageTypeLabel(message.message_type)}
            </h3>
            <p className="text-sm text-[#475569]">
              For {message.role} at {message.company_name}
              {message.contact_name && ` (Recipient: ${message.contact_name})`}
            </p>
          </div>
          <button
            onClick={onClose}
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-9rem)]">
          <div className="bg-[#F8FAFC] border border-[#E6E8F0] rounded-md p-5 whitespace-pre-wrap">
            <p className="text-[#1E293B] !important">
              {message.generated_message}
            </p>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-[#64748B]">
              Generated on {new Date(message.created_at).toLocaleDateString()}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(message.generated_message)
                }
                className="px-4 py-2 bg-[#1E3A8A]/10 text-[#1E3A8A] text-sm font-medium rounded-md hover:bg-[#1E3A8A]/20 transition-colors"
              >
                Copy to Clipboard
              </button>
              <a
                href={
                  message.message_type === "linkedin_message"
                    ? "https://www.linkedin.com/messaging"
                    : `mailto:${
                        message.contact_name ? message.contact_name : ""
                      }`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#1E3A8A] text-white text-sm font-medium rounded-md hover:bg-[#59B7F2] transition-colors"
              >
                {message.message_type === "linkedin_message"
                  ? "Open LinkedIn"
                  : "Open Email"}
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function NetworkingMessagesPage() {
  const [messages, setMessages] = useState<NetworkingMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] =
    useState<NetworkingMessage | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  // Fetch networking messages for the current user
  useEffect(() => {
    async function fetchMessages() {
      try {
        // Check auth first
        await getUserWithDetails();

        // Fetch messages
        const { data, error } = await supabase
          .from("networking_messages")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setMessages(data || []);
      } catch (err) {
        console.error("Error fetching networking messages:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load messages");
        }
        // Redirect to login if unauthorized
        if (err instanceof Error && err.message.includes("not authenticated")) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [router]);

  const handleViewMessage = (message: NetworkingMessage) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setSelectedMessage(null);
  };

  // Filter messages by type
  const filteredMessages =
    filterType === "all"
      ? messages
      : messages.filter((msg) => msg.message_type === filterType);

  // Get unique message types for filter
  const messageTypes = [
    "all",
    ...Array.from(new Set(messages.map((msg) => msg.message_type))),
  ];

  // Animations
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

  const itemFade = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to get a readable message type label
  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case "cover_letter":
        return "Cover Letter";
      case "linkedin_message":
        return "LinkedIn Message";
      case "intro_email":
        return "Introduction Email";
      default:
        return type.replace("_", " ");
    }
  };

  // Function to get badge color for message type
  const getMessageTypeBadgeClass = (type: string) => {
    switch (type) {
      case "cover_letter":
        return "bg-[#FEF9C3] text-[#854D0E]"; // Yellow
      case "linkedin_message":
        return "bg-[#DBEAFE] text-[#1E40AF]"; // Blue
      case "intro_email":
        return "bg-[#D1FAE5] text-[#065F46]"; // Green
      default:
        return "bg-[#E2E8F0] text-[#334155]"; // Slate
    }
  };

  // Add handleDelete function
  const handleDelete = async (messageId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this message? This action cannot be undone."
      )
    )
      return;
    try {
      const { error } = await supabase
        .from("networking_messages")
        .delete()
        .eq("id", messageId);
      if (error) throw error;
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) {
      alert("Failed to delete message. Please try again.");
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#59B7F2]">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        } ${isMobile ? "pl-0" : ""}`}
      >
        <InterviewDashboardNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-[#59B7F2] p-6">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white/80 backdrop-blur-md shadow-md rounded-lg overflow-hidden border border-white/20 mb-8"
            >
              <div className="px-6 py-5 border-b border-[#E6E8F0]">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#1E3A8A]">
                    Your Networking Message History
                  </h2>
                  <Link
                    href="/networking"
                    className="px-4 py-2 bg-[#1E3A8A] text-white text-sm font-medium rounded-lg hover:bg-[#59B7F2] transition-colors duration-200"
                  >
                    Generate New Message
                  </Link>
                </div>
              </div>

              {/* Filter bar */}
              <div className="bg-[#F8FAFC] px-6 py-3 border-b border-[#E6E8F0]">
                <div className="flex items-center space-x-2 overflow-x-auto">
                  <span className="text-sm text-[#64748B] whitespace-nowrap">
                    Filter by type:
                  </span>
                  {messageTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                        filterType === type
                          ? "bg-[#1E3A8A] text-white"
                          : "bg-white text-[#64748B] hover:bg-[#E2E8F0] border border-[#E6E8F0]"
                      }`}
                    >
                      {type === "all"
                        ? "All Messages"
                        : getMessageTypeLabel(type)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#59B7F2]"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
                    {error}
                  </div>
                ) : filteredMessages.length > 0 ? (
                  <motion.div
                    variants={staggerItems}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {filteredMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        variants={itemFade}
                        className="bg-white rounded-lg border border-[#E6E8F0] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
                        onClick={() => handleViewMessage(message)}
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-medium text-lg text-[#1E3A8A] truncate">
                                {message.role} at {message.company_name}
                              </h3>
                              <p className="text-sm text-[#64748B]">
                                Generated on {formatDate(message.created_at)}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMessageTypeBadgeClass(
                                  message.message_type
                                )}`}
                              >
                                {getMessageTypeLabel(message.message_type)}
                              </span>
                              <button
                                title="Delete Message"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(message.id);
                                }}
                                className="mt-2 text-red-500 hover:text-red-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 7.5V19a2 2 0 002 2h8a2 2 0 002-2V7.5M4 7.5h16M10 11v6M14 11v6M9 7.5V5a2 2 0 012-2h2a2 2 0 012 2v2.5"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 text-sm text-[#475569] line-clamp-3">
                            {message.generated_message.substring(0, 150)}...
                          </div>

                          {message.contact_name && (
                            <div className="mt-3 flex items-center">
                              <span className="text-xs font-medium text-[#64748B] mr-1">
                                Recipient:
                              </span>
                              <span className="text-sm text-[#1E293B]">
                                {message.contact_name}
                                {message.contact_role &&
                                  ` (${message.contact_role})`}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="bg-[#F8FAFC] px-5 py-3 border-t border-[#E6E8F0] text-sm text-[#59B7F2] font-medium">
                          View full message
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-16 w-16 text-[#94A3B8]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-[#1E293B]">
                      No messages yet
                    </h3>
                    <p className="mt-1 text-[#475569]">
                      Generate personalized networking messages for your job
                      search.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/networking"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1E3A8A] hover:bg-[#59B7F2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A]"
                      >
                        Generate Message
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Message Modal */}
          <AnimatePresence>
            {showMessageModal && selectedMessage && (
              <MessageView
                message={selectedMessage}
                onClose={closeMessageModal}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
