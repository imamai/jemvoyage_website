import { JemImage } from "@/components/media/JemImage";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import type { HomepageSectionWithMedia } from "@/lib/cms/queries";

/**
 * Editorial split band: photograph on one side, copy on the other.
 * Used for car hire, transfers, luxury and corporate — the sections whose value
 * is a single strong image plus a proposition, not a grid of records.
 */
export function FeatureBand({
  section,
  reverse = false,
  tone = "canvas",
}: {
  section: HomepageSectionWithMedia;
  reverse?: boolean;
  tone?: "canvas" | "surface" | "sunken";
}) {
  return (
    <Section tone={tone}>
      <Container>
        <div
          className={cn(
            "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
            reverse && "lg:[&>*:first-child]:order-2",
          )}
        >
          <JemImage
            media={section.media}
            fallbackAlt={section.heading}
            aspect="card"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="rounded-sm shadow-raised"
          />

          <div className="max-w-xl">
            {section.eyebrow ? (
              <Eyebrow className="mb-3">{section.eyebrow}</Eyebrow>
            ) : null}
            <h2 className="text-h2 text-brand-800">{section.heading}</h2>
            {section.subheading ? (
              <p className="mt-4 text-lead text-fg-muted">{section.subheading}</p>
            ) : null}
            {section.body ? (
              <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                {section.body}
              </p>
            ) : null}
            {section.cta_label && section.cta_url ? (
              <ButtonLink href={section.cta_url} className="mt-8">
                {section.cta_label}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export type WhyPoint = { title: string; description: string };

/** Value propositions. Content comes from the `home.why_points` setting. */
export function WhyJemvoyage({
  section,
  points,
}: {
  section: HomepageSectionWithMedia;
  points: WhyPoint[];
}) {
  if (points.length === 0) return null;

  return (
    <Section tone="inverse">
      <Container>
        <SectionHeader
          eyebrow={section.eyebrow}
          heading={section.heading}
          subheading={section.subheading}
          tone="onDark"
        />

        <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point, index) => (
            <li key={point.title}>
              <p
                aria-hidden
                className="font-display text-3xl text-gold-400/70"
              >
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-h3 text-sand-50">{point.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-sand-300">
                {point.description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** Closing call to action before the footer. */
export function CtaBand({ section }: { section: HomepageSectionWithMedia }) {
  return (
    <Section tone="canvas" className="pb-0">
      <Container>
        <div className="relative isolate overflow-hidden rounded-sm bg-brand-800">
          <div className="absolute inset-0 opacity-30">
            <JemImage
              media={section.media}
              aspect="fill"
              sizes="100vw"
              decorative
              className="h-full w-full"
            />
          </div>

          <div className="relative px-8 py-16 text-center md:px-16 md:py-24">
            {section.eyebrow ? (
              <Eyebrow tone="onDark" className="mb-4">
                {section.eyebrow}
              </Eyebrow>
            ) : null}
            <h2 className="mx-auto max-w-2xl text-h1 text-sand-50">
              {section.heading}
            </h2>
            {section.subheading ? (
              <p className="mx-auto mt-5 max-w-xl text-lead text-sand-200">
                {section.subheading}
              </p>
            ) : null}
            {section.cta_label && section.cta_url ? (
              <ButtonLink
                href={section.cta_url}
                variant="gold"
                size="lg"
                className="mt-9"
              >
                {section.cta_label}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * Generic grid band: CMS-driven heading and CTA, arbitrary cards inside.
 *
 * Renders nothing when it has no cards, so a band whose catalogue is empty
 * disappears rather than showing an empty shell.
 */
export function CardGridBand({
  section,
  tone = "canvas",
  columns = 3,
  children,
  count,
}: {
  section: HomepageSectionWithMedia;
  tone?: "canvas" | "surface" | "sunken";
  columns?: 2 | 3;
  children: React.ReactNode;
  count: number;
}) {
  if (count === 0) return null;

  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader
          eyebrow={section.eyebrow}
          heading={section.heading}
          subheading={section.subheading}
          action={
            section.cta_label && section.cta_url ? (
              <ButtonLink href={section.cta_url} variant="outline">
                {section.cta_label}
              </ButtonLink>
            ) : undefined
          }
        />
        <div
          className={cn(
            "mt-12 grid gap-8",
            columns === 2
              ? "sm:grid-cols-2"
              : "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {children}
        </div>
      </Container>
    </Section>
  );
}

/** FAQ accordion, rendered with native details/summary for zero-JS a11y. */
export function FaqBand({
  items,
}: {
  items: { id: string; question: string; answer: string }[];
}) {
  if (items.length === 0) return null;

  return (
    <Section tone="surface">
      <Container>
        <SectionHeader
          eyebrow="Good to know"
          heading="Common questions"
          subheading="The things travellers ask us most often before booking."
        />

        <div className="mt-12 max-w-3xl divide-y divide-border border-y border-border">
          {items.map((faq) => (
            <details key={faq.id} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
                <span className="font-display text-lg text-brand-800">
                  {faq.question}
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-2xl leading-none text-gold-500 transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
