'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  toggleSidebar: () => void;
}

export default function Navbar({ user, onLogout, toggleSidebar }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95, 
      y: -5, 
      transition: { duration: 0.1 } 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      } 
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 mr-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none md:hidden"
              aria-label="Open sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden md:flex items-center">
              <span className="text-xl font-bold text-white">Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              <span className="sr-only">View notifications</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary animate-pulse-subtle"></span>
            </motion.button>

            {/* User dropdown */}
            <div className="relative ml-3" ref={dropdownRef}>
              <div>
                <motion.button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  id="user-menu-button"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-9 w-9 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <span className="text-sm font-medium">{getUserInitials()}</span>
                  </div>
                </motion.button>
              </div>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm text-gray-300">Signed in as</p>
                      <p className="text-sm font-medium truncate text-white">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Your Profile
                      </div>
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </div>
                    </Link>
                    
                    <div className="border-t border-gray-700 mt-1"></div>
                    
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      role="menuitem"
                    >
                      <div className="flex items-center text-red-400 hover:text-red-300">
                        <svg className="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 