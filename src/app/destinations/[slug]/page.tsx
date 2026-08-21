import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllDestinationSlugs,
  getDestinationBySlug,
  getTours,
} from "@/lib/catalogue/queries";
import { publicEnv } from "@/lib/env";
import { PageHero } from "@/components/site/page-hero";
import { TourCard } from "@/components/catalogue/tour-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeader } from "@/components/ui/section";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return { title: "Destination not found" };

  return {
    title: `${destination.name} — safaris & travel guide`,
    description: destination.summary ?? undefined,
    alternates: { canonical: `/destinations/${destination.slug}` },
    openGraph: {
      type: "article",
      title: destination.name,
      description: destination.summary ?? undefined,
    },
  };
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) notFound();

  const tours = await getTours({ destinationSlug: slug });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.summary ?? destination.description ?? undefined,
    url: `${publicEnv.NEXT_PUBLIC_SITE_URL}/destinations/${destination.slug}`,
    ...(destination.latitude && destination.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: destination.latitude,
            longitude: destination.longitude,
          },
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressCountry: destination.country,
      ...(destination.region ? { addressRegion: destination.region } : {}),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={destination.region ?? destination.country}
        title={destination.name}
        standfirst={destination.summary}
        media={destination.heroMedia}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Destinations", href: "/destinations" },
          { label: destination.name },
        ]}
      />

      <Section tone="canvas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
            <div className="max-w-2xl">
              {destination.description ? (
                <>
                  <Eyebrow className="mb-3">About</Eyebrow>
                  <p className="whitespace-pre-line text-lead leading-relaxed text-fg-muted">
                    {destination.description}
                  </p>
                </>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-sm border border-border bg-surface p-6">
                <h2 className="text-h3 text-brand-800">Plan a visit</h2>

                <dl className="mt-5 space-y-4 text-sm">
                  {destination.region ? (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-sand-500">
                        Region
                      </dt>
                      <dd className="mt-0.5 text-fg-muted">{destination.region}</dd>
                    </div>
                  ) : null}
                  {destination.best_months.length > 0 ? (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-sand-500">
                        Best time to visit
                      </dt>
                      <dd className="mt-1.5 flex flex-wrap gap-1">
                        {destination.best_months
                          .slice()
                          .sort((a, b) => a - b)
                          .map((m) => (
                            <span
                              key={m}
                              className="rounded-xs bg-gold-50 px-1.5 py-0.5 text-xs text-gold-700"
                            >
                              {MONTHS[m - 1]?.slice(0, 3)}
                            </span>
                          ))}
                      </dd>
                    </div>
                  ) : null}
                  {destination.travel_time_note ? (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-sand-500">
                        Getting there
                      </dt>
                      <dd className="mt-0.5 text-fg-muted">
                        {destination.travel_time_note}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <ButtonLink
                  href={`/plan-your-trip?destination=${destination.slug}`}
                  className="mt-6 w-full"
                >
                  Plan a trip here
                </ButtonLink>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section tone="sunken">
        <Container>
          <SectionHeader
            eyebrow="Journeys"
            heading={`Tours visiting ${destination.name}`}
            subheading={
              tours.length === 0
                ? "We have no published itinerary here yet — but we build to order."
                : undefined
            }
            action={
              <ButtonLink href="/tours" variant="outline">
                All tours
              </ButtonLink>
            }
          />

          {tours.length === 0 ? (
            <div className="mt-10">
              <ButtonLink href={`/plan-your-trip?destination=${destination.slug}`}>
                Design a trip to {destination.name}
              </ButtonLink>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
