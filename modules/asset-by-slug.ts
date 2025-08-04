import { ZuploRequest } from "@zuplo/runtime";
import { supabase } from "./lib/supabase";

export default async function (req: ZuploRequest) {
  const url = new URL(req.url);

  let query = supabase
    .from("assets")
    .select("*")
    .eq("slug", url.pathname.split("/").pop())
    .limit(1)
    .single();

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return data;
}
