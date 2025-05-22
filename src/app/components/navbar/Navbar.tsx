"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useContext, useState, useRef, useEffect } from "react";
import { WaitlistContext } from "@/app/contexts/WaitlistContext";
import Link from "next/link";
import { useUser } from "@/components/AuthProvider";
import { logOut } from "@lib/auth";
import { createBrowserClient } from "@supabase/ssr";

const navLinks = [
  { name: "AI-Powered Features", href: "#features", id: "features" },
  { name: "Success Stories", href: "#success-stories", id: "success-stories" },
  {
    name: "Exclusive Resources",
    href: "#exclusive-resources",
    id: "exclusive-resources",
  },
  { name: "How It Works", href: "#how-it-works", id: "how-it-works" },
  { name: "Pricing", href: "#join-waitlist", id: "join-waitlist" },
];

export default function Navbar() {
  const { setIsModalOpen } = useContext(WaitlistContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useUser();
  console.log("Navbar user object:", user);
  const firstName = user?.name ? user.name.split(" ")[0] : "";

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

  const handleLogout = async () => {
    await logOut();
    window.location.href = "/";
  };

  const handleGetPro = async () => {
    try {
      // Get the Supabase access token
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Supabase session:", session); // Debug log
      const access_token = session?.access_token;
      console.log("Supabase access_token:", access_token); // Debug log
      if (!access_token) {
        alert("You must be logged in to purchase Pro.");
        return;
      }
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout.");
      }
    } catch (err) {
      alert("Failed to start checkout.");
    }
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
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#59B7F2]/90 backdrop-blur-md border-b border-white/10"
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
          {/* Logo with wallstreetai logo */}
          <div className="flex items-center">
            <Image
              src="/assets/logos/wallstreetai-logo.svg"
              alt="WallStreetAI Logo"
              width={40}
              height={40}
              className="mr-2"
            />
          </div>
        </motion.div>

        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.id)}
              className="text-sm font-medium text-white hover:text-[#B3E5FC] transition-colors duration-150 cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          {!loading && user ? (
            <>
              {user.pro_access ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-[#1E3A8A] text-white text-base font-semibold rounded-lg shadow-md hover:bg-[#1E3A8A]/90 transition-all duration-200 flex items-center border-2 border-[#1E3A8A] mr-2"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={handleGetPro}
                  className="px-5 py-2 bg-[#1E3A8A] text-white text-base font-semibold rounded-lg shadow-md hover:bg-[#1E3A8A]/90 transition-all duration-200 flex items-center border-2 border-[#1E3A8A] mr-2"
                >
                  Get Pro
                </motion.button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-[#1E3A8A] text-base font-semibold rounded-lg border border-[#1E3A8A] shadow-sm hover:bg-white/90 hover:shadow-md transition-all duration-200 flex items-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 bg-white text-[#1E3A8A] text-sm font-semibold rounded-lg border border-[#1E3A8A] shadow-sm hover:bg-white/90 hover:shadow-md transition-all duration-200 flex items-center"
              >
                <span className="relative z-10 flex items-center">Sign In</span>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => scrollToSection("join-waitlist")}
                className="px-5 py-2 bg-[#1E3A8A] text-white text-base font-semibold rounded-lg shadow-md hover:bg-[#1E3A8A]/90 transition-all duration-200 flex items-center border-2 border-[#1E3A8A]"
              >
                Get Instant Access
              </motion.button>
            </>
          )}
          {firstName && (
            <div className="h-9 w-9 rounded-full bg-[#59B7F2] text-white flex items-center justify-center">
              <span className="text-sm font-semibold px-2">{firstName}</span>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
