'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getUserWithDetails, logOut } from '../lib/auth';
import Link from 'next/link';

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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <span className="text-xl font-bold text-primary">AI Finance</span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'profile' 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    Profile
                  </button>
                  <button 
                    onClick={() => setActiveTab('resume')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'resume' 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    Resume
                  </button>
                  <button 
                    onClick={() => setActiveTab('networking')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'networking' 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    Networking
                  </button>
                  <button 
                    onClick={() => setActiveTab('interviews')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'interviews' 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    Mock Interviews
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {user && (
                <div className="mr-4 text-sm text-gray-300">
                  Welcome, {user.name}
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {activeTab === 'profile' && user && (
          <div className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700">
            <div className="px-6 py-5 border-b border-gray-700">
              <h1 className="text-2xl font-bold">Your Profile</h1>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-5">
                  <h2 className="text-lg font-medium mb-4">Personal Information</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400">Full Name</label>
                      <p className="text-white">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">Email Address</label>
                      <p className="text-white">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">Background</label>
                      <p className="text-white capitalize">{user.background?.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-5">
                  <h2 className="text-lg font-medium mb-4">Account Statistics</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Resumes</p>
                      <p className="text-2xl font-bold text-primary">{user.resumeCount || 0}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Network Connections</p>
                      <p className="text-2xl font-bold text-primary">0</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Mock Interviews</p>
                      <p className="text-2xl font-bold text-primary">0</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">AI Feedback</p>
                      <p className="text-2xl font-bold text-primary">0</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-700 rounded-lg p-5">
                <h2 className="text-lg font-medium mb-4">Getting Started</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-gray-800 rounded-full p-2 mr-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Complete your profile</h3>
                      <p className="text-sm text-gray-400">Add more details about your career goals and preferences.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gray-800 rounded-full p-2 mr-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Upload your resume</h3>
                      <p className="text-sm text-gray-400">Get AI-powered feedback and improvement suggestions.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gray-800 rounded-full p-2 mr-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Grow your network</h3>
                      <p className="text-sm text-gray-400">Get AI suggestions for networking opportunities.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gray-800 rounded-full p-2 mr-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Practice interview skills</h3>
                      <p className="text-sm text-gray-400">Schedule AI-powered mock interviews for finance roles.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700">
            <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Your Resumes</h1>
              <Link 
                href="/resume" 
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Upload New Resume
              </Link>
            </div>
            <div className="p-6">
              {user?.resumes && user.resumes.length > 0 ? (
                <div className="space-y-4">
                  {user.resumes.map((resume, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="bg-gray-800 rounded-full p-2">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">{resume.file_name}</h3>
                          <p className="text-sm text-gray-400">
                            {resume.created_at 
                              ? `Uploaded on ${new Date(resume.created_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}`
                              : 'Recently uploaded'
                            }
                          </p>
                          {resume.file_size && (
                            <p className="text-xs text-gray-500 mt-1">
                              {(resume.file_size / 1024 / 1024).toFixed(2)} MB • {resume.file_type?.toUpperCase() || 'Document'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={resume.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-800 rounded-md hover:bg-gray-600 transition-colors"
                          title="View Resume"
                        >
                          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                        <button
                          className="p-2 bg-gray-800 rounded-md hover:bg-gray-600 transition-colors"
                          title="Get AI Feedback"
                        >
                          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-white">No resumes yet</h3>
                  <p className="mt-1 text-sm text-gray-400">Get started by uploading your first resume.</p>
                  <div className="mt-6">
                    <Link
                      href="/resume"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Upload Resume
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'networking' && (
          <div className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700">
            <div className="px-6 py-5 border-b border-gray-700">
              <h1 className="text-2xl font-bold">Networking Suggestions</h1>
            </div>
            <div className="p-6">
              <div className="text-center py-10">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-white">No networking suggestions yet</h3>
                <p className="mt-1 text-sm text-gray-400">Complete your profile to get personalized networking suggestions.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Generate Suggestions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'interviews' && (
          <div className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700">
            <div className="px-6 py-5 border-b border-gray-700">
              <h1 className="text-2xl font-bold">Mock Interviews</h1>
            </div>
            <div className="p-6">
              <div className="text-center py-10">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-white">No mock interviews yet</h3>
                <p className="mt-1 text-sm text-gray-400">Practice your interview skills with our AI interviewer.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Start Mock Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 