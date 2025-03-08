'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Navbar from '@/app/components/navbar/Navbar';
import Hero from '@/app/components/hero/Hero';
import Partners from '@/app/components/partners/Partners';
import Features from '@/app/components/features/Features';
import SuccessStories from '@/app/components/testimonials/SuccessStories';
import ExclusiveResources from '@/app/components/resources/ExclusiveResources';
import HowItWorks from '@/app/components/how-it-works/HowItWorks';
import JoinWaitlist from '@/app/components/waitlist/JoinWaitlist';
import SectionDivider from '@/app/components/ui/SectionDivider';

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