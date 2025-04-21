// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.30.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
console.log("Hello from Functions!");
const supabase = createClient(
  supabaseUrl,
  supabaseKey,
);

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { id, email_addresses, first_name, image_url } =
      (await req.json()).data;
    const email = email_addresses[0].email_address;
    const { data, error } = await supabase.from("users").insert({
      id,
      email,
      first_name,
      image_url,
    });
    if (error) {
      console.error("Error inserting user:", error);
      return new Response(JSON.stringify({ error: "Failed to insert user" ,}), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    console.error("Error parsing request:", error);
    return new Response(JSON.stringify({ error: "Failed to parse request" }), {
      status: 400,
    });
  }
});


