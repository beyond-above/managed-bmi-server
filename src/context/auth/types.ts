
import { Session, User } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  plan: 'free' | 'premium';
  apiRequests: {
    limit: number;
    used: number;
  };
};

export type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};
