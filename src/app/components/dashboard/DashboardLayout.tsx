'use client';

import { useState, useEffect } from 'react';
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

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Sidebar visible on all screen sizes, but collapsible on mobile */}
      <Sidebar 
        isMobile={isMobile} 
        toggleSidebar={toggleSidebar} 
        isOpen={isSidebarOpen} 
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-64' : 'ml-20')}`}>
        {/* Navbar for mobile and desktop */}
        <Navbar 
          user={user} 
          onLogout={onLogout} 
          toggleSidebar={toggleSidebar}
        />

        {/* Main Content Area */}
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
} 