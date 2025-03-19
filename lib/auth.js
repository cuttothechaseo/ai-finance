import { supabase } from "./supabase";

// Sign up function
export const signUp = async (email, password, name, background) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, background } }
    });
    if (error) throw error;

    // Save user info in Supabase 'users' table
    const { error: insertError } = await supabase
        .from("users")
        .insert([{ id: data.user.id, email, name, background }]);

    if (insertError) throw insertError;
    return data;
};

// Sign in function
export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    
    if (error) throw error;
    return data;
}; 