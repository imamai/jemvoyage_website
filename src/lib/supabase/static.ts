import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { publicEnv } from "@/lib/env";
import type { Database } from "@/lib/db/types";

/**
 * Request-free Supabase client, for code that runs outside an HTTP request:
 * `generateStaticParams`, `sitemap()`, and build-time data collection.
 *
 * `@/lib/supabase/server` cannot be used there — it reads `cookies()`, which
 * throws at build time. This client carries the anon key and no session, so it
 * sees exactly what a signed-out visitor sees: published, non-private rows only,
 * enforced by RLS. It is NOT a way around row level security.
 */
export function createStaticClient() {
  return createSupabaseClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
