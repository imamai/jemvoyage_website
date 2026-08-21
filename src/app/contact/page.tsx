import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { getPublicSettings, settingString } from "@/lib/cms/queries";
import { PageHero } from "@/components/site/page-hero";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Container, Section } from "@/components/ui/section";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Talk to the Jemvoyage travel team about safaris, tours, car hire, chauffeur services and airport transfers in Kenya.",
  alternates: { canonical: "/contact" },
};

type Props = {
  searchParams: Promise<{ tour?: string; vehicle?: string; destination?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const [settings, params] = await Promise.all([getPublicSettings(), searchParams]);

  const email = settingString(settings, "contact.email");
  const phone = settingString(settings, "contact.phone");
  const whatsapp = settingString(settings, "contact.whatsapp");
  const address = settingString(settings, "contact.address");
  const hours = settingString(settings, "contact.hours");

  const channels = [
    email && { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    phone && {
      icon: Phone,
      label: "Phone",
      value: phone,
      href: `tel:${phone.replace(/\s+/g, "")}`,
    },
    whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: whatsapp,
      href: `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`,
    },
    address && { icon: MapPin, label: "Office", value: address },
    hours && { icon: Clock, label: "Hours", value: hours },
  ].filter(Boolean) as {
    icon: typeof Mail;
    label: string;
    value: string;
    href?: string;
  }[];

  return (
    <>
      <PageHero
        eyebrow="Talk to us"
        title="Contact Jemvoyage"
        standfirst="Tell us what you have in mind. A real travel planner reads every enquiry, and we reply within one working day."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <Section tone="canvas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
            <div className="max-w-2xl">
              <h2 className="text-h2 text-brand-800">Send an enquiry</h2>
              <p className="mt-3 text-sm text-fg-muted">
                The more you tell us, the more useful our first reply will be.
              </p>
              <div className="mt-8">
                <EnquiryForm
                  variant="compact"
                  tourSlug={params.tour}
                  vehicleSlug={params.vehicle}
                  destinationSlug={params.destination}
                />
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-sm border border-border bg-surface p-6">
                <h2 className="text-h3 text-brand-800">Reach us directly</h2>
                <dl className="mt-5 space-y-5">
                  {channels.map((channel) => (
                    <div key={channel.label} className="flex gap-3">
                      <channel.icon
                        size={16}
                        aria-hidden
                        className="mt-0.5 shrink-0 text-gold-600"
                      />
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-sand-500">
                          {channel.label}
                        </dt>
                        <dd className="mt-0.5 text-sm text-fg">
                          {channel.href ? (
                            <a
                              href={channel.href}
                              className="text-brand-600 underline-offset-2 hover:underline"
                            >
                              {channel.value}
                            </a>
                          ) : (
                            channel.value
                          )}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
