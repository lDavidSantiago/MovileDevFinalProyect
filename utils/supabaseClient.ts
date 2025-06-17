/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from "@supabase/supabase-js";
import type { Clerk } from "@clerk/clerk-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

declare global {
  interface Clerk {
    session?: {
      getToken: (options: { template: string }) => Promise<string>;
    };
  }
}
function createClerkSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options = {}) => {
        console.log("Supabase client initialized with URL:", url);
        const clerkToken = await window.Clerk?.session?.getToken?.({
          template: "supabase",
        });
        //Constructing the headers with the token
        const headers = new Headers(options?.headers);
        headers.set("Authorization", `Bearer ${clerkToken}`);
        console.log("Supabase client initialized with URL:", url);

        return fetch(url, {
          ...options,
          headers,
        });
      },
    },
  });
}

export const client = createClerkSupabaseClient();
