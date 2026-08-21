import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getVehicleCategories, getVehicles } from "@/lib/fleet/queries";
import { PageHero } from "@/components/site/page-hero";
import { VehicleCard } from "@/components/fleet/vehicle-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categories = await getVehicleCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getVehicleCategories()).find((c) => c.slug === slug);
  if (!category) return { title: "Car hire" };

  return {
    title: `${category.name} car hire in Kenya`,
    description:
      category.description ??
      `Hire a ${category.name.toLowerCase()} vehicle in Kenya with Jemvoyage.`,
    alternates: { canonical: `/car-hire/${category.slug}` },
  };
}

export default async function VehicleCategoryPage({ params }: Props) {
  const { slug } = await params;
  const categories = await getVehicleCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

  const vehicles = await getVehicles({ categorySlug: slug });

  return (
    <>
      <PageHero
        eyebrow="Car hire"
        title={category.name}
        standfirst={category.description}
        media={category.media ?? vehicles[0]?.media ?? null}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Car hire", href: "/car-hire" },
          { label: category.name },
        ]}
      />

      <Section tone="canvas">
        <Container>
          {vehicles.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-sm border border-border bg-surface p-10 text-center">
              <h2 className="text-h3 text-brand-800">
                No {category.name.toLowerCase()} vehicles listed right now
              </h2>
              <p className="mt-3 text-sm text-fg-muted">
                Availability changes daily. Send us your dates and we will confirm
                what we can offer.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/quote?service=car_hire">Request a quote</ButtonLink>
                <ButtonLink href="/car-hire" variant="outline">
                  All vehicles
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle, i) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} priority={i < 3} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
