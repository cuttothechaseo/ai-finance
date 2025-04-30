"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface SidebarProps {
  isMobile?: boolean;
  toggleSidebar?: () => void;
  isOpen?: boolean;
}

interface NavItem {
  name: string;
  path: string;
  icon?: (isActive: boolean) => JSX.Element;
  subItems?: {
    name: string;
    path: string;
  }[];
}

export default function InterviewDashboardSidebar({
  isMobile = false,
  toggleSidebar = () => {},
  isOpen = true,
}: SidebarProps) {
  const pathname = usePathname() || "";
  const [mounted, setMounted] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (isActive: boolean) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`w-5 h-5 ${
            isActive ? "text-[#59B7F2]" : "text-[#1E3A8A]/70"
          }`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      name: "Resume Analysis",
      path: "/resume",
      icon: (isActive: boolean) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`w-5 h-5 ${
            isActive ? "text-[#59B7F2]" : "text-[#1E3A8A]/70"
          }`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
    },
    {
      name: "Networking",
      path: "/networking",
      icon: (isActive: boolean) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`w-5 h-5 ${
            isActive ? "text-[#59B7F2]" : "text-[#1E3A8A]/70"
          }`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      name: "Mock Interviews",
      path: "/interview-dashboard",
      icon: (isActive: boolean) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`w-5 h-5 ${
            isActive ? "text-[#59B7F2]" : "text-[#1E3A8A]/70"
          }`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          <line x1="9" y1="10" x2="9" y2="10"></line>
          <line x1="12" y1="10" x2="12" y2="10"></line>
          <line x1="15" y1="10" x2="15" y2="10"></line>
        </svg>
      ),
      subItems: [
        {
          name: "Interview List",
          path: "/interview-dashboard",
        },
        {
          name: "Generate Interview",
          path: "/interview-dashboard/interview-generation",
        },
        {
          name: "Generated Interviews",
          path: "/interview-dashboard/generated-interviews",
        },
      ],
    },
    {
      name: "Settings",
      path: "/settings",
      icon: (isActive: boolean) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`w-5 h-5 ${
            isActive ? "text-[#59B7F2]" : "text-[#1E3A8A]/70"
          }`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      ),
    },
  ];

  // Animation variants for sidebar
  const sidebarVariants = {
    open: {
      width: "16rem",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    closed: {
      width: "5rem",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const logoTextVariants = {
    open: { opacity: 1, width: "auto", display: "block" },
    closed: {
      opacity: 0,
      width: 0,
      transitionEnd: { display: "none" },
    },
  };

  // Tooltip for collapsed sidebar
  const Tooltip = ({
    children,
    show,
  }: {
    children: React.ReactNode;
    show: boolean;
  }) => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute left-16 bg-[#59B7F2] text-white text-sm px-2 py-1 rounded shadow z-50 whitespace-nowrap"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isOpen ? "open" : "closed"}
      initial={false}
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 flex flex-col ${
        isMobile ? "shadow-lg" : ""
      }`}
    >
      {/* Logo section */}
      <div className="p-4 flex items-center space-x-4">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/wallstreetai-logo.png"
            alt="WallStreetAI Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <motion.span
            variants={logoTextVariants}
            className="ml-2 text-xl font-semibold text-[#1E3A8A]"
          >
            WallStreetAI
          </motion.span>
        </Link>
      </div>

      {/* Navigation section */}
      <nav className="flex-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const showTooltip = !isOpen && activeTooltip === item.name;

          return (
            <div key={item.name}>
              <Link
                href={item.path}
                className={`flex items-center px-3 py-2 rounded-lg mb-1 relative group ${
                  isActive
                    ? "bg-[#59B7F2]/10 text-[#59B7F2]"
                    : "text-[#1E3A8A]/70 hover:bg-gray-100"
                }`}
                onMouseEnter={() => !isOpen && setActiveTooltip(item.name)}
                onMouseLeave={() => setActiveTooltip(null)}
                onClick={() => isMobile && toggleSidebar()}
              >
                {item.icon && item.icon(isActive)}
                <motion.span
                  variants={logoTextVariants}
                  className="ml-3 font-medium"
                >
                  {item.name}
                </motion.span>
                <Tooltip show={showTooltip}>{item.name}</Tooltip>
              </Link>

              {/* Sub-items */}
              {isOpen && item.subItems && isActive && (
                <div className="ml-8 space-y-1">
                  {item.subItems.map((subItem) => {
                    const isSubItemActive = pathname === subItem.path;
                    return (
                      <Link
                        key={subItem.path}
                        href={subItem.path}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                          isSubItemActive
                            ? "bg-[#59B7F2]/10 text-[#59B7F2]"
                            : "text-[#1E3A8A]/70 hover:bg-gray-100"
                        }`}
                        onClick={() => isMobile && toggleSidebar()}
                      >
                        {subItem.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Settings section */}
      <div className="p-4">
        <Link
          href="/settings"
          className={`flex items-center px-3 py-2 rounded-lg relative ${
            pathname === "/settings"
              ? "bg-[#59B7F2]/10 text-[#59B7F2]"
              : "text-[#1E3A8A]/70 hover:bg-gray-100"
          }`}
          onMouseEnter={() => !isOpen && setActiveTooltip("Settings")}
          onMouseLeave={() => setActiveTooltip(null)}
          onClick={() => isMobile && toggleSidebar()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-5 h-5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <motion.span variants={logoTextVariants} className="ml-3 font-medium">
            Settings
          </motion.span>
          <Tooltip show={!isOpen && activeTooltip === "Settings"}>
            Settings
          </Tooltip>
        </Link>
      </div>
    </motion.div>
  );
}
