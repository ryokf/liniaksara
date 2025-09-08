import supabase from "@/config/supabase";

interface AuthResponse {
    data: object | null;
    error: Error | null;
}

export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });

    if (error) {
        console.error('Login error:', error);
        return { data: null, error: error.message };
    }

    return { data, error: null };
};

export const registerWithEmail = async (username: string, email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { display_name: username }
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        // Create profile in profiles table
        // const { error: profileError } = await supabase
        //     .from('profiles')
        //     .insert([
        //         {
        //             id: data.user?.id,
        //             username: username,
        //             email: email,
        //         }
        //     ]);

        // if (profileError) {
        //     throw new Error(profileError.message);
        // }

        return { data, error: null };
    } catch (error) {
        if (error instanceof Error) {
            return { data: null, error: error.message };
        }
        return { data: null, error: 'An unexpected error occurred' };
    }
};

export const loginWithEmail = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new Error(error.message);
        }

        // Redirect to /home on successful login
        if (typeof window !== 'undefined') {
            window.location.href = '/home';
        }

        return { data, error: null };
    } catch (error) {
        if (error instanceof Error) {
            return { data: null, error: error.message };
        }
        return { data: null, error: 'An unexpected error occurred' };
    }
};
