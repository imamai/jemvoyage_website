import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, MapPin, Users, X } from "lucide-react";

import {
  getAllTourSlugs,
  getTourBySlug,
  getTours,
} from "@/lib/catalogue/queries";
import { publicEnv } from "@/lib/env";
import { formatMoney, pluralise } from "@/lib/utils";
import { JemImage } from "@/components/media/JemImage";
import { PageHero } from "@/components/site/page-hero";
import { TourCard } from "@/components/catalogue/tour-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeader } from "@/components/ui/section";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllTourSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return { title: "Tour not found" };

  return {
    title: tour.title,
    description: tour.summary ?? tour.subtitle ?? undefined,
    alternates: { canonical: `/tours/${tour.slug}` },
    openGraph: {
      type: "article",
      title: tour.title,
      description: tour.summary ?? undefined,
    },
  };
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) notFound();

  const related = (await getTours({ limit: 4 })).filter((t) => t.id !== tour.id).slice(0, 3);

  // §60: structured data so the itinerary is eligible for rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.summary ?? tour.description ?? undefined,
    url: `${publicEnv.NEXT_PUBLIC_SITE_URL}/tours/${tour.slug}`,
    provider: {
      "@type": "TravelAgency",
      name: publicEnv.NEXT_PUBLIC_SITE_NAME,
    },
    ...(tour.price_from
      ? {
          offers: {
            "@type": "Offer",
            price: tour.price_from,
            priceCurrency: tour.currency,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
    ...(tour.destination
      ? { itinerary: { "@type": "Place", name: tour.destination.name } }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Serialised from our own database rows, not from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={tour.category?.name ?? "Tour"}
        title={tour.title}
        standfirst={tour.subtitle}
        media={tour.heroMedia ?? tour.media}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Tours", href: "/tours" },
          { label: tour.title },
        ]}
      >
        <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-sand-200">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Duration</dt>
            <Clock size={16} aria-hidden className="text-gold-400" />
            <dd>
              {pluralise(tour.duration_days, "day")}
              {tour.duration_nights > 0
                ? ` · ${pluralise(tour.duration_nights, "night")}`
                : ""}
            </dd>
          </div>
          {tour.destination ? (
            <div className="flex items-center gap-2">
              <dt className="sr-only">Destination</dt>
              <MapPin size={16} aria-hidden className="text-gold-400" />
              <dd>{tour.destination.name}</dd>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <dt className="sr-only">Group size</dt>
            <Users size={16} aria-hidden className="text-gold-400" />
            <dd>
              {tour.max_travellers
                ? `${tour.min_travellers}–${tour.max_travellers} travellers`
                : `${tour.min_travellers}+ travellers`}
            </dd>
          </div>
        </dl>
      </PageHero>

      <Section tone="canvas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
            <div className="min-w-0">
              {tour.description ? (
                <div className="max-w-2xl">
                  <Eyebrow className="mb-3">Overview</Eyebrow>
                  <p className="whitespace-pre-line text-lead leading-relaxed text-fg-muted">
                    {tour.description}
                  </p>
                </div>
              ) : null}

              {tour.itinerary.length > 0 ? (
                <div className="mt-14">
                  <Eyebrow className="mb-3">Day by day</Eyebrow>
                  <h2 className="text-h2 text-brand-800">The itinerary</h2>

                  <ol className="mt-8 border-l border-border">
                    {tour.itinerary.map((day) => (
                      <li key={day.id} className="relative pb-10 pl-8 last:pb-0">
                        <span
                          aria-hidden
                          className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-gold-500 bg-canvas"
                        />
                        <p className="text-eyebrow uppercase text-gold-600">
                          Day {day.day_number}
                        </p>
                        <h3 className="mt-1.5 text-h3 text-brand-800">
                          {day.title}
                        </h3>
                        {day.description ? (
                          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
                            {day.description}
                          </p>
                        ) : null}
                        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-sand-600">
                          {day.accommodation && day.accommodation !== "—" ? (
                            <div className="flex gap-1.5">
                              <dt className="font-semibold">Stay:</dt>
                              <dd>{day.accommodation}</dd>
                            </div>
                          ) : null}
                          {day.meals ? (
                            <div className="flex gap-1.5">
                              <dt className="font-semibold">Meals:</dt>
                              <dd>{day.meals}</dd>
                            </div>
                          ) : null}
                          {day.driving_time_minutes ? (
                            <div className="flex gap-1.5">
                              <dt className="font-semibold">Driving:</dt>
                              <dd>
                                {Math.floor(day.driving_time_minutes / 60)}h{" "}
                                {day.driving_time_minutes % 60
                                  ? `${day.driving_time_minutes % 60}m`
                                  : ""}
                              </dd>
                            </div>
                          ) : null}
                        </dl>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {tour.inclusions.length > 0 || tour.exclusions.length > 0 ? (
                <div className="mt-14 grid gap-10 sm:grid-cols-2">
                  {tour.inclusions.length > 0 ? (
                    <div>
                      <h2 className="text-h3 text-brand-800">What is included</h2>
                      <ul className="mt-4 space-y-2.5">
                        {tour.inclusions.map((item) => (
                          <li key={item} className="flex gap-2.5 text-sm text-fg-muted">
                            <Check
                              size={16}
                              aria-hidden
                              className="mt-0.5 shrink-0 text-success"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {tour.exclusions.length > 0 ? (
                    <div>
                      <h2 className="text-h3 text-brand-800">Not included</h2>
                      <ul className="mt-4 space-y-2.5">
                        {tour.exclusions.map((item) => (
                          <li key={item} className="flex gap-2.5 text-sm text-fg-muted">
                            <X
                              size={16}
                              aria-hidden
                              className="mt-0.5 shrink-0 text-sand-400"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {tour.gallery.length > 0 ? (
                <div className="mt-14">
                  <h2 className="text-h3 text-brand-800">Gallery</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {tour.gallery.map((media) => (
                      <JemImage
                        key={media.id}
                        media={media}
                        fallbackAlt={tour.title}
                        aspect="card"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="rounded-sm"
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Booking rail */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-sm border border-border bg-surface p-6 shadow-subtle">
                {tour.price_from ? (
                  <>
                    <p className="text-xs text-sand-600">From</p>
                    <p className="font-display text-3xl text-brand-800">
                      {formatMoney(tour.price_from, tour.currency)}
                    </p>
                    <p className="mt-1 text-xs text-sand-600">
                      {tour.price_basis === "per_person"
                        ? "per person sharing"
                        : "per group"}
                    </p>
                  </>
                ) : (
                  <p className="font-display text-2xl text-brand-800">
                    Price on request
                  </p>
                )}

                <div className="mt-6 flex flex-col gap-3">
                  <ButtonLink href={`/quote?tour=${tour.slug}`} size="lg">
                    Request a quotation
                  </ButtonLink>
                  <ButtonLink
                    href={`/contact?tour=${tour.slug}`}
                    variant="outline"
                    size="lg"
                  >
                    Ask a question
                  </ButtonLink>
                </div>

                <dl className="mt-7 space-y-3 border-t border-border pt-6 text-sm">
                  {tour.accommodation_summary ? (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-sand-500">
                        Accommodation
                      </dt>
                      <dd className="mt-0.5 text-fg-muted">
                        {tour.accommodation_summary}
                      </dd>
                    </div>
                  ) : null}
                  {tour.transport_summary ? (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-sand-500">
                        Transport
                      </dt>
                      <dd className="mt-0.5 text-fg-muted">
                        {tour.transport_summary}
                      </dd>
                    </div>
                  ) : null}
                  {tour.meals_summary ? (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-sand-500">
                        Meals
                      </dt>
                      <dd className="mt-0.5 text-fg-muted">{tour.meals_summary}</dd>
                    </div>
                  ) : null}
                  {tour.best_months.length > 0 ? (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-sand-500">
                        Best months
                      </dt>
                      <dd className="mt-1 flex flex-wrap gap-1">
                        {tour.best_months
                          .slice()
                          .sort((a, b) => a - b)
                          .map((m) => (
                            <span
                              key={m}
                              className="rounded-xs bg-gold-50 px-1.5 py-0.5 text-xs text-gold-700"
                            >
                              {MONTHS[m - 1]}
                            </span>
                          ))}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              {tour.destination ? (
                <p className="mt-4 text-center text-xs text-sand-600">
                  Travelling to{" "}
                  <Link
                    href={`/destinations/${tour.destination.slug}`}
                    className="text-brand-600 underline underline-offset-2"
                  >
                    {tour.destination.name}
                  </Link>
                </p>
              ) : null}
            </aside>
          </div>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section tone="sunken">
          <Container>
            <SectionHeader
              eyebrow="You might also like"
              heading="Other journeys"
              action={
                <ButtonLink href="/tours" variant="outline">
                  All tours
                </ButtonLink>
              }
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
