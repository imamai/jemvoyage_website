import type { Metadata } from "next";
import Link from "next/link";

import { getTourBySlug } from "@/lib/catalogue/queries";
import { getVehicleBySlug } from "@/lib/fleet/queries";
import { formatMoney, pluralise } from "@/lib/utils";
import { JemImage } from "@/components/media/JemImage";
import { PageHero } from "@/components/site/page-hero";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Container, Section } from "@/components/ui/section";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Request a quotation",
  description:
    "Request an itemised Jemvoyage quotation for a safari, tour, car hire, chauffeur service or airport transfer in Kenya.",
  alternates: { canonical: "/quote" },
};

type Props = {
  searchParams: Promise<{ tour?: string; vehicle?: string; service?: string }>;
};

const SERVICE_VALUES = [
  "tour", "safari", "car_hire", "chauffeur", "transfer", "corporate", "custom",
] as const;

type ServiceValue = (typeof SERVICE_VALUES)[number];

function asService(value: string | undefined): ServiceValue | undefined {
  return SERVICE_VALUES.includes(value as ServiceValue)
    ? (value as ServiceValue)
    : undefined;
}

export default async function QuotePage({ searchParams }: Props) {
  const params = await searchParams;

  const [tour, vehicle] = await Promise.all([
    params.tour ? getTourBySlug(params.tour) : Promise.resolve(null),
    params.vehicle ? getVehicleBySlug(params.vehicle) : Promise.resolve(null),
  ]);

  const defaultService =
    asService(params.service) ?? (tour ? "tour" : vehicle ? "car_hire" : undefined);

  return (
    <>
      <PageHero
        eyebrow="Commercial proposal"
        title="Request a quotation"
        standfirst="Every Jemvoyage quotation is itemised — accommodation, transport, park fees, activities and taxes shown separately, in your currency."
        media={tour?.heroMedia ?? vehicle?.media ?? null}
        crumbs={[{ label: "Home", href: "/" }, { label: "Request a quote" }]}
      />

      <Section tone="canvas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
            <div className="max-w-2xl">
              <h2 className="text-h2 text-brand-800">Your details</h2>
              <p className="mt-3 text-sm text-fg-muted">
                We prepare quotations by hand rather than by calculator, so the
                more context you give us the more accurate the first version will
                be.
              </p>
              <div className="mt-8">
                <EnquiryForm
                  variant="full"
                  submitLabel="Request quotation"
                  defaultService={defaultService}
                  tourSlug={tour?.slug}
                  vehicleSlug={vehicle?.slug}
                />
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              {tour ? (
                <div className="overflow-hidden rounded-sm border border-border bg-surface">
                  <JemImage
                    media={tour.media}
                    fallbackAlt={tour.title}
                    aspect="card"
                    sizes="20rem"
                  />
                  <div className="p-5">
                    <p className="text-eyebrow uppercase text-gold-600">
                      Quoting for
                    </p>
                    <h2 className="mt-1.5 text-h3 text-brand-800">{tour.title}</h2>
                    <p className="mt-2 text-xs text-sand-600">
                      {pluralise(tour.duration_days, "day")}
                      {tour.price_from
                        ? ` · from ${formatMoney(tour.price_from, tour.currency)}`
                        : ""}
                    </p>
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="mt-4 inline-block text-sm text-brand-600 underline-offset-4 hover:underline"
                    >
                      View the itinerary
                    </Link>
                  </div>
                </div>
              ) : null}

              {vehicle ? (
                <div className="overflow-hidden rounded-sm border border-border bg-surface">
                  <JemImage
                    media={vehicle.media}
                    fallbackAlt={`${vehicle.make} ${vehicle.model}`}
                    aspect="card"
                    sizes="20rem"
                  />
                  <div className="p-5">
                    <p className="text-eyebrow uppercase text-gold-600">
                      Quoting for
                    </p>
                    <h2 className="mt-1.5 text-h3 text-brand-800">
                      {vehicle.make} {vehicle.model}
                    </h2>
                    <p className="mt-2 text-xs text-sand-600">
                      {vehicle.seats} seats
                      {vehicle.dailyFrom
                        ? ` · from ${formatMoney(vehicle.dailyFrom, "KES")} per day`
                        : ""}
                    </p>
                    <Link
                      href={`/cars/${vehicle.slug}`}
                      className="mt-4 inline-block text-sm text-brand-600 underline-offset-4 hover:underline"
                    >
                      View the vehicle
                    </Link>
                  </div>
                </div>
              ) : null}

              <div className="mt-6 rounded-sm border border-border bg-surface p-6">
                <h2 className="text-h3 text-brand-800">What you will receive</h2>
                <ul className="mt-4 space-y-2.5 text-sm text-fg-muted">
                  <li>An itemised cost breakdown, not a single total</li>
                  <li>What is included and what is not, stated explicitly</li>
                  <li>Payment terms and the cancellation policy</li>
                  <li>A validity date, so you know how long it holds</li>
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
