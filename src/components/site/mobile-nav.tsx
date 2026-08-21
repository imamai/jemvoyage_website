"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import type { MenuNode } from "@/lib/cms/queries";

/**
 * Mobile navigation.
 *
 * Groups render as native <details> accordions: they work before hydration,
 * are announced correctly by screen readers, and need no state of their own.
 * The group containing the current page is open on load.
 */
export function MobileNav({ tree }: { tree: MenuNode[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

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

  const groupContainsPath = (node: MenuNode) =>
    pathname === node.url ||
    node.children.some(
      (c) => pathname === c.url || pathname.startsWith(`${c.url}/`),
    );

  return (
    // Must mirror the header's `lg:` breakpoint, or both the desktop nav and
    // the burger would be visible at the same width.
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
        className="fixed inset-x-0 top-[var(--header-height,4.5rem)] bottom-0 z-50 overflow-y-auto border-t border-border bg-surface px-5 py-4"
      >
        <nav aria-label="Primary">
          <ul className="divide-y divide-border">
            {tree.map((node) => (
              <li key={node.id}>
                {node.children.length === 0 ? (
                  <Link
                    href={node.url}
                    className="block py-4 text-lg text-brand-800"
                  >
                    {node.label}
                  </Link>
                ) : (
                  <details open={groupContainsPath(node)} className="group py-1">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-lg text-brand-800">
                      {node.label}
                      <span
                        aria-hidden
                        className="text-2xl leading-none text-gold-500 transition-transform duration-200 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>

                    <ul className="pb-2 pl-3">
                      {node.children.map((child) => {
                        const active =
                          pathname === child.url ||
                          pathname.startsWith(`${child.url}/`);
                        return (
                          <li key={child.id}>
                            <Link
                              href={child.url}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "block border-l border-border py-2.5 pl-4 text-base",
                                active
                                  ? "border-gold-500 text-gold-600"
                                  : "text-sand-700",
                              )}
                            >
                              {child.label}
                              {child.description ? (
                                <span className="mt-0.5 block text-xs text-sand-500">
                                  {child.description}
                                </span>
                              ) : null}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
          <ButtonLink href="/plan-your-trip" variant="primary" size="lg">
            Plan my trip
          </ButtonLink>
          <ButtonLink href="/quote" variant="outline" size="lg">
            Request a quote
          </ButtonLink>
          <ButtonLink href="/account" variant="ghost" size="lg">
            My account
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
