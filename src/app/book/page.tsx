import type { Metadata } from "next";

import { ComingSoon } from "@/components/site/coming-soon";

export const metadata: Metadata = {
  title: "Book online",
  description:
    "Online booking and payment are in development. In the meantime our team confirms every booking directly.",
  robots: { index: false, follow: true },
};

/**
 * Online checkout depends on the payment module (M-Pesa STK push, callback
 * verification and reconciliation), which is deliberately not wired yet — a
 * half-built payment flow is worse than none. Enquiries and quotations are
 * fully live, so this points there rather than dead-ending.
 */
export default function BookPage() {
  return (
    <ComingSoon
      eyebrow="Online booking"
      title="Online booking is on its way"
      body="We are building payment properly rather than quickly. Today, every Jemvoyage booking is confirmed by a person — request a quotation and we will take you through it from there."
      primaryLabel="Request a quotation"
      primaryHref="/quote"
      secondaryLabel="Plan my trip"
      secondaryHref="/plan-your-trip"
    />
  );
}
