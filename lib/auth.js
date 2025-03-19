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

    // Fetch user's resumes
    const { data: resumes, error: resumesError } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

    if (resumesError) {
        console.error("Error fetching resumes:", resumesError);
        // Don't throw error, just return user without resumes
        return userDetails;
    }

    // Return user with resumes
    return {
        ...userDetails,
        resumes: resumes || []
    };
};

// Log out function
export const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}; 