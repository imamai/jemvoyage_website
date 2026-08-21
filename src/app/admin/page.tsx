import Link from "next/link";

import { requireAdmin } from "@/lib/admin/guard";
import { getAdminDashboard } from "@/lib/admin/queries";
import { AdminShell, AdminCard } from "@/components/admin/admin-shell";

export default async function AdminDashboardPage() {
  const context = await requireAdmin();
  const stats = await getAdminDashboard();

  // Cards only carry an href where the screen exists. The rest are live counts
  // straight from the database, but not yet clickable.
  const groups = [
    {
      heading: "Sales",
      permission: "leads.view",
      cards: [
        { label: "New leads", value: stats.newLeads, href: "/admin/leads", hint: "Awaiting first contact" },
        { label: "Open pipeline", value: stats.openLeads, href: "/admin/leads" },
        { label: "Customers", value: stats.customers },
        { label: "Quotes awaiting", value: stats.quotesAwaiting, hint: "Approval or reply" },
      ],
    },
    {
      heading: "Operations",
      permission: "bookings.view",
      cards: [
        { label: "Upcoming trips", value: stats.bookingsUpcoming },
        { label: "Active rentals", value: stats.activeRentals },
        { label: "Transfers today", value: stats.transfersToday },
        { label: "Outstanding invoices", value: stats.outstandingInvoices },
      ],
    },
    {
      heading: "Content",
      permission: "cms.view",
      cards: [
        { label: "Published tours", value: stats.publishedTours },
        { label: "Published vehicles", value: stats.publishedVehicles },
        {
          label: "Placeholder images",
          value: stats.placeholderMedia,
          href: "/admin/media?placeholder=1",
          hint: "Still need real photography",
        },
        { label: "Reviews to moderate", value: stats.pendingReviews, href: "/admin/reviews" },
      ],
    },
  ].filter((group) => context.can(group.permission));

  return (
    <AdminShell
      context={context}
      activePath="/admin"
      title="Dashboard"
      standfirst={`Signed in as ${context.user.full_name}.`}
    >
      {groups.length === 0 ? (
        <div className="rounded-sm border border-border bg-surface p-8">
          <h2 className="text-h3 text-brand-800">No modules assigned</h2>
          <p className="mt-2 text-sm text-fg-muted">
            Your account is active but has no permissions yet. Ask a Super Admin
            to assign you a role.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.heading}>
              <h2 className="text-h3 text-brand-800">{group.heading}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {group.cards.map((card) => (
                  <AdminCard
                    key={card.label}
                    label={card.label}
                    value={String(card.value)}
                    hint={card.hint}
                    href={card.href}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {stats.placeholderMedia > 0 && context.can("media.view") ? (
        <aside className="mt-10 rounded-sm border border-gold-200 bg-gold-50 p-5">
          <h2 className="text-h3 text-gold-800">
            {stats.placeholderMedia} placeholder images still in use
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-gold-800/80">
            The site is running on licensed stand-in photography. Replace each
            one from the media library and the change appears immediately — no
            developer, no deploy.
          </p>
          <Link
            href="/admin/media?placeholder=1"
            className="mt-4 inline-block rounded-sm bg-gold-500 px-4 py-2 text-sm font-medium text-brand-900"
          >
            Review placeholders
          </Link>
        </aside>
      ) : null}
    </AdminShell>
  );
}
