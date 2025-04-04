
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from './types';
import { paymentService } from '@/services/payment-service';

// Helper to handle API errors
const handleError = (error: any) => {
  const message = error.message || 'An error occurred';
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  });
  return message;
};

// Helper to extract username from email
const getUsernameFromEmail = (email: string): string => {
  return email.split('@')[0];
};

export const authService = {
  // Fetch profile data from Supabase
  async fetchProfile(userId: string): Promise<UserProfile | null> {
    try {
      // First check subscription status with Stripe
      const { data: subscriptionData, error: subscriptionError } = await paymentService.checkSubscription();
      
      if (subscriptionError) {
        console.error("Failed to check subscription:", subscriptionError);
      }

      // Then fetch profile data from database
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }
      
      // If we have subscription data, use that for the plan and API requests
      const apiRequests = subscriptionData?.apiRequests || { used: 0, limit: 100 };
      const plan = subscriptionData?.plan || data.plan || 'free';
      
      return {
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        plan: plan,
        apiRequests: apiRequests
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  // Login user with email and password
  async login(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data.user;
    } catch (error) {
      handleError(error);
      return null;
    }
  },

  // Register a new user
  async register(email: string, password: string, name: string): Promise<User | null> {
    try {
      email = email.trim().toLowerCase();
      
      console.log("Registering with email:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Create profile if not created by trigger
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name: name || getUsernameFromEmail(email),
          email: email,
          plan: 'free', 
        });
      }

      return data.user;
    } catch (error) {
      handleError(error);
      return null;
    }
  },

  // Sign in with Google OAuth
  async signInWithGoogle(): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      handleError(error);
    }
  },

  // Log out the current user
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error) {
      handleError(error);
    }
  },

  // Get the current session
  async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      return data.session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }
};
