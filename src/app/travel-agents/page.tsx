import type { Metadata } from "next";

import { getDestinations } from "@/lib/catalogue/queries";
import { ServicePage } from "@/components/site/service-page";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "For travel agents & tour operators",
  description:
    "Partner with Jemvoyage as a travel agent or tour operator — net rates, commission, ground handling and a dedicated contact in Kenya.",
  alternates: { canonical: "/travel-agents" },
};

export default async function TravelAgentsPage() {
  const destinations = await getDestinations({ featuredOnly: true, limit: 1 });

  return (
    <ServicePage
      eyebrow="Partner with us"
      title="Travel agents & operators"
      standfirst="Ground handling in Kenya for agents and operators who need a reliable partner rather than a reseller."
      media={destinations[0]?.heroMedia ?? null}
      crumbs={[{ label: "Home", href: "/" }, { label: "Travel agents" }]}
      defaultService="custom"
      intro={[
        "We work with agents and operators who sell Kenya but do not want to run it themselves. You keep the client relationship; we handle the ground — vehicles, drivers, guides, camps, park fees and the day-to-day of the itinerary.",
        "Approved partners get net rates rather than a discount off retail, so you set your own margin. Commission terms, credit limits and access are agreed before your first booking.",
      ]}
      featuresHeading="What partners get"
      featuresEyebrow="B2B"
      features={[
        {
          title: "Net rates",
          body: "Confidential net pricing on tours, transfers and vehicle hire. You decide what you sell it for.",
        },
        {
          title: "Commission or margin",
          body: "Work on commission against our published rates, or on net rates and your own mark-up — whichever suits your model.",
        },
        {
          title: "A named contact",
          body: "One person who knows your account and your clients, rather than a shared inbox.",
        },
        {
          title: "Ground handling",
          body: "Meet and greet, vehicles, drivers, guides, park fees, camp bookings and the running of the itinerary.",
        },
        {
          title: "Credit terms",
          body: "Approved partners can move to credit terms with monthly statements rather than paying per booking.",
        },
        {
          title: "Quotation support",
          body: "Itemised quotations in your client's currency, turned around quickly enough to be useful in a live conversation.",
        },
      ]}
      enquiryHeading="Apply for a partner account"
      enquiryBody="Tell us about your agency and the kind of Kenya programmes you sell."
    />
  );
}
