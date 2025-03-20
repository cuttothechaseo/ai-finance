'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  toggleSidebar: () => void;
}

export default function Navbar({ user, onLogout, toggleSidebar }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">AI Finance</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="relative ml-3">
              <div>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  id="user-menu-button"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <span className="text-sm font-medium">{user?.name?.charAt(0) || 'U'}</span>
                  </div>
                </button>
              </div>
              
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                    Welcome, {user?.name || 'User'}
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 