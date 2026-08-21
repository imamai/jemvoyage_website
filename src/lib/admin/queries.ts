import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/**
 * Admin dashboard aggregates.
 *
 * Uses `head: true` count queries wherever a total is all that is needed, so a
 * dashboard with thousands of rows behind it still costs a handful of index
 * scans rather than transferring the rows themselves.
 *
 * Every query runs under the caller's session, so a Fleet Manager's dashboard
 * silently returns zero for finance counts rather than leaking them.
 */

async function countOf(
  table: Parameters<Awaited<ReturnType<typeof createClient>>["from"]>[0],
  build?: (q: ReturnType<Awaited<ReturnType<typeof createClient>>["from"]>) => unknown,
): Promise<number> {
  const supabase = await createClient();
  const base = supabase.from(table).select("*", { count: "exact", head: true });
  const query = (build ? (build(base as never) as typeof base) : base) as typeof base;
  const { count, error } = await query;
  return error ? 0 : (count ?? 0);
}

export type AdminDashboard = {
  newLeads: number;
  openLeads: number;
  customers: number;
  quotesAwaiting: number;
  bookingsUpcoming: number;
  activeRentals: number;
  transfersToday: number;
  publishedTours: number;
  publishedVehicles: number;
  placeholderMedia: number;
  pendingReviews: number;
  outstandingInvoices: number;
};

export const getAdminDashboard = cache(async (): Promise<AdminDashboard> => {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

  const [
    newLeads,
    openLeads,
    customers,
    quotesAwaiting,
    bookingsUpcoming,
    activeRentals,
    transfersToday,
    publishedTours,
    publishedVehicles,
    placeholderMedia,
    pendingReviews,
    outstandingInvoices,
  ] = await Promise.all([
    supabase
      .from("jemvoyage_leads")
      .select("*", { count: "exact", head: true })
      .eq("stage", "new")
      .is("deleted_at", null),
    supabase
      .from("jemvoyage_leads")
      .select("*", { count: "exact", head: true })
      .not("stage", "in", '("completed","lost","repeat")')
      .is("deleted_at", null),
    supabase
      .from("jemvoyage_customers")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null),
    supabase
      .from("jemvoyage_quotes")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending_approval", "sent"])
      .is("deleted_at", null),
    supabase
      .from("jemvoyage_bookings")
      .select("*", { count: "exact", head: true })
      .gte("end_date", today)
      .neq("status", "cancelled")
      .is("deleted_at", null),
    supabase
      .from("jemvoyage_rentals")
      .select("*", { count: "exact", head: true })
      .in("status", ["reserved", "confirmed", "active", "overdue"])
      .is("deleted_at", null),
    supabase
      .from("jemvoyage_transfers")
      .select("*", { count: "exact", head: true })
      .gte("scheduled_at", today)
      .lt("scheduled_at", tomorrow),
    supabase
      .from("jemvoyage_tours")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .is("deleted_at", null),
    supabase
      .from("jemvoyage_vehicles")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true)
      .is("deleted_at", null),
    supabase
      .from("jemvoyage_media")
      .select("*", { count: "exact", head: true })
      .eq("is_placeholder", true)
      .is("deleted_at", null),
    supabase
      .from("jemvoyage_reviews")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .is("deleted_at", null),
    supabase
      .from("jemvoyage_invoices")
      .select("*", { count: "exact", head: true })
      .in("status", ["issued", "sent", "partially_paid", "overdue"])
      .is("deleted_at", null),
  ]);

  const n = (r: { count: number | null }) => r.count ?? 0;

  return {
    newLeads: n(newLeads),
    openLeads: n(openLeads),
    customers: n(customers),
    quotesAwaiting: n(quotesAwaiting),
    bookingsUpcoming: n(bookingsUpcoming),
    activeRentals: n(activeRentals),
    transfersToday: n(transfersToday),
    publishedTours: n(publishedTours),
    publishedVehicles: n(publishedVehicles),
    placeholderMedia: n(placeholderMedia),
    pendingReviews: n(pendingReviews),
    outstandingInvoices: n(outstandingInvoices),
  };
});

export { countOf };
