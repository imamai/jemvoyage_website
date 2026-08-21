import type { Metadata } from "next";

import { getMyInvoices, getMyPayments } from "@/lib/portal/queries";
import { formatDate, formatMoney } from "@/lib/utils";
import { PortalShell, PortalEmpty, StatusBadge } from "@/components/portal/portal-shell";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Invoices & payments",
  robots: { index: false, follow: false },
};

export default async function InvoicesPage() {
  const [invoices, payments] = await Promise.all([
    getMyInvoices(),
    getMyPayments(),
  ]);

  return (
    <PortalShell
      title="Invoices & payments"
      standfirst="What is owed, what is paid, and when each payment was received."
      activePath="/account/invoices"
    >
      <section>
        <h2 className="text-h3 text-brand-800">Invoices</h2>
        <div className="mt-5">
          {invoices.length === 0 ? (
            <PortalEmpty
              title="No invoices yet"
              body="Invoices are issued once a booking is confirmed. Each one itemises exactly what you are paying for."
              action={<ButtonLink href="/quote">Request a quotation</ButtonLink>}
            />
          ) : (
            <div className="overflow-x-auto rounded-sm border border-border bg-surface">
              <table className="w-full min-w-[42rem] text-left text-sm">
                <caption className="sr-only">Your invoices</caption>
                <thead className="border-b border-border text-xs uppercase tracking-wide text-sand-500">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Invoice</th>
                    <th scope="col" className="px-5 py-3 font-medium">Issued</th>
                    <th scope="col" className="px-5 py-3 font-medium">Due</th>
                    <th scope="col" className="px-5 py-3 font-medium">Status</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Total</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Outstanding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-5 py-4 font-medium text-brand-800">
                        {invoice.invoice_number}
                      </td>
                      <td className="px-5 py-4 text-fg-muted">
                        {formatDate(invoice.issue_date)}
                      </td>
                      <td className="px-5 py-4 text-fg-muted">
                        {invoice.due_date ? formatDate(invoice.due_date) : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="px-5 py-4 text-right text-fg">
                        {formatMoney(Number(invoice.total), invoice.currency)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {Number(invoice.balance_due) > 0 ? (
                          <span className="text-warning">
                            {formatMoney(Number(invoice.balance_due), invoice.currency)}
                          </span>
                        ) : (
                          <span className="text-success">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {payments.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-h3 text-brand-800">Payment history</h2>
          <ul className="mt-5 divide-y divide-border overflow-hidden rounded-sm border border-border bg-surface">
            {payments.map((payment) => (
              <li
                key={payment.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div>
                  <p className="font-medium text-fg">
                    {formatMoney(Number(payment.amount), payment.currency)}
                    <span className="ml-2 text-xs font-normal capitalize text-sand-600">
                      via {payment.method.replace(/_/g, " ")}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-sand-600">
                    {payment.reference}
                    {payment.mpesa_receipt ? ` · ${payment.mpesa_receipt}` : ""}
                    {payment.paid_at ? ` · ${formatDate(payment.paid_at)}` : ""}
                  </p>
                </div>
                <StatusBadge status={payment.status} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </PortalShell>
  );
}
