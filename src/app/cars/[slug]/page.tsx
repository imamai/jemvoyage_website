import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Briefcase, Cog, Fuel, Gauge, MapPin, Users } from "lucide-react";

import {
  getAllVehicleSlugs,
  getVehicleBySlug,
  getVehicles,
} from "@/lib/fleet/queries";
import { formatMoney } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { VehicleCard } from "@/components/fleet/vehicle-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeader } from "@/components/ui/section";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllVehicleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: "Vehicle not found" };

  const name = `${vehicle.make} ${vehicle.model}`;
  return {
    title: `${name} hire in Kenya`,
    description:
      vehicle.description ??
      `Hire a ${name} in Kenya with Jemvoyage — ${vehicle.seats} seats, ${vehicle.transmission}.`,
    alternates: { canonical: `/cars/${vehicle.slug}` },
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) notFound();

  const name = `${vehicle.make} ${vehicle.model}`;
  const related = (await getVehicles({ limit: 4 }))
    .filter((v) => v.id !== vehicle.id)
    .slice(0, 3);

  const selfDrive = vehicle.rates.find((r) => r.drive_type === "self_drive");
  const chauffeur = vehicle.rates.find((r) => r.drive_type === "chauffeur");

  const specs = [
    { icon: Users, label: "Seats", value: `${vehicle.seats}` },
    { icon: Cog, label: "Transmission", value: vehicle.transmission },
    { icon: Fuel, label: "Fuel", value: vehicle.fuel_type },
    vehicle.luggage_capacity
      ? { icon: Briefcase, label: "Luggage", value: `${vehicle.luggage_capacity} bags` }
      : null,
    vehicle.year ? { icon: Gauge, label: "Year", value: `${vehicle.year}` } : null,
    vehicle.home_location
      ? { icon: MapPin, label: "Based in", value: vehicle.home_location }
      : null,
  ].filter(Boolean) as { icon: typeof Users; label: string; value: string }[];

  return (
    <>
      <PageHero
        eyebrow={vehicle.category?.name ?? "Vehicle"}
        title={name}
        standfirst={vehicle.description}
        media={vehicle.media}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Car hire", href: "/car-hire" },
          { label: name },
        ]}
      />

      <Section tone="canvas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
            <div>
              <Eyebrow className="mb-3">Specification</Eyebrow>
              <h2 className="text-h2 text-brand-800">At a glance</h2>

              <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-wide text-sand-500">
                      <spec.icon size={14} aria-hidden className="text-gold-600" />
                      {spec.label}
                    </dt>
                    <dd className="mt-1.5 capitalize text-fg">{spec.value}</dd>
                  </div>
                ))}
              </dl>

              {vehicle.rental_terms ? (
                <div className="mt-12">
                  <h2 className="text-h3 text-brand-800">Rental terms</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-fg-muted">
                    {vehicle.rental_terms}
                  </p>
                </div>
              ) : null}

              <div className="mt-12 rounded-sm border border-border bg-surface p-6">
                <h2 className="text-h3 text-brand-800">Good to know</h2>
                <ul className="mt-4 space-y-2.5 text-sm text-fg-muted">
                  <li>
                    Rates include a daily mileage allowance; excess mileage is
                    charged at the rate on your agreement.
                  </li>
                  <li>
                    The vehicle is inspected with you before collection and again
                    on return, with photographs taken both times.
                  </li>
                  <li>
                    A refundable security deposit is held for the duration of a
                    self-drive rental.
                  </li>
                </ul>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-sm border border-border bg-surface p-6 shadow-subtle">
                <h2 className="text-h3 text-brand-800">Rates</h2>

                {selfDrive ? (
                  <div className="mt-5 border-t border-border pt-5">
                    <p className="text-eyebrow uppercase text-gold-600">Self-drive</p>
                    <p className="mt-1 font-display text-2xl text-brand-800">
                      {formatMoney(selfDrive.daily_rate, selfDrive.currency)}
                      <span className="ml-1 text-xs font-normal text-sand-600">
                        per day
                      </span>
                    </p>
                    <dl className="mt-3 space-y-1 text-xs text-sand-600">
                      {selfDrive.weekly_rate ? (
                        <div className="flex justify-between gap-4">
                          <dt>Weekly</dt>
                          <dd>{formatMoney(selfDrive.weekly_rate, selfDrive.currency)}</dd>
                        </div>
                      ) : null}
                      {selfDrive.daily_mileage_km ? (
                        <div className="flex justify-between gap-4">
                          <dt>Mileage included</dt>
                          <dd>{selfDrive.daily_mileage_km} km / day</dd>
                        </div>
                      ) : null}
                      {selfDrive.security_deposit ? (
                        <div className="flex justify-between gap-4">
                          <dt>Security deposit</dt>
                          <dd>
                            {formatMoney(selfDrive.security_deposit, selfDrive.currency)}
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>
                ) : null}

                {chauffeur ? (
                  <div className="mt-5 border-t border-border pt-5">
                    <p className="text-eyebrow uppercase text-gold-600">
                      Chauffeur-driven
                    </p>
                    <p className="mt-1 font-display text-2xl text-brand-800">
                      {formatMoney(chauffeur.daily_rate, chauffeur.currency)}
                      <span className="ml-1 text-xs font-normal text-sand-600">
                        per day
                      </span>
                    </p>
                    <dl className="mt-3 space-y-1 text-xs text-sand-600">
                      {chauffeur.driver_daily_fee ? (
                        <div className="flex justify-between gap-4">
                          <dt>Driver allowance</dt>
                          <dd>
                            {formatMoney(chauffeur.driver_daily_fee, chauffeur.currency)}
                          </dd>
                        </div>
                      ) : null}
                      {chauffeur.daily_mileage_km ? (
                        <div className="flex justify-between gap-4">
                          <dt>Mileage included</dt>
                          <dd>{chauffeur.daily_mileage_km} km / day</dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>
                ) : null}

                {!selfDrive && !chauffeur ? (
                  <p className="mt-4 text-sm text-fg-muted">
                    Rates for this vehicle are quoted on request.
                  </p>
                ) : null}

                <div className="mt-6 flex flex-col gap-3">
                  <ButtonLink href={`/quote?vehicle=${vehicle.slug}`} size="lg">
                    Request this vehicle
                  </ButtonLink>
                  <ButtonLink
                    href={`/contact?vehicle=${vehicle.slug}`}
                    variant="outline"
                    size="lg"
                  >
                    Check availability
                  </ButtonLink>
                </div>

                <p className="mt-4 text-center text-xs text-sand-500">
                  Rates are indicative and confirmed on your quotation.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section tone="sunken">
          <Container>
            <SectionHeader
              eyebrow="Alternatives"
              heading="Other vehicles"
              action={
                <ButtonLink href="/car-hire" variant="outline">
                  Full fleet
                </ButtonLink>
              }
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
