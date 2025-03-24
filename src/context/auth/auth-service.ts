
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from './types';

// Fetch user profile data from Supabase
export const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    // Get API usage count
    const { data: apiData, error: apiError } = await supabase
      .from('api_requests')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

    if (apiError) {
      console.error('Error fetching API usage:', apiError);
    }

    // Set limits based on plan
    const apiLimit = data.plan === 'premium' ? 25 : 10;
    
    // Make sure we cast plan to the correct type
    const userPlan = (data.plan === 'premium' ? 'premium' : 'free') as 'free' | 'premium';

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      plan: userPlan,
      apiRequests: {
        limit: apiLimit,
        used: apiData?.length || 0
      }
    };
  } catch (error) {
    console.error('Error in fetchProfile:', error);
    return null;
  }
};

// Authentication operations
export const authService = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    toast({
      title: 'Success',
      description: 'Logged in successfully!',
    });

    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
    
    toast({
      title: 'Account created',
      description: 'Your account has been created successfully!',
    });

    return data;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  },

  getCurrentSession: async () => {
    return await supabase.auth.getSession();
  },

  onAuthStateChange: (callback: (user: User | null, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, !!session);
      callback(session?.user ?? null, session);
    });
  }
};
