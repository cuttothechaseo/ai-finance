'use client';

import { motion } from 'framer-motion';

const navLinks = [
  { name: 'AI-Powered Features', href: '#features', id: 'features' },
  { name: 'Success Stories', href: '#success-stories', id: 'success-stories' },
  { name: 'Exclusive Resources', href: '#exclusive-resources', id: 'exclusive-resources' },
  { name: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
];

export default function Navbar() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToWaitlist = () => {
    document.getElementById("join-waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-secondary/80 backdrop-blur-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className="cursor-pointer"
            onClick={scrollToTop}
          >
            <motion.div 
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <span className="text-white font-bold">F</span>
            </motion.div>
          </div>
        </div>
        
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
            onClick={scrollToWaitlist}
            className="secondary-button"
          >
            Join waitlist
          </button>
        </motion.div>
      </div>
    </motion.nav>
  );
} 