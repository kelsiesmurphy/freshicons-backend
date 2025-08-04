import Stripe from "stripe";
import { ZuploRequest } from "@zuplo/runtime";
import { supabase } from "./lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function (req: ZuploRequest, res) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return res.status(400).send("Webhook Error");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.user_id;
    const assetId = session.metadata?.asset_id;
    const pricePence = session.amount_total;
    const currency = session.currency;
    const paymentIntent = session.payment_intent;

    if (userId && assetId) {
      await supabase.from("purchases").insert({
        user_id: userId,
        asset_id: assetId,
        stripe_payment_intent: paymentIntent,
        price_pence: pricePence,
        currency,
      });
    }
  }

  return res.status(200).send("ok");
}
