import type { Metadata } from "next";
import Link from "next/link";

import { getVehicleCategories, getVehicles } from "@/lib/fleet/queries";
import { JemImage } from "@/components/media/JemImage";
import { PageHero } from "@/components/site/page-hero";
import { VehicleCard } from "@/components/fleet/vehicle-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHeader } from "@/components/ui/section";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Car hire in Kenya — self-drive & chauffeur",
  description:
    "Hire a car in Kenya with Jemvoyage. Self-drive and chauffeur-driven vehicles from compacts to fully equipped 4x4 safari vehicles, based in Nairobi and Mombasa.",
  alternates: { canonical: "/car-hire" },
};

export default async function CarHirePage() {
  const [vehicles, categories] = await Promise.all([
    getVehicles(),
    getVehicleCategories(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Drive yourself, or let us drive"
        title="Car hire across Kenya"
        standfirst="An owned fleet, maintained in-house. Self-drive for the confident, chauffeur-driven when you would rather watch the country go past."
        media={vehicles[0]?.media ?? null}
        crumbs={[{ label: "Home", href: "/" }, { label: "Car hire" }]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#fleet" variant="onDark" size="lg">
            Browse the fleet
          </ButtonLink>
          <ButtonLink href="/quote?service=car_hire" variant="onDarkOutline" size="lg">
            Request a quote
          </ButtonLink>
        </div>
      </PageHero>

      {categories.length > 0 ? (
        <Section tone="surface">
          <Container>
            <SectionHeader
              eyebrow="By category"
              heading="Find the right vehicle"
              subheading="From a compact for city driving to a fully equipped safari 4x4."
            />

            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/car-hire/${category.slug}`}
                    className="group block overflow-hidden rounded-sm bg-canvas shadow-subtle transition-shadow hover:shadow-raised"
                  >
                    <JemImage
                      media={category.media}
                      fallbackAlt={category.name}
                      aspect="card"
                      sizes="(max-width: 640px) 100vw, 25vw"
                      imageClassName="transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    <div className="p-5">
                      <h3 className="text-h3 text-brand-800">{category.name}</h3>
                      {category.description ? (
                        <p className="mt-2 line-clamp-2 text-sm text-fg-muted">
                          {category.description}
                        </p>
                      ) : null}
                      {category.typical_seats ? (
                        <p className="mt-3 text-xs text-sand-600">
                          Typically {category.typical_seats} seats
                          {category.is_four_wheel ? " · four-wheel drive" : ""}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section tone="canvas" id="fleet">
        <Container>
          <SectionHeader
            eyebrow="The fleet"
            heading="Available vehicles"
            subheading={
              vehicles.length > 0
                ? `${vehicles.length} vehicles currently published.`
                : undefined
            }
          />

          {vehicles.length === 0 ? (
            <div className="mx-auto mt-10 max-w-lg rounded-sm border border-border bg-surface p-10 text-center">
              <h3 className="text-h3 text-brand-800">Fleet listings coming soon</h3>
              <p className="mt-3 text-sm text-fg-muted">
                Tell us your dates and what you need, and we will confirm
                availability directly.
              </p>
              <ButtonLink href="/quote?service=car_hire" className="mt-6">
                Request a quote
              </ButtonLink>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle, i) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} priority={i < 3} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section tone="inverse">
        <Container>
          <div className="grid gap-10 lg:grid-cols-3">
            {[
              {
                title: "What you need to hire",
                body: "A valid driving licence held for at least two years, a passport or national ID, and a refundable security deposit. International visitors should carry an International Driving Permit alongside their home licence.",
              },
              {
                title: "Insurance and excess",
                body: "All vehicles carry comprehensive cover. The excess varies by category and is stated on your rental agreement before you sign, along with the security deposit held against it.",
              },
              {
                title: "Mileage and fuel",
                body: "Rates include a daily mileage allowance; excess mileage is charged at the rate shown on your agreement. Vehicles are supplied full and should be returned full.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-h3 text-sand-50">{item.title}</h3>
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
