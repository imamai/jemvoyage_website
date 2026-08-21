import type { Metadata } from "next";

import { getDestinations } from "@/lib/catalogue/queries";
import { PageHero } from "@/components/site/page-hero";
import { DestinationCard } from "@/components/catalogue/destination-card";
import { Container, Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Destinations in Kenya & East Africa",
  description:
    "The Maasai Mara, Amboseli, Tsavo, Samburu, the Rift Valley lakes and the Indian Ocean coast — where to go in Kenya, and when.",
  alternates: { canonical: "/destinations" },
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <>
      <PageHero
        eyebrow="Where to go"
        title="Destinations"
        standfirst="Kenya packs an unusual amount into a short flight: open savannah, high forest, Rift Valley lakes and a coral coastline."
        media={destinations[0]?.heroMedia ?? null}
        crumbs={[{ label: "Home", href: "/" }, { label: "Destinations" }]}
      />

      <Section tone="canvas">
        <Container>
          {destinations.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-sm border border-border bg-surface p-10 text-center">
              <h2 className="text-h3 text-brand-800">
                Destinations are being published
              </h2>
              <p className="mt-3 text-sm text-fg-muted">
                In the meantime, tell us where you would like to go and we will
                take it from there.
              </p>
              <ButtonLink href="/plan-your-trip" className="mt-6">
                Plan my trip
              </ButtonLink>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((destination, i) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  priority={i < 3}
                />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
