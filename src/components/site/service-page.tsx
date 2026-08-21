import { PageHero } from "@/components/site/page-hero";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import type { MediaRef } from "@/lib/cms/queries";
import type { Crumb } from "@/components/site/page-hero";

export type ServiceFeature = { title: string; body: string };

/**
 * Shared layout for the single-service marketing pages (chauffeur, transfers,
 * corporate, agents). Keeps them structurally identical so the copy is the only
 * thing that differs, and gives each one an enquiry form rather than a dead end.
 */
export function ServicePage({
  eyebrow,
  title,
  standfirst,
  media,
  crumbs,
  intro,
  features,
  featuresHeading = "What we offer",
  featuresEyebrow = "The service",
  enquiryHeading = "Make an enquiry",
  enquiryBody,
  defaultService,
  children,
}: {
  eyebrow: string;
  title: string;
  standfirst: string;
  media?: MediaRef | null;
  crumbs: Crumb[];
  intro: string[];
  features: ServiceFeature[];
  featuresHeading?: string;
  featuresEyebrow?: string;
  enquiryHeading?: string;
  enquiryBody?: string;
  defaultService?:
    | "tour" | "safari" | "car_hire" | "chauffeur" | "transfer" | "corporate" | "custom";
  children?: React.ReactNode;
}) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        standfirst={standfirst}
        media={media}
        crumbs={crumbs}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#enquire" variant="onDark" size="lg">
            Make an enquiry
          </ButtonLink>
          <ButtonLink href="/contact" variant="onDarkOutline" size="lg">
            Contact us
          </ButtonLink>
        </div>
      </PageHero>

      <Section tone="canvas">
        <Container>
          <div className="mx-auto max-w-2xl">
            {intro.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-lead leading-relaxed text-fg-muted"
                    : "mt-5 text-lead leading-relaxed text-fg-muted"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      {features.length > 0 ? (
        <Section tone="inverse">
          <Container>
            <SectionHeader
              eyebrow={featuresEyebrow}
              heading={featuresHeading}
              tone="onDark"
            />
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title}>
                  <h3 className="text-h3 text-sand-50">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-sand-300">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {children}

      <Section tone="sunken" id="enquire">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-h2 text-brand-800">{enquiryHeading}</h2>
            {enquiryBody ? (
              <p className="mt-3 text-lead text-fg-muted">{enquiryBody}</p>
            ) : null}
            <div className="mt-8 rounded-sm border border-border bg-surface p-6 md:p-8">
              <EnquiryForm variant="full" defaultService={defaultService} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
