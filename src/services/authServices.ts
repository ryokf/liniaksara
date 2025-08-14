import supabase from "@/config/supabase";

interface AuthResponse {
    data: object | null;
    error: Error | null;
}

export const signInWithGoogle = async () => {
    const { data, error }: AuthResponse = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });

    if (error) {
        console.error('Login error:', error);
    } else {

    }
};

export const registerWithEmail = async (name: string, email: string, password: string): Promise<void> => {

    const { data, error }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { display_name: name } // Simpan display name di metadata
        }
    });

    if (error) {
        console.error("Registrasi gagal:", error.message);
    } else {

    }
};

export const loginWithEmail = async (email: string, password: string): Promise<void> => {
    const { data, error }: AuthResponse = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error("Login gagal:", error.message);
    } else {

    }
};
