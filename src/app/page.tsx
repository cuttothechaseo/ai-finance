'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import dynamic from 'next/dynamic';
import SectionDivider from '@/app/components/ui/SectionDivider';

// Dynamically import components to avoid hydration issues
const Navbar = dynamic(() => import('@/app/components/navbar/Navbar'), { ssr: false });
const Hero = dynamic(() => import('@/app/components/hero/Hero'), { ssr: false });
const Partners = dynamic(() => import('@/app/components/partners/Partners'), { ssr: false });
const Features = dynamic(() => import('@/app/components/features/Features'), { ssr: false });
const ExclusiveResources = dynamic(() => import('@/app/components/resources/ExclusiveResources'), { ssr: false });
const HowItWorks = dynamic(() => import('@/app/components/how-it-works/HowItWorks'), { ssr: false });
const JoinWaitlist = dynamic(() => import('@/app/components/waitlist/JoinWaitlist'), { ssr: false });
const SuccessStories = dynamic(() => import('@/app/components/testimonials/SuccessStories'), { ssr: false });

export default function Home() {
  const controls = useAnimation();

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
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
            staggerChildren: 0.1
          }
        }
      }}
    >
      <Navbar />
      <Hero />
      <SectionDivider />
      <Partners />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <SuccessStories />
      <SectionDivider />
      <ExclusiveResources />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <JoinWaitlist />
    </motion.main>
  );
} 