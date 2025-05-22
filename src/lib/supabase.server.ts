// WARNING: DO NOT IMPORT THIS FILE IN THE BROWSER. Use @/lib/supabaseClient for all client-side code.
// This file is intended for server-side use only.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 