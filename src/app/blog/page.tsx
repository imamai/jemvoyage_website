import type { Metadata } from "next";
import Link from "next/link";

import { createStaticClient } from "@/lib/supabase/static";
import { getMediaByIds } from "@/lib/cms/queries";
import { formatDate } from "@/lib/utils";
import { JemImage } from "@/components/media/JemImage";
import { PageHero } from "@/components/site/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import type { JemvoyageBlogCategory, JemvoyageBlogPost } from "@/lib/db/types";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Travel journal",
  description:
    "Guides, seasons and practical advice on travelling in Kenya and East Africa, written by the Jemvoyage planning team.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const supabase = createStaticClient();

  const [postsResult, categoriesResult] = await Promise.all([
    supabase
      .from("jemvoyage_blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(30),
    supabase
      .from("jemvoyage_blog_categories")
      .select("*")
      .order("display_order", { ascending: true }),
  ]);

  const posts = (postsResult.data ?? []) as JemvoyageBlogPost[];
  const categories = (categoriesResult.data ?? []) as JemvoyageBlogCategory[];
  const media = await getMediaByIds(posts.map((p) => p.featured_media_id));

  return (
    <>
      <PageHero
        eyebrow="Travel journal"
        title="Notes from Kenya"
        standfirst="Seasons, routes and the practical detail that makes a difference — written by the people who plan the trips."
        crumbs={[{ label: "Home", href: "/" }, { label: "Journal" }]}
      />

      <Section tone="canvas">
        <Container>
          {posts.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-sm border border-border bg-surface p-10 text-center">
              <h2 className="text-h3 text-brand-800">
                The journal is just getting started
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                We are writing our first pieces on migration timing, self-drive
                routes and what to pack for the Mara. In the meantime, our
                planners will answer any of it directly.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/contact">Ask a question</ButtonLink>
                <ButtonLink href="/faq" variant="outline">
                  Read the FAQ
                </ButtonLink>
              </div>

              {categories.length > 0 ? (
                <div className="mt-8 border-t border-border pt-6">
                  <p className="text-xs uppercase tracking-wide text-sand-500">
                    Topics we will cover
                  </p>
                  <ul className="mt-3 flex flex-wrap justify-center gap-2">
                    {categories.map((c) => (
                      <li
                        key={c.id}
                        className="rounded-xs bg-sand-100 px-2.5 py-1 text-xs text-sand-700"
                      >
                        {c.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <article
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-sm bg-surface shadow-subtle transition-shadow hover:shadow-lifted"
                >
                  <Link href={`/blog/${post.slug}`} className="overflow-hidden">
                    <JemImage
                      media={
                        post.featured_media_id
                          ? media.get(post.featured_media_id)
                          : null
                      }
                      fallbackAlt={post.title}
                      aspect="hero"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      priority={i < 3}
                      imageClassName="transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    {post.published_at ? (
                      <p className="text-xs text-sand-600">
                        {formatDate(post.published_at)}
                        {post.reading_minutes
                          ? ` · ${post.reading_minutes} min read`
                          : ""}
                      </p>
                    ) : null}
                    <h2 className="mt-2 text-h3 text-brand-800">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="transition-colors hover:text-brand-600"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-fg-muted">
                        {post.excerpt}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
