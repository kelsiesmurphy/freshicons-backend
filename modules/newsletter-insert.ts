import { ZuploRequest } from "@zuplo/runtime";
import { supabase } from "./lib/supabase";

export default async function (req: ZuploRequest) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
    });
  }

  const email = body?.email;

  if (!email || typeof email !== "string") {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
    });
  }

  const { data, error } = await supabase
    .from("newsletter")
    .insert([{ email: email }])
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ data }), {
    status: 200,
  });
}
