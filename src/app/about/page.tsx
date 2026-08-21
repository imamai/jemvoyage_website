import type { Metadata } from "next";

import { getPublicSettings, settingString } from "@/lib/cms/queries";
import { getDestinations } from "@/lib/catalogue/queries";
import { PageHero } from "@/components/site/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHeader } from "@/components/ui/section";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Jemvoyage",
  description:
    "Jemvoyage Ltd arranges premium safaris, tours, chauffeur services, airport transfers and vehicle hire across Kenya and East Africa.",
  alternates: { canonical: "/about" },
};

/**
 * Deliberately factual. No awards, certifications, partnerships, member counts
 * or years-in-business are claimed here (§70) — Jemvoyage adds anything true
 * through the CMS once it can be substantiated.
 */
export default async function AboutPage() {
  const [settings, destinations] = await Promise.all([
    getPublicSettings(),
    getDestinations({ limit: 1 }),
  ]);

  const tagline = settingString(
    settings,
    "site.tagline",
    "Premium journeys across Kenya and East Africa",
  );

  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title="About Jemvoyage"
        standfirst={tagline}
        media={destinations[0]?.heroMedia ?? null}
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <Section tone="canvas">
        <Container>
          <div className="mx-auto max-w-2xl">
            <p className="text-lead leading-relaxed text-fg-muted">
              Jemvoyage Ltd is a Kenyan travel company. We plan and run safaris
              and tours, and we operate our own fleet for car hire, chauffeur
              services and airport transfers.
            </p>
            <p className="mt-5 text-lead leading-relaxed text-fg-muted">
              Those two halves are deliberately connected. Because the vehicles
              and drivers on your itinerary are ours rather than a
              subcontractor&rsquo;s, we can be specific about what will turn up,
              who will be driving it, and what happens if something changes on the
              day.
            </p>
            <p className="mt-5 text-lead leading-relaxed text-fg-muted">
              We are based in Nairobi and travel the routes we sell. Where we have
              not stayed somewhere ourselves, we will say so.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="inverse">
        <Container>
          <SectionHeader
            eyebrow="How we work"
            heading="What you can expect"
            tone="onDark"
          />
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Itemised pricing",
                body: "Every quotation breaks out accommodation, transport, park fees, activities and taxes. Anything not listed as included is listed as excluded.",
              },
              {
                title: "One team throughout",
                body: "The planner who quotes your trip stays with it through booking and travel, so nothing is lost in a handover.",
              },
              {
                title: "Our own fleet",
                body: "Vehicles are maintained in-house on a service schedule, inspected before and after every rental, and photographed both times.",
              },
              {
                title: "Straight answers",
                body: "If a camp is not right for your dates, or a route will not work, we will tell you rather than sell it to you.",
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

      <Section tone="sunken">
        <Container className="text-center">
          <h2 className="text-h2 text-brand-800">Start a conversation</h2>
          <p className="mx-auto mt-3 max-w-lg text-lead text-fg-muted">
            Tell us roughly what you have in mind. We will take it from there.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/plan-your-trip" size="lg">
              Plan my trip
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Contact us
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
