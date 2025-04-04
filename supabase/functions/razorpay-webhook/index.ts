
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || "";

// Verify Razorpay webhook signature
const verifyWebhookSignature = (body: string, signature: string, secret: string) => {
  const crypto = require('crypto');
  const expectedSignature = crypto.createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  
  return expectedSignature === signature;
};

serve(async (req) => {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    const body = await req.text();
    
    // Verify webhook signature
    if (!signature || !verifyWebhookSignature(body, signature, RAZORPAY_KEY_SECRET)) {
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Handle different types of events
    if (event.event === "payment.authorized") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      
      // Get the order to access metadata
      const basicAuth = btoa(`${Deno.env.get("RAZORPAY_KEY_ID")}:${RAZORPAY_KEY_SECRET}`);
      const orderResponse = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
        headers: {
          "Authorization": `Basic ${basicAuth}`
        }
      });
      
      const orderData = await orderResponse.json();
      const userId = orderData.notes.userId;
      
      if (!userId) {
        console.error("No user ID found in payment metadata");
        return new Response(JSON.stringify({ error: "Invalid payment metadata" }), { status: 400 });
      }
      
      // Calculate valid_until date (1 month from now)
      const validUntil = new Date();
      validUntil.setMonth(validUntil.getMonth() + 1);
      
      // Update payment record
      await supabaseClient
        .from("payments")
        .update({
          status: "paid",
          stripe_payment_id: payment.id, // Using this field to store Razorpay payment ID
          valid_until: validUntil.toISOString()
        })
        .eq("stripe_payment_id", orderId); // Using stripe_payment_id field to store Razorpay order ID
      
      // Update user profile to premium
      await supabaseClient
        .from("profiles")
        .update({
          plan: "premium",
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);
    } 
    else if (event.event === "subscription.cancelled") {
      const subscription = event.payload.subscription.entity;
      const userId = subscription.notes?.userId;
      
      if (userId) {
        // Downgrade user to free plan
        await supabaseClient
          .from("profiles")
          .update({
            plan: "free",
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
});
