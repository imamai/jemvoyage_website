import { requireAdmin } from "@/lib/admin/guard";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatMoney, pluralise } from "@/lib/utils";
import { AdminShell, AdminEmpty } from "@/components/admin/admin-shell";
import { LeadStageForm } from "@/components/admin/lead-stage-form";
import { StatusBadge } from "@/components/portal/portal-shell";
import type { JemvoyageLead } from "@/lib/db/types";

export const metadata = { title: "Leads" };

const OPEN_STAGES = [
  "new", "contacted", "qualified", "planning", "quote_sent",
  "negotiation", "deposit_requested", "confirmed", "travelling",
];

type Props = { searchParams: Promise<{ stage?: string }> };

export default async function AdminLeadsPage({ searchParams }: Props) {
  const [context, params] = await Promise.all([
    requireAdmin("leads.view"),
    searchParams,
  ]);

  const supabase = await createClient();
  let query = supabase
    .from("jemvoyage_leads")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200);

  if (params.stage === "open") query = query.in("stage", OPEN_STAGES);
  else if (params.stage) query = query.eq("stage", params.stage);

  const { data } = await query;
  const leads = (data ?? []) as JemvoyageLead[];
  const canManage = context.can("leads.manage");

  const filters = [
    { label: "All", value: undefined },
    { label: "Open", value: "open" },
    { label: "New", value: "new" },
    { label: "Quote sent", value: "quote_sent" },
    { label: "Lost", value: "lost" },
  ];

  return (
    <AdminShell
      context={context}
      activePath="/admin/leads"
      title="Leads"
      standfirst={`${leads.length} ${leads.length === 1 ? "enquiry" : "enquiries"} shown. Enquiries from the website arrive here automatically.`}
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active = params.stage === filter.value;
          return (
            <a
              key={filter.label}
              href={filter.value ? `/admin/leads?stage=${filter.value}` : "/admin/leads"}
              className={
                active
                  ? "rounded-sm bg-brand-600 px-3 py-1.5 text-xs text-sand-50"
                  : "rounded-sm border border-border bg-surface px-3 py-1.5 text-xs text-sand-700 hover:bg-sand-100"
              }
            >
              {filter.label}
            </a>
          );
        })}
      </div>

      {leads.length === 0 ? (
        <AdminEmpty
          title="No enquiries yet"
          body="Submissions from the contact, quote and trip-planning forms appear here the moment they arrive."
        />
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <article
              key={lead.id}
              className="rounded-sm border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg text-brand-800">
                      {lead.full_name}
                    </h2>
                    <StatusBadge status={lead.stage} />
                    {lead.priority !== "normal" ? (
                      <StatusBadge status={lead.priority} />
                    ) : null}
                  </div>

                  <p className="mt-1 text-xs text-sand-600">
                    {lead.reference} · {formatDate(lead.created_at)}
                    {lead.service_interest
                      ? ` · ${lead.service_interest.replace(/_/g, " ")}`
                      : ""}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    {lead.email ? (
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-brand-600 underline-offset-2 hover:underline"
                      >
                        {lead.email}
                      </a>
                    ) : null}
                    {lead.phone ? (
                      <a
                        href={`tel:${lead.phone.replace(/\s+/g, "")}`}
                        className="text-brand-600 underline-offset-2 hover:underline"
                      >
                        {lead.phone}
                      </a>
                    ) : null}
                    {lead.country ? (
                      <span className="text-fg-muted">{lead.country}</span>
                    ) : null}
                  </div>

                  <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-sand-600">
                    <div className="flex gap-1.5">
                      <dt>Party:</dt>
                      <dd>
                        {pluralise(lead.adults, "adult")}
                        {lead.children > 0
                          ? `, ${pluralise(lead.children, "child", "children")}`
                          : ""}
                      </dd>
                    </div>
                    {lead.travel_start_date ? (
                      <div className="flex gap-1.5">
                        <dt>Travelling:</dt>
                        <dd>{formatDate(lead.travel_start_date)}</dd>
                      </div>
                    ) : null}
                    {lead.budget_max ? (
                      <div className="flex gap-1.5">
                        <dt>Budget:</dt>
                        <dd>
                          up to {formatMoney(Number(lead.budget_max), lead.currency)}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  {lead.message ? (
                    <p className="mt-3 max-w-2xl border-l-2 border-border pl-3 text-sm leading-relaxed text-fg-muted">
                      {lead.message}
                    </p>
                  ) : null}
                </div>

                <div className="shrink-0">
                  <LeadStageForm
                    leadId={lead.id}
                    stage={lead.stage}
                    disabled={!canManage}
                  />
                  {!canManage ? (
                    <p className="mt-1.5 text-right text-[0.65rem] text-sand-500">
                      Read-only
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
