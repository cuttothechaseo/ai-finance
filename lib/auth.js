import { supabase } from "./supabase";

// Sign up function
export const signUp = async (email, password, name, background) => {
    // Trigger Vercel deployment with this comment
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
    // Get the authenticated user
    const { data: user, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) throw new Error('User not authenticated');
    
    // Fetch user details from Supabase 'users' table
    const { data: userDetails, error: userDetailsError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.user.id)
        .single();

    if (userDetailsError) throw new Error('Error fetching user details');
    
    // Fetch resumes related to the authenticated user
    const { data: resumes, error: resumeError } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

    if (resumeError) throw new Error('Error fetching resumes');
    
    // Return user data along with resumes
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