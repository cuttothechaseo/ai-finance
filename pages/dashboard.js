import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          // If no session, redirect to login
          router.push('/login');
          return;
        }
        
        // Get user data from the database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (userError) throw userError;
        
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
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
              <div className="flex-shrink-0">
                <span className="text-xl font-bold text-primary">AI Finance</span>
              </div>
            </div>
            <div>
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
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <h1 className="text-2xl font-bold mb-6">Welcome to your Dashboard!</h1>
          
          {user && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-700 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Your Profile</h2>
                <p><span className="text-gray-400">Name:</span> {user.name}</p>
                <p><span className="text-gray-400">Email:</span> {user.email}</p>
                <p><span className="text-gray-400">Background:</span> {user.background}</p>
              </div>
              
              <div className="p-4 bg-gray-700 rounded-lg">
                <h2 className="text-lg font-medium mb-4">Getting Started</h2>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Complete your financial profile</li>
                  <li>Try our AI interview preparation tool</li>
                  <li>Join our community</li>
                  <li>Check out our learning resources</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 