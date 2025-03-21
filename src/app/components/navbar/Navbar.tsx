"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useContext, useState, useRef, useEffect } from "react";
import { WaitlistContext } from "@/app/contexts/WaitlistContext";
import Link from "next/link";

const navLinks = [
  { name: "AI-Powered Features", href: "#features", id: "features" },
  { name: "Success Stories", href: "#success-stories", id: "success-stories" },
  {
    name: "Exclusive Resources",
    href: "#exclusive-resources",
    id: "exclusive-resources",
  },
  { name: "How It Works", href: "#how-it-works", id: "how-it-works" },
];

export default function Navbar() {
  const { setIsModalOpen } = useContext(WaitlistContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openWaitlistModal = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-secondary/80 backdrop-blur-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <motion.div
          className="cursor-pointer flex items-center"
          onClick={scrollToTop}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Image
            src="/assets/logos/wallstreetai-logo.png"
            alt="WallStreetAI Logo"
            width={160}
            height={50}
            className="object-contain h-auto w-auto max-h-12"
            priority
            style={{ backgroundColor: "transparent" }}
          />
        </motion.div>

        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.id)}
              className="nav-link text-sm font-medium cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </div>

        <div ref={dropdownRef} className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <button
              onClick={toggleDropdown}
              className="secondary-button group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                🚀 Get Early Access
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>

              {/* Subtle highlight effect on hover */}
              <motion.div
                className="absolute inset-0 bg-primary-light/0 group-hover:bg-primary-light/10 transition-colors duration-300"
                initial={false}
              />
            </button>
          </motion.div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <motion.div
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-1" role="menu" aria-orientation="vertical">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  🔑 Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  ✨ Create Account
                </Link>
                <button
                  onClick={openWaitlistModal}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                >
                  🚀 Join Waitlist
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
