"use client";

import React, { ReactNode, useState, useEffect } from "react";
import InterviewDashboardSidebar from "./InterviewDashboardSidebar";
import InterviewDashboardNavbar from "./InterviewDashboardNavbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      setSidebarOpen(window.innerWidth >= 1024);
    };

    // Set initial values
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-[#59B7F2]">
      {/* Sidebar */}
      <InterviewDashboardSidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div
        className={`
          flex-1 flex flex-col overflow-hidden transition-all duration-300
          ${sidebarOpen ? "md:pl-64" : "md:pl-20"}
          ${isMobile ? "pl-0" : ""}
        `}
      >
        {/* Navbar */}
        <InterviewDashboardNavbar toggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#59B7F2] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
