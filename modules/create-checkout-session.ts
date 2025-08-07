import Stripe from "stripe";
import { supabase } from "./lib/supabase";
import { environment } from "@zuplo/runtime";

const stripe = new Stripe(environment.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

async function getAssetById(id: string) {
  const { data, error } = await supabase
    .from("assets")
    .select(
      "id, type, name, description, slug, price_pence, currency, preview_url"
    )
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export default async function handler(request: Request) {
  try {
    const origin = request.headers.get("origin") || environment.SITE_URL;
    if (!origin) {
      throw new Error("Missing origin header");
    }

    const { assetID } = await request.json();
    if (!assetID) {
      return new Response(
        JSON.stringify({ error: "Missing assetID in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const icon = await getAssetById(assetID);
    if (!icon) {
      return new Response(JSON.stringify({ error: "Icon not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: icon.currency,
            product_data: {
              name: icon.name,
              description: icon.description,
              images: [icon.preview_url],
            },
            unit_amount: icon.price_pence,
          },
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: { assetID: icon.id },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
