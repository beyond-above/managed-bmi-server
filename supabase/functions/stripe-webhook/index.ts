
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(body, signature!, endpointSecret);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Webhook Error: ${err.message}` }),
      { status: 400 }
    );
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const customerId = session.customer;
        
        // Get customer details
        const customer = await stripe.customers.retrieve(customerId);
        const userId = customer.metadata.userId;
        
        if (!userId) {
          console.error("No user ID in customer metadata");
          break;
        }
        
        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription
          );

          // Add payment record
          await supabaseClient
            .from("payments")
            .insert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: session.subscription,
              status: subscription.status,
              plan: "premium",
              amount: session.amount_total,
              currency: session.currency,
            });

          // Update user profile to premium
          await supabaseClient
            .from("profiles")
            .update({
              plan: "premium",
              updated_at: new Date().toISOString()
            })
            .eq("id", userId);
        }
        break;
      }
      
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription
        );
        const customer = await stripe.customers.retrieve(subscription.customer);
        const userId = customer.metadata.userId;
        
        if (!userId) {
          console.error("No user ID in customer metadata");
          break;
        }
        
        // Update payment status
        await supabaseClient
          .from("payments")
          .update({
            status: subscription.status,
            updated_at: new Date().toISOString()
          })
          .eq("stripe_subscription_id", invoice.subscription)
          .eq("user_id", userId);
        
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const userId = customer.metadata.userId;
        
        if (!userId) {
          console.error("No user ID in customer metadata");
          break;
        }
        
        // Update payment status
        await supabaseClient
          .from("payments")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString()
          })
          .eq("stripe_subscription_id", subscription.id)
          .eq("user_id", userId);
        
        // Downgrade user to free plan
        await supabaseClient
          .from("profiles")
          .update({
            plan: "free",
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);
        
        break;
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
