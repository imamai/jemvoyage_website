import type { Metadata } from "next";
import Link from "next/link";

import { createStaticClient } from "@/lib/supabase/static";
import { getMediaByIds } from "@/lib/cms/queries";
import { formatDate, formatMoney } from "@/lib/utils";
import { JemImage } from "@/components/media/JemImage";
import { PageHero } from "@/components/site/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import type { JemvoyageOffer } from "@/lib/db/types";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Offers",
  description:
    "Current Jemvoyage offers on safaris, tours, car hire and airport transfers in Kenya.",
  alternates: { canonical: "/offers" },
};

const AUDIENCE_LABELS: Record<string, string> = {
  all: "All services",
  tours: "Tours",
  safaris: "Safaris",
  rentals: "Car hire",
  transfers: "Transfers",
  corporate: "Corporate",
};

export default async function OffersPage() {
  const supabase = createStaticClient();

  // RLS already limits anon to active offers inside their date window.
  const { data } = await supabase
    .from("jemvoyage_offers")
    .select("*")
    .order("display_order", { ascending: true });

  const offers = (data ?? []) as JemvoyageOffer[];
  const media = await getMediaByIds(offers.map((o) => o.media_id));

  return (
    <>
      <PageHero
        eyebrow="Current value"
        title="Offers"
        standfirst="Occasional, genuine reductions — usually shoulder-season rates or a camp with space to fill. We do not run permanent discounts."
        crumbs={[{ label: "Home", href: "/" }, { label: "Offers" }]}
      />

      <Section tone="canvas">
        <Container>
          {offers.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-sm border border-border bg-surface p-10 text-center">
              <h2 className="text-h3 text-brand-800">No offers running today</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                We publish offers only when there is a real one to publish. Rather
                than wait, tell us your dates — shoulder-season pricing is often
                better than anything we advertise.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/plan-your-trip">Plan my trip</ButtonLink>
                <ButtonLink href="/tours" variant="outline">
                  Browse tours
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer) => (
                <article
                  key={offer.id}
                  className="flex flex-col overflow-hidden rounded-sm bg-surface shadow-subtle"
                >
                  <JemImage
                    media={offer.media_id ? media.get(offer.media_id) : null}
                    fallbackAlt={offer.title}
                    aspect="card"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-eyebrow uppercase text-gold-600">
                      {AUDIENCE_LABELS[offer.applies_to] ?? offer.applies_to}
                    </p>
                    <h2 className="mt-2 text-h3 text-brand-800">{offer.title}</h2>
                    {offer.summary ? (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
                        {offer.summary}
                      </p>
                    ) : null}

                    {offer.discount_value ? (
                      <p className="mt-4 font-display text-2xl text-clay-500">
                        {offer.discount_type === "percent"
                          ? `${offer.discount_value}% off`
                          : `${formatMoney(offer.discount_value, "KES")} off`}
                      </p>
                    ) : null}

                    <dl className="mt-4 space-y-1 text-xs text-sand-600">
                      {offer.promo_code ? (
                        <div className="flex gap-1.5">
                          <dt>Code:</dt>
                          <dd className="font-mono font-semibold text-brand-700">
                            {offer.promo_code}
                          </dd>
                        </div>
                      ) : null}
                      {offer.ends_at ? (
                        <div className="flex gap-1.5">
                          <dt>Ends:</dt>
                          <dd>{formatDate(offer.ends_at)}</dd>
                        </div>
                      ) : null}
                    </dl>

                    <Link
                      href={`/quote?offer=${offer.slug}`}
                      className="mt-5 text-sm text-brand-600 underline-offset-4 hover:underline"
                    >
                      Enquire about this offer
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
