import type { Metadata } from "next";

import { ComingSoon } from "@/components/site/coming-soon";

export const metadata: Metadata = {
  title: "My account",
  description:
    "The Jemvoyage customer portal is in development. Your trips, quotes, invoices and documents will live here.",
  robots: { index: false, follow: true },
};

/**
 * The customer portal depends on the booking, payment and document modules,
 * which have schema but no UI yet. Until then this is honest about its state
 * rather than showing an empty dashboard.
 *
 * Note: `/account` is already gated by the auth proxy, so a signed-out visitor
 * is redirected to sign-in before reaching this page.
 */
export default function AccountPage() {
  return (
    <ComingSoon
      eyebrow="Customer portal"
      title="Your account is coming soon"
      body="Your trips, rentals, quotations, invoices and travel documents will all live here. While we finish building it, your travel planner has everything and can send you anything you need."
      primaryLabel="Talk to our team"
      primaryHref="/contact"
      secondaryLabel="Back to home"
      secondaryHref="/"
    />
  );
}
