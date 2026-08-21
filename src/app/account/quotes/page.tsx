import type { Metadata } from "next";

import { getMyQuotes } from "@/lib/portal/queries";
import { formatDate, formatMoney } from "@/lib/utils";
import { PortalShell, PortalEmpty, StatusBadge } from "@/components/portal/portal-shell";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "My quotations",
  robots: { index: false, follow: false },
};

export default async function QuotesPage() {
  const quotes = await getMyQuotes();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <PortalShell
      title="Quotations"
      standfirst="Proposals we have prepared for you, with what is included stated in full."
      activePath="/account/quotes"
    >
      {quotes.length === 0 ? (
        <PortalEmpty
          title="No quotations yet"
          body="Tell us what you have in mind and we will prepare an itemised quotation, usually within one working day."
          action={<ButtonLink href="/quote">Request a quotation</ButtonLink>}
        />
      ) : (
        <ul className="space-y-4">
          {quotes.map((quote) => {
            const expired =
              quote.valid_until !== null && quote.valid_until < today;

            return (
              <li
                key={quote.id}
                className="rounded-sm border border-border bg-surface p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-eyebrow uppercase text-gold-600">
                      {quote.reference}
                      {quote.version > 1 ? ` · version ${quote.version}` : ""}
                    </p>
                    <h2 className="mt-1.5 font-display text-xl text-brand-800">
                      {quote.title}
                    </h2>
                    {quote.summary ? (
                      <p className="mt-2 max-w-xl text-sm text-fg-muted">
                        {quote.summary}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-sand-600">
                      {quote.travel_start_date
                        ? `Travelling ${formatDate(quote.travel_start_date)}`
                        : "Dates to be confirmed"}
                      {quote.valid_until
                        ? ` · ${expired ? "expired" : "valid until"} ${formatDate(quote.valid_until)}`
                        : ""}
                    </p>
                  </div>

                  <div className="text-right">
                    <StatusBadge status={expired ? "expired" : quote.status} />
                    <p className="mt-2 font-display text-xl text-brand-800">
                      {formatMoney(Number(quote.total), quote.currency)}
                    </p>
                  </div>
                </div>

                {quote.customer_notes ? (
                  <p className="mt-4 border-t border-border pt-4 text-sm text-fg-muted">
                    {quote.customer_notes}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-5">
                  <ButtonLink
                    href={`/contact?quote=${quote.reference}`}
                    variant="outline"
                    size="sm"
                  >
                    Ask a question
                  </ButtonLink>
                  {quote.status === "sent" && !expired ? (
                    <ButtonLink href={`/contact?accept=${quote.reference}`} size="sm">
                      Accept this quotation
                    </ButtonLink>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </PortalShell>
  );
}
