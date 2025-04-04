
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type Plan = 'free' | 'premium';

export const paymentService = {
  /**
   * Create a checkout session for the specified plan
   */
  async createCheckout(plan: Plan): Promise<{ url: string | null; error: string | null }> {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan },
      });

      if (error) {
        throw new Error(error.message);
      }

      return { url: data.url, error: null };
    } catch (error) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
      return { url: null, error: error.message };
    }
  },
  
  /**
   * Check subscription status from Razorpay
   */
  async checkSubscription() {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');

      if (error) {
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (error) {
      console.error("Failed to check subscription:", error);
      return { data: null, error: error.message };
    }
  }
};
