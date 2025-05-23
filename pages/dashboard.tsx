"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getUserWithDetails, logOut } from "@lib/auth";
import dynamic from "next/dynamic";

// Dynamically import components
const DashboardLayout = dynamic(
  () => import("../src/app/components/dashboard/DashboardLayout")
);
const ProfileSection = dynamic(
  () => import("../src/app/components/dashboard/ProfileSection")
);
const ResumeSection = dynamic(
  () => import("../src/app/components/dashboard/ResumeSection")
);
const NetworkingSection = dynamic(
  () => import("../src/app/components/dashboard/NetworkingSection")
);

// Define types
interface Resume {
  id: string;
  user_id: string;
  file_url: string;
  created_at: string;
  updated_at: string;
  [key: string]: any; // For any additional fields
}

interface UserData {
  id: string;
  email?: string; // Make email optional to match Supabase's user object
  name?: string;
  background?: string;
  bio?: string;
  location?: string;
  resumes?: Resume[];
  resumeCount?: number;
  analysesCount?: number;
  networkingCount?: number;
  pro_access: boolean;
  [key: string]: any; // For any additional fields from Supabase
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("profile");

  useEffect(() => {
    // Check if user is authenticated and fetch details
    const fetchUserData = async () => {
      try {
        const userData = await getUserWithDetails();
        const typedUserData: UserData = {
          ...userData,
          name: userData.name || "user",
          email: userData.email || "",
          resumes: userData.resumes || [],
          resumeCount: userData.resumes ? userData.resumes.length : 0,
          analysesCount: userData.analysesCount || 0,
          networkingCount: userData.networkingCount || 0,
          pro_access: userData.pro_access || false,
        };
        setUser(typedUserData);
      } catch (error) {
        console.error("Error fetching user:", error);
        const defaultUser: UserData = {
          id: "default",
          name: "user",
          email: "",
          resumes: [],
          resumeCount: 0,
          analysesCount: 0,
          networkingCount: 0,
          pro_access: false,
        };
        setUser(defaultUser);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  useEffect(() => {
    if (!loading && user && !user.pro_access) {
      router.replace("/");
    }
  }, [loading, user, router]);

  const handleSignOut = async () => {
    try {
      await logOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#59B7F2] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // Render the appropriate section based on activeTab
  const renderSection = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection />;
      case "resume":
        return <ResumeSection user={user} />;
      case "networking":
        return <NetworkingSection user={user} />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <DashboardLayout user={user} onLogout={handleSignOut}>
      {renderSection()}
    </DashboardLayout>
  );
}
