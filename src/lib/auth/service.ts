import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { JemvoyageRoleName, JemvoyageUser } from "@/lib/db/types";

/**
 * Jemvoyage auth boundary.
 *
 * ── Why signUp is wrapped rather than called directly ────────────────────────
 * `auth.users` in this shared project carries four other applications' signup
 * triggers. Two of them (margaret_handle_new_user, kida_handle_new_user) insert
 * into a profile table whose `full_name` column is NOT NULL, populating it with
 * `coalesce(raw_user_meta_data->>'full_name', new.email)` and no exception
 * guard. If both are null the insert violates NOT NULL and the whole signup
 * transaction fails — for every app, not just ours.
 *
 * We were asked not to modify those triggers, so the invariant is enforced here
 * instead: Jemvoyage never creates an auth user without a non-empty full_name
 * AND an email. Route every signup through this module.
 */

export class JemvoyageSignUpError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JemvoyageSignUpError";
  }
}

type SignUpInput = {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
};

export async function signUp({ email, password, fullName, phone }: SignUpInput) {
  const trimmedName = fullName?.trim();
  const trimmedEmail = email?.trim();

  // Not cosmetic validation — see the module comment. Blank values here break
  // signup for all five applications sharing this auth.users table.
  if (!trimmedName) {
    throw new JemvoyageSignUpError("A full name is required to create an account.");
  }
  if (!trimmedEmail) {
    throw new JemvoyageSignUpError("An email address is required to create an account.");
  }

  const supabase = await createClient();

  return supabase.auth.signUp({
    email: trimmedEmail,
    password,
    options: {
      data: {
        // `app` gates jemvoyage_handle_new_user(); without it our trigger is a
        // no-op and the account gets no jemvoyage_users row.
        app: "jemvoyage",
        full_name: trimmedName,
        ...(phone?.trim() ? { phone: phone.trim() } : {}),
      },
    },
  });
}

/**
 * Idempotent backstop for the signup trigger.
 *
 * jemvoyage_handle_new_user() deliberately swallows its own errors so a fault
 * on our side can never roll back another app's signup. That means a
 * jemvoyage_users row can, in principle, be missing. Calling this on first
 * authenticated request makes the gap self-healing.
 */
export async function ensureJemvoyageUser(): Promise<JemvoyageUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: existing } = await supabase
    .from("jemvoyage_users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing;

  const metadata = user.user_metadata ?? {};
  const fullName =
    (typeof metadata.full_name === "string" && metadata.full_name.trim()) ||
    user.email ||
    "Jemvoyage Guest";

  const { data: created, error } = await supabase
    .from("jemvoyage_users")
    .insert({
      id: user.id,
      full_name: fullName,
      email: user.email ?? null,
      phone: typeof metadata.phone === "string" ? metadata.phone : null,
    })
    .select()
    .single();

  // RLS only lets users.manage holders INSERT here, so a self-heal by an
  // ordinary customer will be denied. That is intentional: the trigger is the
  // primary path and this is a diagnostic backstop, not a privilege hole.
  if (error) return null;

  return created;
}

export async function getCurrentUser(): Promise<JemvoyageUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("jemvoyage_users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return data ?? null;
}

export async function getMyPermissions(): Promise<Set<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("jemvoyage_my_permissions");
  if (error || !data) return new Set();
  return new Set(data);
}

export async function hasRole(role: JemvoyageRoleName): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("jemvoyage_has_role", {
    p_role: role,
  });
  return !error && data === true;
}

export async function isStaff(): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("jemvoyage_is_staff");
  return !error && data === true;
}

export async function signOut() {
  const supabase = await createClient();
  return supabase.auth.signOut();
}
