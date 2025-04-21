import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/clerk-expo";

export function useSupabaseClient() {
  const { session } = useSession();
  console.log("SupabaseClient Initialized");
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      async accessToken() {
        return session?.getToken() ?? null;
      },
    },
  );
}

// Use this hook in your React components
// export const client = createClerkSupabaseClient(); // This won't work
