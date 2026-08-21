import type { Metadata } from "next";

import { getTours } from "@/lib/catalogue/queries";
import { PageHero } from "@/components/site/page-hero";
import { TourCard } from "@/components/catalogue/tour-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHeader } from "@/components/ui/section";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Kenya safaris",
  description:
    "Safari itineraries across the Maasai Mara, Amboseli, Tsavo and Samburu — private conservancies, fly-in camps and classic game-viewing circuits.",
  alternates: { canonical: "/safaris" },
};

/** Categories that constitute a safari rather than a coast or city itinerary. */
const SAFARI_CATEGORIES = new Set([
  "luxury-safari",
  "family-safari",
  "wildlife",
  "photography",
  "fly-in",
  "beach-safari",
]);

export default async function SafarisPage() {
  const allTours = await getTours();
  const safaris = allTours.filter(
    (t) => t.category && SAFARI_CATEGORIES.has(t.category.slug),
  );

  return (
    <>
      <PageHero
        eyebrow="Into the wild"
        title="Signature safaris"
        standfirst="Game drives at the hours that matter, guides who know the ground, and camps chosen because we have stayed in them."
        media={safaris[0]?.media ?? allTours[0]?.media ?? null}
        crumbs={[{ label: "Home", href: "/" }, { label: "Safaris" }]}
      />

      <Section tone="canvas">
        <Container>
          <SectionHeader
            eyebrow="Itineraries"
            heading="Safari journeys"
            subheading="Each of these can be run privately, extended, or reshaped around your dates."
            action={
              <ButtonLink href="/plan-your-trip" variant="outline">
                Design your own
              </ButtonLink>
            }
          />

          {safaris.length === 0 ? (
            <div className="mx-auto mt-10 max-w-lg rounded-sm border border-border bg-surface p-10 text-center">
              <h3 className="text-h3 text-brand-800">
                Safari itineraries coming shortly
              </h3>
              <p className="mt-3 text-sm text-fg-muted">
                Tell us when you want to travel and what you hope to see, and we
                will build something around it.
              </p>
              <ButtonLink href="/plan-your-trip" className="mt-6">
                Plan my safari
              </ButtonLink>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {safaris.map((tour, i) => (
                <TourCard key={tour.id} tour={tour} priority={i < 3} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section tone="inverse">
        <Container>
          <SectionHeader
            eyebrow="When to go"
            heading="Timing a Kenyan safari"
            tone="onDark"
          />
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                period: "July – October",
                body: "Migration season in the Mara. The busiest and most expensive window, and the only reliable time for river crossings. Book well ahead.",
              },
              {
                period: "January – February",
                body: "Hot, dry and clear. Excellent general game viewing with thinner crowds, and the best light for photography.",
              },
              {
                period: "March – May",
                body: "The long rains. Green, quiet and much cheaper, though some tracks become difficult and a few camps close.",
              },
              {
                period: "November – December",
                body: "Short rains, then clearing. Good value before the December holidays, when rates and occupancy rise sharply.",
              },
            ].map((item) => (
              <div key={item.period}>
                <h3 className="text-h3 text-gold-300">{item.period}</h3>
                <p className="mt-3 text-sm leading-relaxed text-sand-300">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
