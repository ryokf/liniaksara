"use client";

import { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/config/supabase";
import LandingPage from "@/components/organisms/LandingPage";

import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    displayName?: string;
    photo?: string; // Optional, if you want to include user profile picture
}

interface AuthContextType {
    userLogin: User | null;
    loading: boolean;
    error: Error | null;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userLogin, setUserLogin] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const router = useRouter();


    useEffect(() => {
        let mounted = true;

        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (mounted && user) {
                    setUserLogin({
                        id: user.id,
                        email: user.email!,
                        displayName: user.user_metadata?.full_name || user.user_metadata?.display_name,
                        photo: user.user_metadata?.picture,
                    });
                }
            } catch (error) {
                if (mounted) {
                    setError(error as Error);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (!mounted) return;

                if (session?.user) {
                    setUserLogin({
                        id: session.user.id,
                        email: session.user.email!,
                        displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.display_name,
                        photo: session.user.user_metadata?.picture,
                    });
                } else {
                    setUserLogin(null);
                }
                setLoading(false);
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Separate effect for navigation
    useEffect(() => {
        if (userLogin && window.location.pathname === '/') {
            router.push('/home');
        }
    }, [userLogin, router]);

    const signOut = async () => {
        try {
            setUserLogin(null);
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            setError(error as Error);
        }
    };

    return (
        <AuthContext.Provider value={{ userLogin, loading, error, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
