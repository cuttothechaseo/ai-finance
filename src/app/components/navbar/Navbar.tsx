'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useContext } from 'react';
import { WaitlistContext } from '@/app/contexts/WaitlistContext';

const navLinks = [
  { name: 'AI-Powered Features', href: '#features', id: 'features' },
  { name: 'Success Stories', href: '#success-stories', id: 'success-stories' },
  { name: 'Exclusive Resources', href: '#exclusive-resources', id: 'exclusive-resources' },
  { name: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
];

export default function Navbar() {
  const { setIsModalOpen } = useContext(WaitlistContext);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWaitlistModal = () => {
    setIsModalOpen(true);
  };

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
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Image
            src="/logos/wallstreetai-logo.png"
            alt="WallStreetAI Logo"
            width={160}
            height={50}
            className="object-contain h-auto w-auto max-h-12"
            priority
            style={{ backgroundColor: 'transparent' }}
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
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <button 
            onClick={openWaitlistModal}
            className="secondary-button"
          >
            Join waitlist
          </button>
        </motion.div>
      </div>
    </motion.nav>
  );
} 