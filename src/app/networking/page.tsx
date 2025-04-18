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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
                Quick Actions
              </h2>
              <div className="space-y-4">
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

          {/* Right Column - Message History */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl border border-white/10 shadow-sm">
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
            </div>
          </div>
        </div>
      </div>

      {/* Generator Modal */}
      <AnimatePresence>
        {showGenerator && (
          <NetworkingStrategyGenerator
            onClose={() => setShowGenerator(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
