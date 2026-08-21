import type { Metadata } from "next";
import { Star } from "lucide-react";

import { createStaticClient } from "@/lib/supabase/static";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import type { JemvoyageReview } from "@/lib/db/types";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Verified reviews from travellers who have completed a journey with Jemvoyage.",
  alternates: { canonical: "/reviews" },
};

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={15}
          aria-hidden
          className={
            n <= rating ? "fill-gold-500 text-gold-500" : "text-sand-300"
          }
        />
      ))}
    </div>
  );
}

export default async function ReviewsPage() {
  const supabase = createStaticClient();

  // RLS restricts anon to approved, non-deleted reviews, so this cannot surface
  // anything awaiting moderation.
  const { data } = await supabase
    .from("jemvoyage_reviews")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(60);

  const reviews = (data ?? []) as JemvoyageReview[];

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating_overall, 0) / reviews.length
      : null;

  return (
    <>
      <PageHero
        eyebrow="In their words"
        title="Reviews"
        standfirst="Every review here comes from a completed Jemvoyage booking and is published only after moderation."
        crumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
      />

      <Section tone="canvas">
        <Container>
          {reviews.length === 0 ? (
            /*
             * Deliberately empty rather than populated with invented
             * testimonials (§62, §70). This page fills itself the moment real,
             * moderated reviews exist — no code change required.
             */
            <div className="mx-auto max-w-xl rounded-sm border border-border bg-surface p-10 text-center">
              <h2 className="text-h3 text-brand-800">No reviews published yet</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                We only publish reviews from travellers who have actually
                completed a journey with us, and every one is moderated before it
                appears. We would rather show nothing than show something we made
                up.
              </p>
              <p className="mt-4 text-sm text-fg-muted">
                If you have travelled with us and would like to leave a review,
                please get in touch.
              </p>
              <ButtonLink href="/contact" className="mt-6">
                Contact us
              </ButtonLink>
            </div>
          ) : (
            <>
              {average !== null ? (
                <div className="mb-10 flex items-center gap-4">
                  <p className="font-display text-4xl text-brand-800">
                    {average.toFixed(1)}
                  </p>
                  <div>
                    <Stars rating={Math.round(average)} />
                    <p className="mt-1 text-xs text-sand-600">
                      Based on {reviews.length}{" "}
                      {reviews.length === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="flex flex-col rounded-sm border border-border bg-surface p-6"
                  >
                    <Stars rating={review.rating_overall} />
                    {review.title ? (
                      <h2 className="mt-3 text-h3 text-brand-800">
                        {review.title}
                      </h2>
                    ) : null}
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
                      {review.body}
                    </p>
                    <footer className="mt-5 border-t border-border pt-4 text-xs text-sand-600">
                      <p className="font-medium text-fg">{review.author_name}</p>
                      <p className="mt-0.5">
                        {[
                          review.author_country,
                          review.travelled_on
                            ? `travelled ${formatDate(review.travelled_on, {
                                month: "long",
                                year: "numeric",
                              })}`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </footer>
                  </article>
                ))}
              </div>
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
