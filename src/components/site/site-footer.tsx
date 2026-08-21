import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { getMenu, getPublicSettings, settingString } from "@/lib/cms/queries";
import { Container } from "@/components/ui/section";
import { NewsletterForm } from "@/components/site/newsletter-form";
import type { JemvoyageMenuItem } from "@/lib/db/types";

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: JemvoyageMenuItem[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-eyebrow uppercase text-gold-300">{title}</h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.url}
              className="text-sm text-sand-300 transition-colors hover:text-sand-50"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function SiteFooter() {
  const [explore, services, company, settings] = await Promise.all([
    getMenu("footer_explore"),
    getMenu("footer_services"),
    getMenu("footer_company"),
    getPublicSettings(),
  ]);

  const siteName = settingString(settings, "site.name", "Jemvoyage");
  const tagline = settingString(settings, "site.tagline");
  const email = settingString(settings, "contact.email");
  const phone = settingString(settings, "contact.phone");
  const address = settingString(settings, "contact.address");
  const hours = settingString(settings, "contact.hours");

  return (
    <footer className="bg-brand-800 text-sand-200">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="font-display text-3xl leading-none text-sand-50">
              {siteName}
              <span className="text-gold-400">.</span>
            </p>
            {tagline ? (
              <p className="mt-4 text-sm leading-relaxed text-sand-300">
                {tagline}
              </p>
            ) : null}

            <ul className="mt-6 flex flex-col gap-3 text-sm">
              {address ? (
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" aria-hidden />
                  <span className="text-sand-300">{address}</span>
                </li>
              ) : null}
              {phone ? (
                <li className="flex items-start gap-3">
                  <Phone size={16} className="mt-0.5 shrink-0 text-gold-400" aria-hidden />
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="text-sand-300 transition-colors hover:text-sand-50"
                  >
                    {phone}
                  </a>
                </li>
              ) : null}
              {email ? (
                <li className="flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 shrink-0 text-gold-400" aria-hidden />
                  <a
                    href={`mailto:${email}`}
                    className="text-sand-300 transition-colors hover:text-sand-50"
                  >
                    {email}
                  </a>
                </li>
              ) : null}
            </ul>
            {hours ? (
              <p className="mt-4 text-xs text-sand-400">{hours}</p>
            ) : null}
          </div>

          <FooterColumn title="Explore" items={explore} />
          <FooterColumn title="Services" items={services} />
          <FooterColumn title="Company" items={company} />
        </div>

        <div className="mt-14 border-t border-sand-50/10 pt-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <h3 className="font-display text-xl text-sand-50">
                Travel notes from Kenya
              </h3>
              <p className="mt-1.5 text-sm text-sand-400">
                Occasional dispatches on seasons, openings and quiet offers.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-sand-50/10 pt-8 text-xs text-sand-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteName} Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/faq" className="transition-colors hover:text-sand-200">
              FAQ
            </Link>
            <Link href="/contact" className="transition-colors hover:text-sand-200">
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
