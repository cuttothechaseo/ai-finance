import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase environment variables are missing. Check your .env.local file.'
  );
}

// Create a stable instance that won't change across hot module reloads
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Set to false to avoid URL parsing on each reload
    storageKey: 'supabase.auth.token',
  },
});

// Debug auth state - for troubleshooting
export const debugAuthState = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting auth session:', error);
    return null;
  }
  
  const session = data?.session;
  
  if (!session) {
    console.log('No active session found');
    return null;
  }
  
  // Extract useful information for debugging
  const expiresAt = session.expires_at 
    ? new Date(session.expires_at * 1000).toLocaleString() 
    : 'Unknown';
  
  const authInfo = {
    userId: session.user?.id,
    email: session.user?.email,
    hasToken: Boolean(session.access_token),
    tokenLength: session.access_token?.length,
    expiresAt,
    isExpired: session.expires_at ? (session.expires_at * 1000) < Date.now() : false,
  };
  
  console.log('Auth Debug Info:', authInfo);
  return authInfo;
};

// Helper function to check and refresh auth state
export const refreshAuthState = async () => {
  try {
    // Check current session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Failed to get auth session:', error);
      return null;
    }
    
    const session = data?.session;
    
    // If no session or session is expired/close to expiry, try to refresh
    if (!session || (session.expires_at && (session.expires_at * 1000) - Date.now() < 300000)) {
      console.log('Session expired or close to expiry, attempting refresh');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Failed to refresh session:', refreshError);
        return data; // Return original data even if refresh failed
      }
      
      console.log('Session refreshed successfully');
      return refreshData;
    }
    
    return data;
  } catch (err) {
    console.error('Failed to refresh auth state:', err);
    return null;
  }
}; 