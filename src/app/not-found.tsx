import type { Metadata } from "next";

import { ComingSoon } from "@/components/site/coming-soon";

export const metadata: Metadata = {
  title: "Coming soon",
  description:
    "This part of the Jemvoyage site is still being built. Our team can help you in the meantime.",
  // A page that does not exist should not be indexed, even though we present it
  // warmly rather than as an error.
  robots: { index: false, follow: true },
};

/**
 * Catches every unmatched route.
 *
 * Next still returns HTTP 404 here, which is correct — search engines must not
 * index a page that has no content. What changes is what a person sees: a
 * branded "in development" panel rather than a bare error.
 */
export default function NotFound() {
  return (
    <ComingSoon
      eyebrow="Coming soon"
      title="This page is still under development"
      body="We are building out the full Jemvoyage platform. This section is not live yet — but our travel team can help you with anything you need right now."
    />
  );
}
