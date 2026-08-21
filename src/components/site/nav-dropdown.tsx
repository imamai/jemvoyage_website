"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MenuNode } from "@/lib/cms/queries";

/**
 * One top-level nav group.
 *
 * The trigger is a real <button> rather than a link-with-hover, so the group is
 * reachable by keyboard and announced as expandable. Pointer users still get
 * hover-to-open, but hover is never the only way in.
 *
 * The group label also links somewhere real (`node.url`), so the panel is a
 * convenience rather than the sole route to that section.
 */
export function NavDropdown({ node }: { node: MenuNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const isActive =
    pathname === node.url ||
    node.children.some(
      (child) => pathname === child.url || pathname.startsWith(`${child.url}/`),
    );

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        wrapperRef.current?.querySelector("button")?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // A short close delay stops the panel vanishing while the pointer crosses the
  // gap between the trigger and the panel.
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => cancelClose(), []);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onPointerEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onPointerLeave={scheduleClose}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          // whitespace-nowrap keeps "Tours & Safaris" on one line instead of
          // breaking after the ampersand and doubling the header height.
          "inline-flex items-center gap-1 whitespace-nowrap py-2 text-sm transition-colors",
          isActive ? "text-brand-600" : "text-sand-700 hover:text-brand-600",
        )}
      >
        {node.label}
        <ChevronDown
          size={14}
          aria-hidden
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-3",
        )}
      >
        <div className="overflow-hidden rounded-sm border border-border bg-surface shadow-lifted">
          <ul className="py-2">
            {node.children.map((child) => {
              const childActive =
                pathname === child.url || pathname.startsWith(`${child.url}/`);
              return (
                <li key={child.id}>
                  <Link
                    href={child.url}
                    aria-current={childActive ? "page" : undefined}
                    className={cn(
                      "block px-4 py-2.5 transition-colors",
                      childActive ? "bg-brand-50" : "hover:bg-sand-100",
                    )}
                  >
                    <span
                      className={cn(
                        "block text-sm",
                        childActive ? "text-brand-700" : "text-brand-800",
                      )}
                    >
                      {child.label}
                    </span>
                    {child.description ? (
                      <span className="mt-0.5 block text-xs leading-snug text-sand-600">
                        {child.description}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href={node.url}
            className="block border-t border-border bg-surface-sunken px-4 py-2.5 text-xs text-brand-600 transition-colors hover:bg-sand-200"
          >
            View {node.label.toLowerCase()} →
          </Link>
        </div>
      </div>
    </div>
  );
}
