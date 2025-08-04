import Stripe from "stripe";
import { ZuploRequest } from "@zuplo/runtime";
import { supabase } from "./lib/supabase";
import { verifyClerkJWT } from "./lib/verifyClerkJWT";
import { environment } from "@zuplo/runtime";

const stripe = new Stripe(environment.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export default async function (req: ZuploRequest, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!environment.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Stripe secret key not configured" });
  }
  const body = await req.json();
  const { assetId, assetSlug, assetName } = body;

  const auth = req.headers.get("Authorization");
  const { userId } = await verifyClerkJWT(auth);

  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  // Get or create Stripe customer
  const { data: customerRecord } = await supabase
    .from("customers")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  let stripeCustomerId = customerRecord?.stripe_customer_id;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      metadata: { user_id: userId },
    });

    await supabase.from("customers").insert({
      user_id: userId,
      stripe_customer_id: customer.id,
    });

    stripeCustomerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: `Icon: ${assetName}`,
          },
          unit_amount: 300,
        },
        quantity: 1,
      },
    ],
    metadata: {
      user_id: userId,
      asset_id: assetId,
      asset_slug: assetSlug,
    },
    success_url: `${environment.SITE_URL}/icons/${assetSlug}?success=1`,
    cancel_url: `${environment.SITE_URL}/icons/${assetSlug}?cancel=1`,
  });

  return res.status(200).json({ url: session.url });
}
