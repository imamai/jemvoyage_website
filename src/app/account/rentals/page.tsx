import type { Metadata } from "next";

import { getMyRentals } from "@/lib/portal/queries";
import { formatDate, formatMoney } from "@/lib/utils";
import { PortalShell, PortalEmpty, StatusBadge } from "@/components/portal/portal-shell";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "My rentals",
  robots: { index: false, follow: false },
};

export default async function RentalsPage() {
  const rentals = await getMyRentals();

  return (
    <PortalShell
      title="My rentals"
      standfirst="Vehicle hire, past and present, with collection and return details."
      activePath="/account/rentals"
    >
      {rentals.length === 0 ? (
        <PortalEmpty
          title="No rentals yet"
          body="When you hire a vehicle from us it appears here, along with your agreement, deposit status and inspection reports."
          action={<ButtonLink href="/car-hire">Browse the fleet</ButtonLink>}
        />
      ) : (
        <ul className="space-y-4">
          {rentals.map((rental) => (
            <li
              key={rental.id}
              className="rounded-sm border border-border bg-surface p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-eyebrow uppercase text-gold-600">
                    {rental.reference}
                  </p>
                  <h2 className="mt-1.5 font-display text-xl text-brand-800">
                    {rental.drive_type === "chauffeur"
                      ? "Chauffeur-driven hire"
                      : "Self-drive hire"}
                  </h2>
                  <dl className="mt-3 grid gap-x-8 gap-y-1.5 text-sm text-fg-muted sm:grid-cols-2">
                    <div className="flex gap-2">
                      <dt className="text-sand-500">Collect:</dt>
                      <dd>
                        {rental.pickup_location} ·{" "}
                        {formatDate(rental.starts_at, {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-sand-500">Return:</dt>
                      <dd>
                        {rental.dropoff_location} ·{" "}
                        {formatDate(rental.ends_at, {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="text-right">
                  <StatusBadge status={rental.status} />
                  <p className="mt-2 font-display text-xl text-brand-800">
                    {formatMoney(Number(rental.total), rental.currency)}
                  </p>
                  {Number(rental.balance_due) > 0 ? (
                    <p className="mt-0.5 text-xs text-warning">
                      {formatMoney(Number(rental.balance_due), rental.currency)}{" "}
                      outstanding
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-5">
                {["reserved", "confirmed", "active"].includes(rental.status) ? (
                  <ButtonLink
                    href={`/contact?rental=${rental.reference}`}
                    variant="outline"
                    size="sm"
                  >
                    Request an extension
                  </ButtonLink>
                ) : null}
                <ButtonLink
                  href={`/contact?rental=${rental.reference}`}
                  variant="ghost"
                  size="sm"
                >
                  Ask about this rental
                </ButtonLink>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
