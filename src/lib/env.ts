import { z } from "zod";

/**
 * Fail fast on misconfiguration rather than at the first query.
 *
 * Split deliberately into two schemas: `publicEnv` is safe to reference from
 * anywhere, `serverEnv` is only ever read inside server-only modules. Keeping
 * them apart is what stops a service-role key drifting into a bundle.
 */

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SITE_NAME: z.string().default("Jemvoyage"),
  NEXT_PUBLIC_DEFAULT_CURRENCY: z.string().default("KES"),
});

// Next.js inlines NEXT_PUBLIC_* only for literal property access, so these
// cannot be read from a dynamic loop over process.env.
const parsedPublic = publicSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_DEFAULT_CURRENCY: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY,
});

if (!parsedPublic.success) {
  throw new Error(
    `Invalid public environment configuration:\n${parsedPublic.error.issues
      .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
      .join("\n")}\n\nCopy .env.example to .env.local and fill it in.`,
  );
}

export const publicEnv = parsedPublic.data;

/**
 * Server-only secrets. Call this from server modules; it throws if invoked in a
 * browser bundle, which surfaces an accidental client import immediately.
 */
export function getServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() was called in the browser. This is a bug.");
  }

  const serverSchema = z.object({
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  });

  const parsed = serverSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid server environment configuration:\n${parsed.error.issues
        .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
        .join("\n")}`,
    );
  }

  return parsed.data;
}
