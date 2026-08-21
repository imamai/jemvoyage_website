import type { Metadata } from "next";

import { getMyBookings } from "@/lib/portal/queries";
import { formatDate, formatMoney, pluralise } from "@/lib/utils";
import { PortalShell, PortalEmpty, StatusBadge } from "@/components/portal/portal-shell";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "My trips",
  robots: { index: false, follow: false },
};

export default async function TripsPage() {
  const bookings = await getMyBookings();
  const today = new Date().toISOString().slice(0, 10);

  const upcoming = bookings.filter(
    (b) => b.end_date >= today && b.status !== "cancelled",
  );
  const past = bookings.filter(
    (b) => b.end_date < today || b.status === "cancelled",
  );

  return (
    <PortalShell
      title="My trips"
      standfirst="Every journey we are arranging or have arranged for you."
      activePath="/account/trips"
    >
      {bookings.length === 0 ? (
        <PortalEmpty
          title="No trips yet"
          body="Once a booking is confirmed it appears here with your itinerary, vehicle, driver and emergency contacts."
          action={<ButtonLink href="/plan-your-trip">Plan a trip</ButtonLink>}
        />
      ) : (
        <div className="space-y-12">
          {[
            { heading: "Upcoming", items: upcoming },
            { heading: "Past", items: past },
          ]
            .filter((group) => group.items.length > 0)
            .map((group) => (
              <section key={group.heading}>
                <h2 className="text-h3 text-brand-800">
                  {group.heading}{" "}
                  <span className="text-sm font-normal text-sand-500">
                    ({group.items.length})
                  </span>
                </h2>
                <ul className="mt-5 space-y-4">
                  {group.items.map((booking) => (
                    <li
                      key={booking.id}
                      className="rounded-sm border border-border bg-surface p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-eyebrow uppercase text-gold-600">
                            {booking.reference}
                          </p>
                          <h3 className="mt-1.5 font-display text-xl text-brand-800">
                            {booking.title}
                          </h3>
                          <p className="mt-2 text-sm text-fg-muted">
                            {formatDate(booking.start_date)} –{" "}
                            {formatDate(booking.end_date)} ·{" "}
                            {pluralise(booking.adults, "adult")}
                            {booking.children > 0
                              ? `, ${pluralise(booking.children, "child", "children")}`
                              : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <StatusBadge status={booking.status} />
                          <p className="mt-2 font-display text-xl text-brand-800">
                            {formatMoney(Number(booking.total), booking.currency)}
                          </p>
                          {Number(booking.balance_due) > 0 ? (
                            <p className="mt-0.5 text-xs text-warning">
                              {formatMoney(Number(booking.balance_due), booking.currency)}{" "}
                              outstanding
                            </p>
                          ) : null}
                        </div>
                      </div>

                      {booking.special_requests ? (
                        <p className="mt-4 border-t border-border pt-4 text-sm text-fg-muted">
                          <span className="font-medium text-fg">Your notes: </span>
                          {booking.special_requests}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </div>
      )}
    </PortalShell>
  );
}
