import type { Metadata } from "next";

import { getFaqs } from "@/lib/cms/queries";
import { PageHero } from "@/components/site/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Answers to the questions travellers ask us most about safaris, car hire, payment, transfers and travelling in Kenya.",
  alternates: { canonical: "/faq" },
};

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  safaris: "Safaris",
  "car-hire": "Car hire",
  booking: "Booking",
  payments: "Payments",
  transfers: "Transfers",
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    (acc[faq.category] ??= []).push(faq);
    return acc;
  }, {});

  // §60: FAQPage structured data, generated from the same CMS rows the page renders.
  const jsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      <PageHero
        eyebrow="Good to know"
        title="Frequently asked questions"
        standfirst="If your question is not here, ask us directly — we would rather answer it properly than have you guess."
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <Section tone="canvas">
        <Container>
          {faqs.length === 0 ? (
            <p className="text-fg-muted">
              Our FAQs are being written. In the meantime,{" "}
              <a href="/contact" className="text-brand-600 underline">
                send us your question
              </a>
              .
            </p>
          ) : (
            <div className="mx-auto max-w-3xl space-y-14">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <h2 className="text-h2 text-brand-800">
                    {CATEGORY_LABELS[category] ?? category}
                  </h2>
                  <div className="mt-6 divide-y divide-border border-y border-border">
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
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section tone="sunken">
        <Container className="text-center">
          <h2 className="text-h2 text-brand-800">Still have a question?</h2>
          <p className="mx-auto mt-3 max-w-lg text-lead text-fg-muted">
            A travel planner will answer you directly, usually the same day.
          </p>
          <ButtonLink href="/contact" size="lg" className="mt-8">
            Ask us
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
