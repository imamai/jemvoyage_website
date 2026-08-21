import type { Metadata } from "next";

import { getMediaByIds } from "@/lib/cms/queries";
import { createClient } from "@/lib/supabase/server";
import { ServicePage } from "@/components/site/service-page";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Corporate travel & executive transport in Kenya",
  description:
    "Corporate accounts for travel management, executive transport, airport transfers and long-term vehicle hire in Kenya. Monthly billing, approved users and spending limits.",
  alternates: { canonical: "/corporate-travel" },
};

export default async function CorporateTravelPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jemvoyage_media")
    .select("id")
    .contains("tags", ["corporate"])
    .limit(1)
    .maybeSingle();

  const media = await getMediaByIds([data?.id]);
  const hero = [...media.values()][0] ?? null;

  return (
    <ServicePage
      eyebrow="For business"
      title="Corporate travel"
      standfirst="One account for executive transport, airport transfers, long-term hire and staff travel — billed monthly, reconciled properly."
      media={hero}
      crumbs={[{ label: "Home", href: "/" }, { label: "Corporate travel" }]}
      defaultService="corporate"
      intro={[
        "Companies, NGOs and government bodies use Jemvoyage for the same reason: booking transport one trip at a time does not scale, and neither does chasing receipts afterwards.",
        "A corporate account gives your team a single point of booking, an approval step where you want one, and a monthly statement that reconciles against your own records rather than a pile of individual invoices.",
      ]}
      featuresHeading="How a corporate account works"
      featuresEyebrow="Account management"
      features={[
        {
          title: "Approved users",
          body: "You nominate who may book. Each person can carry their own spending limit and cost centre, so the account stays controlled without a bottleneck.",
        },
        {
          title: "Approval workflow",
          body: "Bookings above a threshold you set route to a named approver before they are confirmed.",
        },
        {
          title: "Monthly billing",
          body: "Credit terms, one consolidated statement, and per-booking detail behind it. No paying by card at the roadside.",
        },
        {
          title: "Executive transport",
          body: "Chauffeur-driven saloons for visitors and senior staff, with the same driver held across a visit where you want continuity.",
        },
        {
          title: "Long-term hire",
          body: "Weekly and monthly rates for project vehicles, with maintenance and replacement handled by us rather than by your operations team.",
        },
        {
          title: "Reporting",
          body: "Spend by cost centre, by employee and by service, exportable for your own finance system.",
        },
      ]}
      enquiryHeading="Open a corporate account"
      enquiryBody="Tell us roughly what your organisation needs and we will come back with terms."
    />
  );
}
