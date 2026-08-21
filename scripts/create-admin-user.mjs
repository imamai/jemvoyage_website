/**
 * Creates (or repairs) the dedicated Jemvoyage administrator auth account.
 *
 * Uses the service role because auth.admin.createUser is a privileged endpoint;
 * this runs from an operator's machine, never from application code. The
 * `app: 'jemvoyage'` metadata is what gates our signup trigger, and full_name
 * is mandatory because the other apps' triggers on this shared auth.users table
 * write NOT NULL profile columns from it.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const [email, password, fullName] = process.argv.slice(2);
if (!email || !password) {
  console.error("usage: node scripts/create-admin-user.mjs <email> <password> [fullName]");
  process.exit(1);
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const name = fullName || "Jemvoyage Administrator";

const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
const existing = list?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

let userId;
if (existing) {
  const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
    user_metadata: { ...existing.user_metadata, app: "jemvoyage", full_name: name },
  });
  if (error) { console.error("update failed:", error.message); process.exit(1); }
  userId = data.user.id;
  console.log("updated existing auth user:", email);
} else {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { app: "jemvoyage", full_name: name },
  });
  if (error) { console.error("create failed:", error.message); process.exit(1); }
  userId = data.user.id;
  console.log("created auth user:", email);
}

console.log("user id:", userId);
