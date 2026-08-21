import Link from "next/link";

import { signOutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";
import type { AdminContext } from "@/lib/admin/guard";

type NavItem = {
  href: string;
  label: string;
  permission?: string;
  /** Screen not built yet — rendered as a disabled row rather than a dead link. */
  soon?: boolean;
};
type NavGroup = { heading: string; items: NavItem[] };

/**
 * Navigation is filtered by permission, so a Fleet Manager never sees Finance
 * and a Content Editor never sees the CRM. This is presentation only — RLS
 * enforces the same boundaries on the data itself.
 *
 * Modules whose schema exists but whose screen does not are marked `soon` and
 * rendered inert. Showing the roadmap is useful; linking to a 404 is not.
 */
const NAV: NavGroup[] = [
  {
    heading: "Overview",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    heading: "Sales",
    items: [
      { href: "/admin/leads", label: "Leads", permission: "leads.view" },
      { href: "/admin/customers", label: "Customers", permission: "customers.view", soon: true },
      { href: "/admin/quotes", label: "Quotations", permission: "quotes.view", soon: true },
      { href: "/admin/bookings", label: "Bookings", permission: "bookings.view", soon: true },
    ],
  },
  {
    heading: "Catalogue",
    items: [
      { href: "/admin/tours", label: "Tours", permission: "tours.view", soon: true },
      { href: "/admin/destinations", label: "Destinations", permission: "destinations.view", soon: true },
    ],
  },
  {
    heading: "Fleet",
    items: [
      { href: "/admin/vehicles", label: "Vehicles", permission: "vehicles.view", soon: true },
      { href: "/admin/rentals", label: "Rentals", permission: "rentals.view", soon: true },
      { href: "/admin/transfers", label: "Transfers", permission: "transfers.view", soon: true },
    ],
  },
  {
    heading: "Content",
    items: [
      { href: "/admin/media", label: "Media library", permission: "media.view" },
      { href: "/admin/reviews", label: "Reviews", permission: "reviews.view" },
      { href: "/admin/homepage", label: "Homepage", permission: "cms.view", soon: true },
      { href: "/admin/faqs", label: "FAQs", permission: "cms.view", soon: true },
      { href: "/admin/offers", label: "Offers", permission: "offers.view", soon: true },
    ],
  },
  {
    heading: "Finance",
    items: [
      { href: "/admin/invoices", label: "Invoices", permission: "invoices.view", soon: true },
      { href: "/admin/payments", label: "Payments", permission: "payments.view", soon: true },
    ],
  },
  {
    heading: "System",
    items: [
      { href: "/admin/settings", label: "Settings", permission: "settings.view", soon: true },
      { href: "/admin/audit", label: "Audit log", permission: "audit.view", soon: true },
    ],
  },
];

export function AdminShell({
  context,
  activePath,
  title,
  standfirst,
  actions,
  children,
}: {
  context: AdminContext;
  activePath: string;
  title: string;
  standfirst?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const groups = NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.permission || context.can(item.permission)),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex min-h-screen flex-col bg-surface-sunken lg:flex-row">
      <aside className="border-b border-border bg-brand-800 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-5 lg:block">
          <Link href="/admin" className="font-display text-xl text-sand-50">
            Jemvoyage
            <span className="text-gold-400">.</span>
            <span className="ml-2 align-middle text-[0.6rem] uppercase tracking-widest text-gold-300">
              Admin
            </span>
          </Link>
        </div>

        <nav aria-label="Admin" className="px-3 pb-5 lg:pb-8">
          {groups.map((group) => (
            <div key={group.heading} className="mb-5">
              <p className="px-2 pb-1.5 text-[0.65rem] uppercase tracking-widest text-sand-500">
                {group.heading}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active =
                    item.href === "/admin"
                      ? activePath === "/admin"
                      : activePath.startsWith(item.href);

                  if (item.soon) {
                    return (
                      <li key={item.href}>
                        <span
                          aria-disabled="true"
                          title="Schema is in place; this screen is still being built"
                          className="flex cursor-default items-center justify-between rounded-sm px-2.5 py-2 text-sm text-sand-500"
                        >
                          {item.label}
                          <span className="rounded-xs bg-sand-50/10 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wider">
                            Soon
                          </span>
                        </span>
                      </li>
                    );
                  }

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "block rounded-sm px-2.5 py-2 text-sm transition-colors",
                          active
                            ? "bg-brand-600 text-sand-50"
                            : "text-sand-300 hover:bg-brand-700 hover:text-sand-50",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-sand-50/10 p-5">
          <p className="truncate text-sm text-sand-200">{context.user.full_name}</p>
          <p className="truncate text-xs text-sand-500">
            {context.isSuperAdmin ? "Super Admin" : `${context.permissions.size} permissions`}
          </p>
          <div className="mt-3 flex gap-2">
            <Link
              href="/"
              className="rounded-sm border border-sand-50/20 px-2.5 py-1.5 text-xs text-sand-300 transition-colors hover:text-sand-50"
            >
              View site
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-sm border border-sand-50/20 px-2.5 py-1.5 text-xs text-sand-300 transition-colors hover:text-sand-50"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="border-b border-border bg-surface px-6 py-6 md:px-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-h2 text-brand-800">{title}</h1>
              {standfirst ? (
                <p className="mt-1.5 text-sm text-fg-muted">{standfirst}</p>
              ) : null}
            </div>
            {actions ? <div className="flex gap-2">{actions}</div> : null}
          </div>
        </header>

        <div className="px-6 py-8 md:px-10">{children}</div>
      </main>
    </div>
  );
}

export function AdminCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <>
      <p className="text-xs uppercase tracking-wide text-sand-500">{label}</p>
      <p className="mt-2 font-display text-2xl text-brand-800">{value}</p>
      {hint ? <p className="mt-1 text-xs text-sand-500">{hint}</p> : null}
    </>
  );

  const className =
    "block rounded-sm border border-border bg-surface p-5" +
    (href ? " transition-shadow hover:shadow-raised" : "");

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}

export function AdminEmpty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-sm border border-dashed border-border bg-surface p-10 text-center">
      <h2 className="text-h3 text-brand-800">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">{body}</p>
    </div>
  );
}
