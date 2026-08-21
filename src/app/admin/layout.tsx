import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Jemvoyage Admin" },
  robots: { index: false, follow: false },
};

/**
 * Guards the whole /admin tree in one place. `getAdminContext` is wrapped in
 * React `cache`, so the pages below re-use this lookup rather than repeating it.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <>{children}</>;
}
