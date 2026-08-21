"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import type { JemvoyageMenuItem } from "@/lib/db/types";

export function MobileNav({ items }: { items: JemvoyageMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation, otherwise the panel stays open over the new page.
  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll behind the panel and restore whatever was there before.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="jemvoyage-mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-brand-800"
      >
        {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
      </button>

      <div
        id="jemvoyage-mobile-nav"
        hidden={!open}
        className={cn(
          "fixed inset-x-0 top-[var(--header-height,4.5rem)] bottom-0 z-50",
          "overflow-y-auto border-t border-border bg-surface px-5 py-6",
        )}
      >
        <nav aria-label="Primary">
          <ul className="flex flex-col">
            {items.map((item) => {
              const active =
                pathname === item.url || pathname.startsWith(`${item.url}/`);
              return (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block border-b border-border py-4 text-lg",
                      active ? "text-gold-600" : "text-brand-800",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-8 flex flex-col gap-3">
          <ButtonLink href="/plan-your-trip" variant="primary" size="lg">
            Plan my trip
          </ButtonLink>
          <ButtonLink href="/quote" variant="outline" size="lg">
            Request a quote
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
