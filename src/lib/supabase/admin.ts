import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { publicEnv, getServerEnv } from "@/lib/env";
import type { Database } from "@/lib/db/types";

/**
 * Service-role client. BYPASSES ALL ROW LEVEL SECURITY.
 *
 * `edos_websites` is a shared project: this key can read and write margaret_*,
 * kida_*, mejasan_* and emiwama_* data just as easily as ours. Two guard rails
 * exist to make misuse hard:
 *
 *   1. `server-only` makes importing this from a Client Component a build error.
 *   2. The `Database` type declares ONLY jemvoyage_* tables, so `.from("...")`
 *      on another app's table fails to typecheck.
 *
 * Reach for this only where RLS genuinely cannot express the rule:
 *   • M-Pesa / payment webhooks, which arrive with no user session
 *   • scheduled jobs (document-expiry alerts, review requests)
 *   • admin operations that must span users, e.g. reassigning a driver
 *
 * Everything else should use `@/lib/supabase/server`, which respects RLS.
 */
export function createAdminClient() {
  const { SUPABASE_SERVICE_ROLE_KEY } = getServerEnv();

  return createSupabaseClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: { "x-jemvoyage-client": "service-role" },
      },
    },
  );
}
