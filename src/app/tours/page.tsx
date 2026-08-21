import type { Metadata } from "next";

import { getTourCategories, getTours } from "@/lib/catalogue/queries";
import { getMediaByIds } from "@/lib/cms/queries";
import { PageHero } from "@/components/site/page-hero";
import { TourCard } from "@/components/catalogue/tour-card";
import { Container, Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tours & safaris in Kenya",
  description:
    "Browse Jemvoyage tours and safaris across Kenya — the Maasai Mara, Amboseli, Tsavo, Samburu and the Indian Ocean coast. Private and small-group itineraries.",
  alternates: { canonical: "/tours" },
};

export default async function ToursPage() {
  const [tours, categories] = await Promise.all([
    getTours(),
    getTourCategories(),
  ]);

  const heroMedia = await getMediaByIds([
    tours.find((t) => t.is_featured)?.media?.id ?? tours[0]?.media?.id,
  ]);
  const hero = [...heroMedia.values()][0] ?? null;

  return (
    <>
      <PageHero
        eyebrow="Curated journeys"
        title="Tours & safaris"
        standfirst="Every itinerary below is a starting point. Tell us how you like to travel and we will reshape any of them around you."
        media={hero}
        crumbs={[{ label: "Home", href: "/" }, { label: "Tours" }]}
      />

      {categories.length > 0 ? (
        <Section tone="surface" className="py-8 md:py-10">
          <Container>
            <h2 className="sr-only">Browse by category</h2>
            <ul className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <ButtonLink
                    href={`/tours/category/${category.slug}`}
                    variant="ghost"
                    size="sm"
                    className="border border-border"
                  >
                    {category.name}
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section tone="canvas">
        <Container>
          {tours.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-sm border border-border bg-surface p-10 text-center">
              <h2 className="text-h3 text-brand-800">No tours published yet</h2>
              <p className="mt-3 text-sm text-fg-muted">
                Our itineraries are being finalised. Tell us what you have in mind
                and we will build something for you directly.
              </p>
              <ButtonLink href="/plan-your-trip" className="mt-6">
                Plan my trip
              </ButtonLink>
            </div>
          ) : (
            <>
              <p className="mb-8 text-sm text-fg-muted">
                Showing {tours.length} {tours.length === 1 ? "itinerary" : "itineraries"}
              </p>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {tours.map((tour, i) => (
                  <TourCard key={tour.id} tour={tour} priority={i < 3} />
                ))}
              </div>
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
