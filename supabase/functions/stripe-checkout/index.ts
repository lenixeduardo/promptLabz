import Stripe from "npm:stripe@14"
import { createClient } from "npm:@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
})
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
)

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()
    if (!userId) {
      return new Response(JSON.stringify({ error: "userId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const { data: userRow } = await supabaseAdmin
      .from("users")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single()

    let customerId = userRow?.stripe_customer_id as string | undefined

    if (!customerId) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId)
      const customer = await stripe.customers.create({
        email: authUser.user?.email,
        metadata: { supabase_uid: userId },
      })
      customerId = customer.id
      await supabaseAdmin
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", userId)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        { price: Deno.env.get("STRIPE_PRICE_ID")!, quantity: 1 },
      ],
      subscription_data: { trial_period_days: 30 },
      success_url: `${Deno.env.get("APP_URL")}/community?subscribed=true`,
      cancel_url: `${Deno.env.get("APP_URL")}/community`,
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("stripe-checkout error:", err)
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
