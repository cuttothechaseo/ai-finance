"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type NavItem = {
  name: string;
  path: string;
  icon: (isActive: boolean) => JSX.Element;
};

interface SidebarProps {
  isMobile: boolean;
  toggleSidebar: () => void;
  isOpen: boolean;
}

export default function Sidebar({
  isMobile,
  toggleSidebar,
  isOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (isActive) => (
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
      icon: (isActive) => (
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
      icon: (isActive) => (
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
      icon: (isActive) => (
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

  const itemVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: { x: -10, opacity: 0 },
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
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20"
            onClick={toggleSidebar}
          ></motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className={`
          fixed top-0 left-0 h-full bg-white backdrop-blur-md border-r border-[#B3E5FC]/30
          flex flex-col transition-all duration-300 ease-in-out overflow-hidden shadow-md
          ${isMobile ? "z-30 shadow-xl" : "z-10"}
        `}
      >
        {/* Logo section */}
        <div className="p-4 border-b border-[#B3E5FC]/30 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/logos/wallstreetai-logo.svg"
              alt="WallStreetAI Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <motion.span
              variants={logoTextVariants}
              className="ml-2 text-xl font-bold text-[#1E3A8A] transition-all duration-200"
            >
              Wall Street AI
            </motion.span>
          </Link>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-[#B3E5FC]/20 text-[#1E3A8A]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() =>
                  !isOpen && !isMobile && setActiveTooltip(item.name)
                }
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <Link
                  href={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#B3E5FC]/50 text-[#1E3A8A]"
                        : "text-[#1E3A8A]/70 hover:bg-[#B3E5FC]/20 hover:text-[#1E3A8A]"
                    }
                  `}
                >
                  <span className="flex-shrink-0">{item.icon(isActive)}</span>
                  <motion.span
                    variants={logoTextVariants}
                    className="ml-3 transition-all duration-200"
                  >
                    {item.name}
                  </motion.span>
                </Link>
                {/* Tooltip for collapsed state */}
                <Tooltip
                  show={!isOpen && !isMobile && activeTooltip === item.name}
                >
                  {item.name}
                </Tooltip>
              </div>
            );
          })}

          {/* Contact Us Button */}
          <div
            className="relative mt-2"
            onMouseEnter={() =>
              !isOpen && !isMobile && setActiveTooltip("Contact Us")
            }
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <Link
              href="/dashboard/contact-us"
              className={`
                flex items-center px-4 py-3 rounded-lg transition-all duration-200
                ${
                  pathname === "/dashboard/contact-us"
                    ? "bg-[#B3E5FC]/50 text-[#1E3A8A]"
                    : "text-[#1E3A8A]/70 hover:bg-[#B3E5FC]/20 hover:text-[#1E3A8A]"
                }
              `}
            >
              <span className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`w-5 h-5 ${
                    pathname === "/dashboard/contact-us"
                      ? "text-[#59B7F2]"
                      : "text-[#1E3A8A]/70"
                  }`}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <motion.span
                variants={logoTextVariants}
                className="ml-3 transition-all duration-200"
              >
                Contact Us
              </motion.span>
            </Link>
            <Tooltip
              show={!isOpen && !isMobile && activeTooltip === "Contact Us"}
            >
              Contact Us
            </Tooltip>
          </div>
        </nav>

        {/* Profile section */}
        <div className="border-t border-[#B3E5FC]/30 p-4">
          <button
            className={`
              flex items-center w-full px-4 py-2 rounded-lg text-[#1E3A8A]/70 
              hover:bg-[#B3E5FC]/20 hover:text-[#1E3A8A] transition-all duration-200
            `}
            onMouseEnter={() =>
              !isOpen && !isMobile && setActiveTooltip("Logout")
            }
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <span className="p-1 mr-3 bg-[#59B7F2]/20 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#1E3A8A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </span>
            <motion.span
              variants={logoTextVariants}
              className="transition-all duration-200"
            >
              Logout
            </motion.span>

            {/* Tooltip for logout button */}
            <Tooltip show={!isOpen && !isMobile && activeTooltip === "Logout"}>
              Logout
            </Tooltip>
          </button>
        </div>

        {/* Collapse toggle button for desktop */}
        {!isMobile && (
          <div className="p-4 border-t border-[#B3E5FC]/30 flex justify-center">
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-[#B3E5FC]/20 text-[#1E3A8A]/70 hover:text-[#1E3A8A] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                />
              </svg>
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
}
