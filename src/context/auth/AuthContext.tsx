
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authService } from './auth-service';
import { UserProfile } from './types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const defaultContext: AuthContextType = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => null,
  register: async () => null,
  signInWithGoogle: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchProfile = useCallback(async (userId: string) => {
    const profileData = await authService.fetchProfile(userId);
    if (profileData) {
      setProfile(profileData);
    }
  }, []);
  
  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  const handleAuthStateChange = useCallback(async (event: string, session: any) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      setIsLoading(true);
      setUser(session.user);
      await fetchProfile(session.user.id);
      setIsLoading(false);
    } else if (event === 'SIGNED_OUT') {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
    }
  }, [fetchProfile]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check for existing session
        const session = await authService.getSession();
        
        if (session) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    
    // Clean up subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [handleAuthStateChange, fetchProfile]);

  // Auth methods
  const login = async (email: string, password: string) => {
    return await authService.login(email, password);
  };

  const register = async (name: string, email: string, password: string) => {
    return await authService.register(email, password, name);
  };

  const signInWithGoogle = async () => {
    await authService.signInWithGoogle();
  };

  const logout = async () => {
    await authService.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        signInWithGoogle,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
