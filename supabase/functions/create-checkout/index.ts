
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const { plan } = await req.json();
    
    if (!plan || (plan !== 'premium' && plan !== 'free')) {
      throw new Error("Invalid plan selected");
    }
    
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

    // Skip Razorpay for free plan
    if (plan === "free") {
      await supabaseClient
        .from("profiles")
        .update({ plan: "free" })
        .eq("id", user.id);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Downgraded to free plan",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Get user profile for additional information
    const { data: profiles } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const customerEmail = user.email;
    const customerName = profiles?.name || user.email;
    
    // Initialize Razorpay order
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID") || "";
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || "";
    
    const basicAuth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    
    // Create an order in Razorpay
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${basicAuth}`
      },
      body: JSON.stringify({
        amount: 1200 * 100, // Amount in paisa (Rs. 1200)
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
        notes: {
          userId: user.id,
          plan: "premium"
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Razorpay API error: ${errorData.error?.description || 'Unknown error'}`);
    }
    
    const orderData = await response.json();
    
    // Record the payment intent in our database
    await supabaseClient
      .from("payments")
      .insert({
        user_id: user.id,
        amount: 1200,
        currency: "INR",
        status: "created",
        plan: "premium",
        stripe_payment_id: orderData.id // Using this field to store Razorpay order ID
      });

    // Return the checkout URL
    return new Response(
      JSON.stringify({ 
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: RAZORPAY_KEY_ID,
        prefill: {
          name: customerName,
          email: customerEmail
        },
        url: `${req.headers.get("origin")}/checkout?order_id=${orderData.id}`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
