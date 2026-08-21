import type { Metadata } from "next";
import Link from "next/link";

import { getCurrentUser, ensureJemvoyageUser } from "@/lib/auth/service";
import { getPortalSummary, getMyBookings, getMyQuotes } from "@/lib/portal/queries";
import { formatDate, formatMoney } from "@/lib/utils";
import { PortalShell, PortalEmpty, StatusBadge } from "@/components/portal/portal-shell";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Account overview",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  // Self-heals a missing profile row if the shared signup trigger swallowed an
  // error — see lib/auth/service.ts.
  await ensureJemvoyageUser();

  const [user, summary, bookings, quotes] = await Promise.all([
    getCurrentUser(),
    getPortalSummary(),
    getMyBookings(),
    getMyQuotes(),
  ]);

  const firstName = user?.full_name?.split(" ")[0] ?? "there";
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings
    .filter((b) => b.end_date >= today && b.status !== "cancelled")
    .slice(0, 3);
  const recentQuotes = quotes.slice(0, 3);

  const stats = [
    { label: "Upcoming trips", value: String(summary.upcomingTrips), href: "/account/trips" },
    { label: "Active rentals", value: String(summary.activeRentals), href: "/account/rentals" },
    { label: "Open quotations", value: String(summary.openQuotes), href: "/account/quotes" },
    {
      label: "Balance due",
      value: formatMoney(summary.balanceDue, summary.currency),
      href: "/account/invoices",
    },
  ];

  return (
    <PortalShell
      title={`Hello, ${firstName}`}
      standfirst="Everything we are arranging for you, in one place."
      activePath="/account"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.label}>
            <Link
              href={stat.href}
              className="block rounded-sm border border-border bg-surface p-5 transition-shadow hover:shadow-raised"
            >
              <p className="text-xs uppercase tracking-wide text-sand-500">
                {stat.label}
              </p>
              <p className="mt-2 font-display text-2xl text-brand-800">
                {stat.value}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-h2 text-brand-800">Upcoming trips</h2>
          <Link
            href="/account/trips"
            className="text-sm text-brand-600 underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="mt-6">
          {upcoming.length === 0 ? (
            <PortalEmpty
              title="Nothing booked yet"
              body="When you confirm a journey with us it will appear here, with your itinerary, vehicle and driver details."
              action={<ButtonLink href="/tours">Browse tours</ButtonLink>}
            />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-sm border border-border bg-surface">
              {upcoming.map((booking) => (
                <li key={booking.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="font-display text-lg text-brand-800">
                      {booking.title}
                    </p>
                    <p className="mt-1 text-xs text-sand-600">
                      {booking.reference} · {formatDate(booking.start_date)} –{" "}
                      {formatDate(booking.end_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={booking.status} />
                    <p className="text-sm text-fg">
                      {formatMoney(Number(booking.total), booking.currency)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-h2 text-brand-800">Recent quotations</h2>
          <Link
            href="/account/quotes"
            className="text-sm text-brand-600 underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="mt-6">
          {recentQuotes.length === 0 ? (
            <PortalEmpty
              title="No quotations yet"
              body="Ask us for a quotation and it will appear here, itemised and valid for a stated period."
              action={<ButtonLink href="/quote">Request a quotation</ButtonLink>}
            />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-sm border border-border bg-surface">
              {recentQuotes.map((quote) => (
                <li key={quote.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="font-display text-lg text-brand-800">
                      {quote.title}
                    </p>
                    <p className="mt-1 text-xs text-sand-600">
                      {quote.reference}
                      {quote.valid_until
                        ? ` · valid until ${formatDate(quote.valid_until)}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={quote.status} />
                    <p className="text-sm text-fg">
                      {formatMoney(Number(quote.total), quote.currency)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </PortalShell>
  );
}
