import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { login as apiLogin } from '@/services/api';

// Define a simple user type
type User = {
    id: string;
    username: string;
    role: string;
    primaryEmployeeName: string; // The name used in Journey Plans
};

type AuthContextType = {
    user: User | null;
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    signIn: async () => { },
    signOut: () => { },
    isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const segments = useSegments();

    const signIn = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const userData = await apiLogin({ username, password });
            setUser(userData);
            router.replace('/(tabs)');
        } catch (error: any) {
            alert(error.response?.data?.error || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = () => {
        setUser(null);
        router.replace('/login');
    };

    useEffect(() => {
        const inAuthGroup = segments[0] === '(tabs)';

        if (!user && inAuthGroup) {
            router.replace('/login');
        } else if (user && segments[0] === 'login') {
            router.replace('/(tabs)');
        }
    }, [user, segments]);

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
