import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTourCategories, getTours } from "@/lib/catalogue/queries";
import { PageHero } from "@/components/site/page-hero";
import { TourCard } from "@/components/catalogue/tour-card";
import { Container, Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categories = await getTourCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getTourCategories()).find((c) => c.slug === slug);
  if (!category) return { title: "Tours" };

  return {
    title: `${category.name} tours in Kenya`,
    description:
      category.description ??
      `Jemvoyage ${category.name.toLowerCase()} itineraries across Kenya and East Africa.`,
    alternates: { canonical: `/tours/category/${category.slug}` },
  };
}

export default async function TourCategoryPage({ params }: Props) {
  const { slug } = await params;
  const categories = await getTourCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

  const tours = await getTours({ categorySlug: slug });

  return (
    <>
      <PageHero
        eyebrow="Tours"
        title={category.name}
        standfirst={category.description}
        media={tours[0]?.media ?? null}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Tours", href: "/tours" },
          { label: category.name },
        ]}
      />

      <Section tone="canvas">
        <Container>
          {tours.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-sm border border-border bg-surface p-10 text-center">
              <h2 className="text-h3 text-brand-800">
                Nothing published in this category yet
              </h2>
              <p className="mt-3 text-sm text-fg-muted">
                We build these itineraries to order. Tell us what you are looking
                for and we will put something together.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/plan-your-trip">Plan my trip</ButtonLink>
                <ButtonLink href="/tours" variant="outline">
                  All tours
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour, i) => (
                <TourCard key={tour.id} tour={tour} priority={i < 3} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
