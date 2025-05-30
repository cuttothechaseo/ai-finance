"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import dynamic from "next/dynamic";
import SectionDivider from "@/app/components/ui/SectionDivider";
import MockInterviewCard from "@/app/components/features/MockInterviewCard";
import JoinWaitlist from "@/app/components/waitlist/Pricing";
import SupportModal from "@/app/components/ui/SupportModal";
import Link from "next/link";

// Dynamically import components to avoid hydration issues
const Navbar = dynamic(() => import("@/app/components/navbar/Navbar"), {
  ssr: false,
});
const Hero = dynamic(() => import("@/app/components/hero/Hero"), {
  ssr: false,
});
const Partners = dynamic(() => import("@/app/components/partners/Partners"), {
  ssr: false,
});
const Features = dynamic(() => import("@/app/components/features/Features"), {
  ssr: false,
});
const ExclusiveResources = dynamic(
  () => import("@/app/components/resources/ExclusiveResources"),
  { ssr: false }
);
const HowItWorks = dynamic(
  () => import("@/app/components/how-it-works/HowItWorks"),
  { ssr: false }
);
const Pricing = dynamic(() => import("@/app/components/waitlist/Pricing"), {
  ssr: false,
});
const SuccessStories = dynamic(
  () => import("@/app/components/testimonials/SuccessStories"),
  { ssr: false }
);

export default function Home() {
  const controls = useAnimation();
  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => {
    // Scroll to top when page loads
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    }

    controls.start("visible");
  }, [controls]);

  return (
    <motion.main
      className="min-h-screen bg-gradient-dark text-white overflow-hidden"
      initial="hidden"
      animate={controls}
      suppressHydrationWarning
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <Navbar />
      <Hero />
      <SectionDivider />
      <Partners />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <MockInterviewCard />
      <SectionDivider />
      <SuccessStories />
      <SectionDivider />
      <ExclusiveResources />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <Pricing />
      {/* Footer Banner */}
      <footer className="w-full bg-[#59B7F2] border-t border-[#59B7F2] py-4 px-4 flex flex-col items-center justify-center gap-2 text-sm text-white">
        <div className="flex flex-wrap gap-4 justify-center mb-2">
          <a
            href="#"
            className="hover:underline text-white"
            onClick={(e) => {
              e.preventDefault();
              setSupportOpen(true);
            }}
          >
            Support
          </a>
          <Link href="/TOS" className="hover:underline text-white">
            Terms of Service
          </Link>
          <Link href="/PrivacyPolicy" className="hover:underline text-white">
            Privacy Policy
          </Link>
        </div>
        <div className="text-white text-center">
          © 2025 Wall Street AI. All rights reserved.
        </div>
      </footer>
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </motion.main>
  );
}
