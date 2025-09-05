// lib/supabaseClient.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let browserSupabase: SupabaseClient | null = null;

/**
 * Returns a Supabase client only in the browser.
 * On the server this returns null to avoid calling createClient during SSR/build.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") {
    // running on server / build — do not create client
    return null;
  }

  if (browserSupabase) return browserSupabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    // warn instead of throwing — caller will handle null
    // During local dev you should have .env.local with these values
    // On Vercel set them under Project → Settings → Environment Variables
    console.warn("Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return null;
  }

  browserSupabase = createClient(url, anon);
  return browserSupabase;
}
