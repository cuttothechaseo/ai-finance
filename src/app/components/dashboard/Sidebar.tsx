'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

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

export default function Sidebar({ isMobile, toggleSidebar, isOpen }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} 
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      name: 'Resume Analysis',
      path: '/resume',
      icon: (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} 
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
    },
    {
      name: 'Networking',
      path: '/networking',
      icon: (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} 
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      name: 'Mock Interviews',
      path: '/interviews',
      icon: (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} 
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          <line x1="9" y1="10" x2="9" y2="10"></line>
          <line x1="12" y1="10" x2="12" y2="10"></line>
          <line x1="15" y1="10" x2="15" y2="10"></line>
        </svg>
      ),
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} 
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      ),
    },
  ];

  // Animation variants for sidebar
  const sidebarVariants = {
    open: { 
      x: 0,
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
    closed: { 
      x: "-100%", 
      opacity: 0,
    }
  };

  const itemVariants = {
    open: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { x: -20, opacity: 0 }
  };

  if (!mounted) return null;

  const container = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className={`
          fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-800
          flex flex-col transition-all duration-300 ease-in-out
          ${isMobile ? 'z-30 w-64 shadow-xl' : 'z-10 w-64'}
          ${!isMobile && !isOpen ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo section */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className={`text-xl font-bold text-primary transition-opacity duration-200 ${!isOpen && !isMobile ? 'opacity-0' : 'opacity-100'}`}>
              AI Finance
            </span>
          </Link>
          {isMobile && (
            <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <motion.div key={item.name} variants={itemVariants}>
                <Link
                  href={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                  `}
                >
                  <span className="mr-3">{item.icon(isActive)}</span>
                  <span className={`transition-opacity duration-200 ${!isOpen && !isMobile ? 'opacity-0 w-0' : 'opacity-100'}`}>
                    {item.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
        
        {/* Profile section */}
        <div className="border-t border-gray-800 p-4">
          <button
            className={`
              flex items-center w-full px-4 py-2 rounded-lg text-gray-300 
              hover:bg-gray-800 hover:text-white transition-all duration-200
            `}
          >
            <span className="p-1 mr-3 bg-primary/20 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </span>
            <span className={`transition-opacity duration-200 ${!isOpen && !isMobile ? 'opacity-0 w-0' : 'opacity-100'}`}>
              Logout
            </span>
          </button>
        </div>
      </motion.aside>
    </>
  );
} 