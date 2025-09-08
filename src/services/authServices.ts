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
        // Check if email already exists
        const { data: existingUser } = await supabase
            .from('profiles')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUser) {
            return { data: null, error: 'Email sudah terdaftar' };
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { display_name: username }
            }
        });

        if (error) {
            // Translate common errors
            if (error.message.includes('Email rate limit exceeded')) {
                throw new Error('Terlalu banyak percobaan. Silakan tunggu beberapa saat.');
            } else if (error.message.includes('Password should be at least 6 characters')) {
                throw new Error('Password harus minimal 6 karakter.');
            } else {
                throw new Error(error.message);
            }
        }

        return { 
            data, 
            error: null,
            message: 'Registrasi berhasil! Silakan cek email Anda untuk konfirmasi.'
        };
    } catch (error) {
        if (error instanceof Error) {
            return { data: null, error: error.message };
        }
        return { data: null, error: 'Terjadi kesalahan saat registrasi' };
    }
};

export const loginWithEmail = async (email: string, password: string) => {
    try {
        // First check if email exists
        const { data: emailCheck } = await supabase
            .from('profiles')
            .select('email')
            .eq('email', email)
            .single();

        if (!emailCheck) {
            return { data: null, error: 'Email tidak terdaftar' };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            if (error.message === 'Email not confirmed') {
                return { data: null, error: 'Email belum dikonfirmasi. Silakan cek email Anda.' };
            } else if (error.message.includes('Invalid login credentials')) {
                return { data: null, error: 'Password yang Anda masukkan salah' };
            } else {
                throw new Error(error.message);
            }
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
        return { data: null, error: 'Terjadi kesalahan. Silakan coba lagi.' };
    }
};

export const resetPassword = async (email: string) => {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            throw new Error(error.message);
        }

        return { error: null };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Terjadi kesalahan saat mengirim link reset password' };
    }
};
