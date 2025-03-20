'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getUserWithDetails, logOut } from '../lib/auth';
import dynamic from 'next/dynamic';

// Dynamically import components
const DashboardLayout = dynamic(() => import('../src/app/components/dashboard/DashboardLayout'));
const ProfileSection = dynamic(() => import('../src/app/components/dashboard/ProfileSection'));
const ResumeSection = dynamic(() => import('../src/app/components/dashboard/ResumeSection'));
const NetworkingSection = dynamic(() => import('../src/app/components/dashboard/NetworkingSection'));
const InterviewsSection = dynamic(() => import('../src/app/components/dashboard/InterviewsSection'));
const SettingsSection = dynamic(() => import('../src/app/components/dashboard/SettingsSection'));

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Check if user is authenticated and fetch details
    const fetchUserData = async () => {
      try {
        const userData = await getUserWithDetails();
        
        // Update resumes count in the profile statistics section
        if (userData.resumes) {
          userData.resumeCount = userData.resumes.length;
        }
        
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        // If error fetching user, redirect to login
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render the appropriate section based on activeTab
  const renderSection = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection user={user} />;
      case 'resume':
        return <ResumeSection user={user} />;
      case 'networking':
        return <NetworkingSection />;
      case 'interviews':
        return <InterviewsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <ProfileSection user={user} />;
    }
  };

  return (
    <DashboardLayout user={user} onLogout={handleSignOut}>
      {renderSection()}
    </DashboardLayout>
  );
} 