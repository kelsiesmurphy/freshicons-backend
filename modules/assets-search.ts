import { ZuploRequest, ZuploContext } from "@zuplo/runtime";
import { supabase } from "./lib/supabase";

export default async function (req: ZuploRequest, ctx: ZuploContext) {
  const url = new URL(req.url);

  const q = url.searchParams.get("q")?.toLowerCase() || "";
  const type = url.searchParams.get("type") || null;
  const featured = url.searchParams.get("featured") === "true";
  const sort = url.searchParams.get("sort") || null;

  let query = supabase.from("assets").select("*");

  if (q) {
    query = query.or(
      `name.ilike.%${q}%,description.ilike.%${q}%,tags.cs.{${q}}`
    );
  }

  if (type) {
    query = query.eq("type", type);
  }

  if (featured) {
    query = query.eq("featured", true);
  }

  if (sort === "new") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("name", { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return data;
}
