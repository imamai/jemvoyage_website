import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getMediaByIds } from "@/lib/cms/queries";
import { publicEnv } from "@/lib/env";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import type { JemvoyageBlogPost } from "@/lib/db/types";

export const revalidate = 1800;

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string): Promise<JemvoyageBlogPost | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jemvoyage_blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data as JemvoyageBlogPost) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found" };

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      publishedTime: post.published_at ?? undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const media = await getMediaByIds([post.featured_media_id]);
  const featured = post.featured_media_id
    ? media.get(post.featured_media_id) ?? null
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    url: `${publicEnv.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: publicEnv.NEXT_PUBLIC_SITE_NAME,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={
          post.published_at
            ? formatDate(post.published_at)
            : "Travel journal"
        }
        title={post.title}
        standfirst={post.excerpt}
        media={featured}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Journal", href: "/blog" },
          { label: post.title },
        ]}
      />

      <Section tone="canvas">
        <Container>
          <article className="mx-auto max-w-2xl">
            {post.body ? (
              <div className="whitespace-pre-line text-lead leading-relaxed text-fg-muted">
                {post.body}
              </div>
            ) : (
              <p className="text-fg-muted">This article has no content yet.</p>
            )}

            <footer className="mt-14 rounded-sm border border-border bg-surface p-6 text-center">
              <h2 className="text-h3 text-brand-800">Planning a trip to Kenya?</h2>
              <p className="mt-2 text-sm text-fg-muted">
                Our planners will talk it through with you, with no obligation.
              </p>
              <ButtonLink href="/plan-your-trip" className="mt-5">
                Plan my trip
              </ButtonLink>
            </footer>
          </article>
        </Container>
      </Section>
    </>
  );
}
