import { supabase } from './supabase';

export async function getUserWithDetails() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
} 