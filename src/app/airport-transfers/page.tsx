import type { Metadata } from "next";

import { getMediaByIds } from "@/lib/cms/queries";
import { createStaticClient } from "@/lib/supabase/static";
import { ServicePage } from "@/components/site/service-page";
import { Container, Section, SectionHeader } from "@/components/ui/section";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Airport transfers — JKIA, Wilson & Moi International",
  description:
    "Met on arrival at Nairobi JKIA, Wilson and Mombasa Moi International. Flights monitored, waiting time included, fixed transfer pricing.",
  alternates: { canonical: "/airport-transfers" },
};

const AIRPORTS = [
  {
    code: "NBO",
    name: "Jomo Kenyatta International",
    city: "Nairobi",
    body: "Kenya's main international gateway. We meet arrivals in the terminal with a name board and handle the walk to the vehicle.",
  },
  {
    code: "WIL",
    name: "Wilson Airport",
    city: "Nairobi",
    body: "The hub for light aircraft and domestic safari flights. Most fly-in safaris begin and end here.",
  },
  {
    code: "MBA",
    name: "Moi International",
    city: "Mombasa",
    body: "The coastal gateway, serving Diani, Watamu and the north and south coast resorts.",
  },
];

export default async function AirportTransfersPage() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("jemvoyage_media")
    .select("id")
    .contains("tags", ["airport"])
    .limit(1)
    .maybeSingle();

  const media = await getMediaByIds([data?.id]);
  const hero = [...media.values()][0] ?? null;

  return (
    <ServicePage
      eyebrow="Arrive at ease"
      title="Airport transfers"
      standfirst="Someone is waiting when you land. Flights are monitored, so an early arrival or a three-hour delay makes no difference to the plan."
      media={hero}
      crumbs={[{ label: "Home", href: "/" }, { label: "Airport transfers" }]}
      defaultService="transfer"
      intro={[
        "The first hour in a new country sets the tone for the rest of it. Our transfers are quoted as a fixed price for the route, so there is no meter and no negotiation after a long flight.",
        "We track your flight number from the moment it leaves. If you land early we are already there; if you are delayed, the waiting time is not charged to you.",
      ]}
      featuresHeading="What is included"
      features={[
        {
          title: "Flight monitoring",
          body: "We track the inbound flight and adjust the pickup automatically. You do not need to message us if you are delayed.",
        },
        {
          title: "Meet and greet",
          body: "Your driver waits inside the terminal with a name board, rather than in the car park expecting you to find them.",
        },
        {
          title: "Fixed pricing",
          body: "A quoted route price, agreed before travel. No meter, no surge, no surcharge for a night landing.",
        },
        {
          title: "Waiting time included",
          body: "Up to sixty minutes after landing on international arrivals, and thirty on domestic, at no additional cost.",
        },
        {
          title: "Child seats",
          body: "Available on request at no charge — tell us the ages when you book.",
        },
        {
          title: "Departure transfers",
          body: "We build in the buffer the route actually needs at that hour, rather than the optimistic version.",
        },
      ]}
      enquiryHeading="Book a transfer"
      enquiryBody="Give us your flight number, date and destination and we will confirm a fixed price."
    >
      <Section tone="canvas">
        <Container>
          <SectionHeader
            eyebrow="Where we meet you"
            heading="Airports we cover"
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {AIRPORTS.map((airport) => (
              <div
                key={airport.code}
                className="rounded-sm border border-border bg-surface p-6"
              >
                <p className="font-display text-3xl text-gold-500">
                  {airport.code}
                </p>
                <h3 className="mt-3 text-h3 text-brand-800">{airport.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-sand-500">
                  {airport.city}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  {airport.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </ServicePage>
  );
}
