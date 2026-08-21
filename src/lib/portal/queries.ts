import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type {
  JemvoyageBooking,
  JemvoyageCustomer,
  JemvoyageInvoice,
  JemvoyagePayment,
  JemvoyageQuote,
  JemvoyageRental,
} from "@/lib/db/types";

/**
 * Customer portal reads.
 *
 * These deliberately use the cookie-based client: every query below is scoped
 * to the signed-in person by RLS (`jemvoyage_owns_customer`), so the session
 * must travel with the request. Nothing here filters by customer id in
 * application code — the database does it, which means a bug in this file
 * cannot leak another customer's data.
 */

/** The customer record linked to the signed-in user, if one exists. */
export const getMyCustomer = cache(async (): Promise<JemvoyageCustomer | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("jemvoyage_customers")
    .select("*")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  return data ?? null;
});

export const getMyBookings = cache(async (): Promise<JemvoyageBooking[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jemvoyage_bookings")
    .select("*")
    .is("deleted_at", null)
    .order("start_date", { ascending: false });
  return data ?? [];
});

export const getMyQuotes = cache(async (): Promise<JemvoyageQuote[]> => {
  const supabase = await createClient();
  // RLS additionally hides drafts and internal pricing from customers.
  const { data } = await supabase
    .from("jemvoyage_quotes")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  return data ?? [];
});

export const getMyRentals = cache(async (): Promise<JemvoyageRental[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jemvoyage_rentals")
    .select("*")
    .is("deleted_at", null)
    .order("starts_at", { ascending: false });
  return data ?? [];
});

export const getMyInvoices = cache(async (): Promise<JemvoyageInvoice[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jemvoyage_invoices")
    .select("*")
    .is("deleted_at", null)
    .order("issue_date", { ascending: false });
  return data ?? [];
});

export const getMyPayments = cache(async (): Promise<JemvoyagePayment[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jemvoyage_payments")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
});

export type PortalSummary = {
  upcomingTrips: number;
  activeRentals: number;
  openQuotes: number;
  balanceDue: number;
  currency: string;
};

export const getPortalSummary = cache(async (): Promise<PortalSummary> => {
  const [bookings, rentals, quotes, invoices] = await Promise.all([
    getMyBookings(),
    getMyRentals(),
    getMyQuotes(),
    getMyInvoices(),
  ]);

  const today = new Date().toISOString().slice(0, 10);

  return {
    upcomingTrips: bookings.filter(
      (b) => b.end_date >= today && b.status !== "cancelled",
    ).length,
    activeRentals: rentals.filter((r) =>
      ["reserved", "confirmed", "active", "overdue"].includes(r.status),
    ).length,
    openQuotes: quotes.filter((q) => ["sent", "accepted"].includes(q.status)).length,
    balanceDue: invoices
      .filter((i) => !["paid", "cancelled", "void"].includes(i.status))
      .reduce((sum, i) => sum + Number(i.balance_due ?? 0), 0),
    currency: invoices[0]?.currency ?? "KES",
  };
});
