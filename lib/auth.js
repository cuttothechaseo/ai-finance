import { supabase } from "./supabase";

// Sign up function
export const signUp = async (email, password, name, background) => {
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
export async function getUserWithDetails() {
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
    
    // Return user data along with resumes
    return { 
        ...user.user,
        resumes: resumes || []  // Return empty array if no resumes are found
    };
}

// Log out function
export const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}; 