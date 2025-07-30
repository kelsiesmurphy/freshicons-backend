import { ZuploRequest, ZuploContext } from "@zuplo/runtime";
import { verifyClerkJWT } from "./lib/verifyClerkJWT";
import { supabase } from "./lib/supabase";

export default async function (req: ZuploRequest, ctx: ZuploContext) {
  try {
    const auth = req.headers.get("Authorization");
    const { userId } = await verifyClerkJWT(auth);

    const assetId = ctx.params.id;

    const { data: purchase } = await supabase
      .from("purchases")
      .select("*")
      .eq("user_id", userId)
      .eq("asset_id", assetId)
      .maybeSingle();

    if (!purchase) return new Response(JSON.stringify({ error: "Not purchased" }), { status: 403 });

    const { data: asset } = await supabase
      .from("assets")
      .select("file_url")
      .eq("id", assetId)
      .maybeSingle();

    if (!asset) return new Response(JSON.stringify({ error: "Asset not found" }), { status: 404 });

    return { url: asset.file_url };
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 401 });
  }
}
