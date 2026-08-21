import Link from "next/link";
import { Phone } from "lucide-react";

import { getMenu, getPublicSettings, settingString } from "@/lib/cms/queries";
import { ButtonLink } from "@/components/ui/button";
import { MobileNav } from "@/components/site/mobile-nav";

export async function SiteHeader() {
  const [items, settings] = await Promise.all([
    getMenu("primary"),
    getPublicSettings(),
  ]);

  const phone = settingString(settings, "contact.phone");
  const siteName = settingString(settings, "site.name", "Jemvoyage");

  return (
    <header
      className="sticky top-0 z-40 border-b border-border/70 bg-surface/85 backdrop-blur-md"
      style={{ ["--header-height" as string]: "4.5rem" }}
    >
      <div className="container-page flex h-18 items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-2xl leading-none tracking-tight text-brand-800"
        >
          {siteName}
          <span className="text-gold-500">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  className="text-sm text-sand-700 transition-colors hover:text-brand-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {phone ? (
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="hidden items-center gap-2 text-sm text-sand-700 transition-colors hover:text-brand-600 xl:inline-flex"
            >
              <Phone size={15} aria-hidden />
              <span>{phone}</span>
            </a>
          ) : null}

          <ButtonLink href="/plan-your-trip" className="hidden lg:inline-flex">
            Plan my trip
          </ButtonLink>

          <MobileNav items={items} />
        </div>
      </div>
    </header>
  );
}
