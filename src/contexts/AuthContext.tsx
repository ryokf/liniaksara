"use client";

import { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/config/supabase";
import LandingPage from "@/components/organisms/LandingPage";

interface User {
    id: string;
    email: string;
    displayName?: string;
    photo?: string; // Optional, if you want to include user profile picture
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: Error | null;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    
    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUser({
                        id: user.id,
                        email: user.email!,
                        displayName: user.user_metadata?.full_name,
                        photo: user.user_metadata?.picture,
                    });
                }
                console.log('Current user:', user);
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };
        
        getInitialSession();
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email!,
                        displayName: session.user.user_metadata?.full_name,
                        photo: session.user.user_metadata?.picture,
                    });
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        );
        
        return () => {
            subscription.unsubscribe();
        };
    }, []);
    
    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
        } catch (error) {
            setError(error as Error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, signOut }}>
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
