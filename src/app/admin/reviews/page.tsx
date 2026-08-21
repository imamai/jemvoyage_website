import { Star } from "lucide-react";

import { requireAdmin } from "@/lib/admin/guard";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { AdminShell, AdminEmpty } from "@/components/admin/admin-shell";
import { ReviewModeration } from "@/components/admin/review-moderation";
import { StatusBadge } from "@/components/portal/portal-shell";
import type { JemvoyageReview } from "@/lib/db/types";

export const metadata = { title: "Reviews" };

type Props = { searchParams: Promise<{ status?: string }> };

export default async function AdminReviewsPage({ searchParams }: Props) {
  const [context, params] = await Promise.all([
    requireAdmin("reviews.view"),
    searchParams,
  ]);

  const supabase = await createClient();
  let query = supabase
    .from("jemvoyage_reviews")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200);

  if (params.status) query = query.eq("status", params.status);

  const { data } = await query;
  const reviews = (data ?? []) as JemvoyageReview[];
  const canModerate =
    context.can("reviews.moderate") || context.can("reviews.manage");

  return (
    <AdminShell
      context={context}
      activePath="/admin/reviews"
      title="Reviews"
      standfirst="Nothing reaches the public site until it is approved here."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { label: "All", value: undefined },
          { label: "Pending", value: "pending" },
          { label: "Approved", value: "approved" },
          { label: "Rejected", value: "rejected" },
        ].map((f) => (
          <a
            key={f.label}
            href={f.value ? `/admin/reviews?status=${f.value}` : "/admin/reviews"}
            className={
              params.status === f.value
                ? "rounded-sm bg-brand-600 px-3 py-1.5 text-xs text-sand-50"
                : "rounded-sm border border-border bg-surface px-3 py-1.5 text-xs text-sand-700 hover:bg-sand-100"
            }
          >
            {f.label}
          </a>
        ))}
      </div>

      {reviews.length === 0 ? (
        <AdminEmpty
          title="No reviews yet"
          body="Reviews arrive after a completed booking. None have been submitted, and none have been invented — the public reviews page says so plainly rather than showing filler."
        />
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-sm border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex gap-0.5"
                      role="img"
                      aria-label={`${review.rating_overall} out of 5`}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={13}
                          aria-hidden
                          className={
                            n <= review.rating_overall
                              ? "fill-gold-500 text-gold-500"
                              : "text-sand-300"
                          }
                        />
                      ))}
                    </div>
                    <StatusBadge status={review.status} />
                  </div>

                  {review.title ? (
                    <h2 className="mt-2 font-display text-lg text-brand-800">
                      {review.title}
                    </h2>
                  ) : null}
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
                    {review.body}
                  </p>
                  <p className="mt-2 text-xs text-sand-600">
                    {review.author_name}
                    {review.author_country ? ` · ${review.author_country}` : ""}
                    {` · submitted ${formatDate(review.created_at)}`}
                  </p>
                </div>

                {canModerate ? (
                  <ReviewModeration reviewId={review.id} status={review.status} />
                ) : (
                  <p className="text-xs text-sand-500">Read-only</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
