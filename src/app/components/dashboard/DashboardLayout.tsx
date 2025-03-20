'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

export default function DashboardLayout({ children, user, onLogout }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('/dashboard');

  // Handle responsiveness
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const mainContentVariants = {
    expanded: { 
      marginLeft: isMobile ? 0 : "16rem",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    collapsed: { 
      marginLeft: isMobile ? 0 : "5rem",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const childrenVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Sidebar visible on all screen sizes, but collapsible on mobile */}
      <Sidebar 
        isMobile={isMobile} 
        toggleSidebar={toggleSidebar} 
        isOpen={isSidebarOpen} 
      />

      {/* Main Content */}
      <motion.div 
        variants={mainContentVariants}
        initial={false}
        animate={isSidebarOpen ? "expanded" : "collapsed"}
        className={`flex-1 transition-all duration-300`}
      >
        {/* Navbar for mobile and desktop */}
        <Navbar 
          user={user} 
          onLogout={onLogout} 
          toggleSidebar={toggleSidebar}
        />

        {/* Main Content Area with animated transitions */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 overflow-auto h-[calc(100vh-64px)]">
          <motion.div
            key={activeTab} // This will trigger animation when activeTab changes
            initial="hidden"
            animate="visible"
            variants={childrenVariants}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
} 