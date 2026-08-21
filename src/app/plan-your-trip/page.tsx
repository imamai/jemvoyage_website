import type { Metadata } from "next";

import { PageHero } from "@/components/site/page-hero";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { getMediaByIds } from "@/lib/cms/queries";
import { getTours } from "@/lib/catalogue/queries";
import { Container, Section } from "@/components/ui/section";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Plan your trip",
  description:
    "Tell Jemvoyage how you like to travel and we will build an itinerary around you — safaris, tours, car hire and transfers across Kenya and East Africa.",
  alternates: { canonical: "/plan-your-trip" },
};

type Props = {
  searchParams: Promise<{ destination?: string; tour?: string; vehicle?: string }>;
};

const STEPS = [
  {
    step: "01",
    title: "Tell us the shape of it",
    body: "Dates, who is travelling, roughly what you want to spend and what matters most to you. Nothing has to be fixed yet.",
  },
  {
    step: "02",
    title: "We draft an itinerary",
    body: "A planner puts together a day-by-day route with camps, vehicles and costs itemised, usually within one working day.",
  },
  {
    step: "03",
    title: "We revise it together",
    body: "Most itineraries change two or three times before they are right. Revisions are part of the service, not an extra.",
  },
  {
    step: "04",
    title: "You confirm and travel",
    body: "A deposit secures your dates. From there the same team handles your booking, your vehicles and your journey.",
  },
];

export default async function PlanYourTripPage({ searchParams }: Props) {
  const [params, tours] = await Promise.all([searchParams, getTours({ limit: 1 })]);

  const heroMedia = await getMediaByIds([tours[0]?.media?.id]);
  const hero = [...heroMedia.values()][0] ?? null;

  return (
    <>
      <PageHero
        eyebrow="Start here"
        title="Plan your journey"
        standfirst="Every Jemvoyage trip starts as a conversation, not a checkout. Tell us how you like to travel and we will shape the rest."
        media={hero}
        crumbs={[{ label: "Home", href: "/" }, { label: "Plan your trip" }]}
      />

      <Section tone="surface">
        <Container>
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((item) => (
              <li key={item.step}>
                <p aria-hidden className="font-display text-3xl text-gold-500/70">
                  {item.step}
                </p>
                <h2 className="mt-3 text-h3 text-brand-800">{item.title}</h2>
                <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="canvas">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-h2 text-brand-800">Tell us about your trip</h2>
            <p className="mt-3 text-lead text-fg-muted">
              There are no wrong answers here — leave anything blank that you have
              not decided yet.
            </p>
            <div className="mt-10 rounded-sm border border-border bg-surface p-6 md:p-8">
              <EnquiryForm
                variant="full"
                submitLabel="Send my brief"
                destinationSlug={params.destination}
                tourSlug={params.tour}
                vehicleSlug={params.vehicle}
              />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
