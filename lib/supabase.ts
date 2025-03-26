import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase environment variables are missing. Check your .env.local file.'
  );
}

// Debug environment variables in a safe way
console.log('Supabase initialization:', {
  hasUrl: Boolean(supabaseUrl),
  urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 15) + '...' : 'missing',
  hasAnonKey: Boolean(supabaseAnonKey),
  anonKeyLength: supabaseAnonKey?.length || 0,
  hasServiceKey: Boolean(supabaseServiceRoleKey),
  serviceKeyLength: supabaseServiceRoleKey?.length || 0,
  nodeEnv: process.env.NODE_ENV,
});

// Create a stable instance that won't change across hot module reloads
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Set to false to avoid URL parsing on each reload
    storageKey: 'supabase.auth.token',
  },
});

// Create a service role client for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false, // No need to persist for server-side operations
    autoRefreshToken: false,
  },
});

// Debug auth state - for troubleshooting
const debugAuthState = async () => {
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
const refreshAuthState = async () => {
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

// Export everything with both named exports and as default object
export { supabase, supabaseAdmin, debugAuthState, refreshAuthState };
export default supabase; 