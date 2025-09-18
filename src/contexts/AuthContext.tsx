"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/config/supabase";
// Unused import removed
// import LandingPage from "@/components/organisms/LandingPage";

/**
 * Interface representing an authenticated user
 */
interface User {
    id: string;
    email: string;
    displayName?: string;
    photo?: string;
}

/**
 * Interface for the authentication context
 */
interface AuthContextType {
    userLogin: User | null;
    loading: boolean;
    error: Error | null;
    signOut: () => Promise<void>;
}

/**
 * Context for authentication state and functions
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component for authentication context
 * @param children - Child components that will have access to auth context
 */
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

    // Handle navigation based on authentication state
    useEffect(() => {
        if (userLogin && window.location.pathname === '/') {
            router.push('/home');
        }
    }, [userLogin, router]);

    /**
     * Sign out the current user
     */
    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error signing out:', error);
                throw error;
            }
            setUserLogin(null);
        } catch (error) {
            console.error('Sign out error:', error);
            setError(error as Error);
        }
    };

    return (
        <AuthContext.Provider value={{ userLogin, loading, error, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to access authentication context
 * @returns The authentication context
 * @throws Error if used outside of AuthProvider
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
