
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get user profile
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check Stripe subscription status if premium
    if (profile?.plan === "premium") {
      // Look for active subscriptions in payments table
      const { data: payments } = await supabaseClient
        .from("payments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);

      const payment = payments?.[0];

      if (payment?.stripe_subscription_id) {
        const subscription = await stripe.subscriptions.retrieve(
          payment.stripe_subscription_id
        );
        
        // If subscription is no longer active, update profile
        if (subscription.status !== "active" && subscription.status !== "trialing") {
          await supabaseClient
            .from("profiles")
            .update({ plan: "free" })
            .eq("id", user.id);
            
          return new Response(
            JSON.stringify({ 
              plan: "free",
              subscription: null,
              apiRequests: { used: 0, limit: 100 }
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );
        }
      }
    }

    // Count API requests
    const { count } = await supabaseClient
      .from("api_requests")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
    
    const apiRequestsUsed = count || 0;
    const apiRequestsLimit = profile?.plan === "premium" ? null : 100;

    return new Response(
      JSON.stringify({
        plan: profile?.plan || "free",
        apiRequests: {
          used: apiRequestsUsed,
          limit: apiRequestsLimit
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
