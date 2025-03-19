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

// Get user with details
export const getUserWithDetails = async () => {
    const { data: user, error } = await supabase.auth.getUser();
    if (error) throw error;

    // Fetch user details from Supabase 'users' table
    const { data: userDetails, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.user.id)
        .single();

    if (userError) throw userError;

    return userDetails;
};

// Log out function
export const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}; 