import { supabase } from './supabase';
import { User } from "@supabase/supabase-js";

interface Resume {
  id: string;
  user_id: string;
  file_url: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

interface UserWithDetails extends User {
  resumes?: Resume[];
  resumeCount?: number;
  analysesCount?: number;
  networkingCount?: number;
  [key: string]: any;
}

// Sign up function
export const signUp = async (email: string, password: string, name: string, background: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name, background }
        }
    });

    if (error) throw error;

    const user = data.user;
    if (!user) throw new Error("User signup failed");

    const { error: dbError } = await supabase.from("users").insert([
        {
            id: user.id,
            email,
            name,
            background
        }
    ]);

    if (dbError) throw dbError;
    return data;
};

// Sign in function
export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    
    if (error) throw error;
    return data;
};

// Get user with details
export async function getUserWithDetails(): Promise<UserWithDetails> {
    // Fetch the authenticated user
    const { data: user, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
        throw new Error('User not authenticated');
    }
    
    const userId = user.user.id;

    // Fetch resumes related to the authenticated user
    const { data: resumes, error: resumeError } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId);  // Ensure the user_id matches

    if (resumeError) {
        console.error('Error fetching resumes:', resumeError);
        throw new Error('Error fetching resumes');
    }
    
    // Get count of completed analyses
    const { count: analysesCount, error: analysesError } = await supabase
        .from('analysis_jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed');
        
    if (analysesError) {
        console.error('Error fetching analyses count:', analysesError);
        // Don't throw error, just set count to 0
    }
    
    // Get count of networking messages
    const { count: networkingCount, error: networkingError } = await supabase
        .from('networking_messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
        
    if (networkingError) {
        console.error('Error fetching networking messages count:', networkingError);
        // Don't throw error, just set count to 0
    }
    
    // Return user data along with resumes and counts
    return { 
        ...user.user,
        resumes: resumes || [],  // Return empty array if no resumes are found
        resumeCount: resumes?.length || 0,
        analysesCount: analysesCount || 0,
        networkingCount: networkingCount || 0
    };
}

// Simple user function (legacy support)
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

// Log out function
export const logOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// Alias for logOut for compatibility
export const signOut = logOut; 