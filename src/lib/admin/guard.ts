import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { JemvoyageUser } from "@/lib/db/types";

/**
 * Admin authorisation.
 *
 * These helpers decide what the UI *renders*. They are not the security
 * boundary — RLS is. Every table an admin page touches enforces the same
 * permission server-side, so a missing guard here would hide a control but
 * could never grant access to data.
 */

export type AdminContext = {
  user: JemvoyageUser;
  permissions: Set<string>;
  isSuperAdmin: boolean;
  can: (permission: string) => boolean;
};

export const getAdminContext = cache(async (): Promise<AdminContext | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileResult, permissionsResult, superAdminResult, staffResult] =
    await Promise.all([
      supabase.from("jemvoyage_users").select("*").eq("id", user.id).maybeSingle(),
      supabase.rpc("jemvoyage_my_permissions"),
      supabase.rpc("jemvoyage_is_super_admin"),
      supabase.rpc("jemvoyage_is_staff"),
    ]);

  const profile = profileResult.data;
  if (!profile || !profile.is_active || profile.deleted_at) return null;

  const isSuperAdmin = superAdminResult.data === true;
  const isStaff = staffResult.data === true;
  if (!isStaff && !isSuperAdmin) return null;

  const permissions = new Set<string>(
    Array.isArray(permissionsResult.data) ? permissionsResult.data : [],
  );

  return {
    user: profile,
    permissions,
    isSuperAdmin,
    // Super admin holds every permission implicitly, matching
    // jemvoyage_has_permission() in the database.
    can: (permission: string) => isSuperAdmin || permissions.has(permission),
  };
});

/**
 * Gate an admin page. Redirects rather than throwing, so an ordinary customer
 * who guesses a /admin URL lands somewhere sensible instead of on an error.
 */
export async function requireAdmin(permission?: string): Promise<AdminContext> {
  const context = await getAdminContext();

  if (!context) redirect("/sign-in?next=/admin");
  if (permission && !context.can(permission)) redirect("/admin/no-access");

  return context;
}
