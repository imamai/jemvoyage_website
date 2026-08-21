import { createStaticClient } from "@/lib/supabase/static";
import { JemImage } from "@/components/media/JemImage";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/section";
import type { MediaRef } from "@/lib/cms/queries";

/**
 * Branded "in development" surface, used wherever a route is planned but its
 * module is not yet wired.
 *
 * Deliberately not styled as an error: a visitor who lands here should feel
 * they arrived somewhere unfinished, not somewhere broken (§76). The imagery
 * still comes from the CMS, so this page ages with the rest of the site.
 */
async function getBackdrop(): Promise<MediaRef | null> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("jemvoyage_media")
    .select(
      "id, storage_bucket, file_path, external_url, alt_text, title, focal_x, focal_y, blur_data_url, is_placeholder, category",
    )
    .eq("category", "hero")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (data as MediaRef) ?? null;
}

export async function ComingSoon({
  eyebrow = "In development",
  title = "This page is on its way",
  body = "We are still building this part of the Jemvoyage experience. In the meantime our team can answer anything you need directly.",
  primaryHref = "/",
  primaryLabel = "Back to home",
  secondaryHref = "/contact",
  secondaryLabel = "Talk to our team",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
} = {}) {
  const backdrop = await getBackdrop();

  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-brand-900">
      <div className="absolute inset-0">
        <JemImage
          media={backdrop}
          aspect="fill"
          sizes="100vw"
          priority
          decorative
          className="h-full w-full"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/75 to-brand-900/55"
      />

      <Container className="relative py-24 text-center">
        <Eyebrow tone="onDark" className="mb-5">
          {eyebrow}
        </Eyebrow>
        <h1 className="mx-auto max-w-3xl text-h1 text-sand-50">{title}</h1>
        <p className="mx-auto mt-6 max-w-xl text-lead text-sand-200">{body}</p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href={primaryHref} variant="onDark" size="lg">
            {primaryLabel}
          </ButtonLink>
          <ButtonLink href={secondaryHref} variant="onDarkOutline" size="lg">
            {secondaryLabel}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
