import type { Metadata } from "next";

import { getDestinations } from "@/lib/catalogue/queries";
import { getFaqs } from "@/lib/cms/queries";
import { PageHero } from "@/components/site/page-hero";
import { DestinationCard } from "@/components/catalogue/destination-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHeader } from "@/components/ui/section";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Kenya travel guide",
  description:
    "Practical guidance for travelling in Kenya — when to go, entry requirements, health, money, driving and connectivity.",
  alternates: { canonical: "/travel-guide" },
};

const PRACTICALITIES = [
  {
    title: "Entry requirements",
    body: "Most visitors need an approved electronic travel authorisation before boarding, applied for online in advance. Requirements change, so confirm against the official Kenyan government source close to your travel date — we will flag anything we know of when you book.",
  },
  {
    title: "Health",
    body: "Yellow fever certification may be required depending on where you are arriving from. Malaria prophylaxis is commonly advised for the coast and the lower-lying parks. Speak to a travel clinic six to eight weeks before departure.",
  },
  {
    title: "Money",
    body: "The Kenyan shilling is the local currency. M-Pesa is used almost universally, and cards are accepted at hotels, camps and larger restaurants. Carry some cash for tips, markets and park gates.",
  },
  {
    title: "Driving",
    body: "Kenya drives on the left. Visitors should carry an International Driving Permit alongside their home licence. A 4x4 is strongly recommended for parks and unsealed roads, and essential during the rains.",
  },
  {
    title: "Connectivity",
    body: "Mobile coverage is good in towns and along main roads, and patchy inside the parks. Most camps have wifi in public areas. A local SIM is inexpensive and worth getting on arrival.",
  },
  {
    title: "What to pack",
    body: "Neutral colours for game drives, a warm layer for early mornings at altitude, sun protection, and soft bags rather than hard cases if any leg of your trip is by light aircraft.",
  },
];

export default async function TravelGuidePage() {
  const [destinations, faqs] = await Promise.all([
    getDestinations({ limit: 6 }),
    getFaqs(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Before you go"
        title="Kenya travel guide"
        standfirst="The practical detail — timing, entry, health, money and driving — set out plainly so there are no surprises."
        media={destinations[0]?.heroMedia ?? null}
        crumbs={[{ label: "Home", href: "/" }, { label: "Travel guide" }]}
      />

      <Section tone="canvas">
        <Container>
          <SectionHeader
            eyebrow="Practicalities"
            heading="What to know before you travel"
            subheading="Requirements change from time to time. We confirm the current position for your nationality and dates when you book."
          />
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {PRACTICALITIES.map((item) => (
              <div key={item.title}>
                <h3 className="text-h3 text-brand-800">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {destinations.length > 0 ? (
        <Section tone="sunken">
          <Container>
            <SectionHeader
              eyebrow="Where to go"
              heading="Destination guides"
              action={
                <ButtonLink href="/destinations" variant="outline">
                  All destinations
                </ButtonLink>
              }
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {faqs.length > 0 ? (
        <Section tone="surface">
          <Container>
            <SectionHeader
              eyebrow="Common questions"
              heading="Frequently asked"
              action={
                <ButtonLink href="/faq" variant="outline">
                  Full FAQ
                </ButtonLink>
              }
            />
            <div className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
              {faqs.slice(0, 5).map((faq) => (
                <details key={faq.id} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
                    <span className="font-display text-lg text-brand-800">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden
                      className="shrink-0 text-2xl leading-none text-gold-500 transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
