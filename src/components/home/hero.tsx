import { JemImage } from "@/components/media/JemImage";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import type { HeroSlideWithMedia } from "@/lib/cms/queries";

const OVERLAY_CLASS = {
  none: "",
  "gradient-bottom":
    "bg-gradient-to-t from-brand-900 via-brand-900/45 to-brand-900/10",
  "gradient-left":
    "bg-gradient-to-r from-brand-900 via-brand-900/50 to-transparent",
  scrim: "bg-brand-900",
  vignette:
    "bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-brand-900)_120%)]",
} as const;

/**
 * Cinematic hero.
 *
 * Desktop and mobile carry separate media rows (§39, §45) — this is art
 * direction, not a single wide image squeezed into a phone. Both come from the
 * CMS, so the photograph changes without a deploy.
 */
export function Hero({ slide }: { slide: HeroSlideWithMedia }) {
  const overlay =
    OVERLAY_CLASS[slide.overlay_style as keyof typeof OVERLAY_CLASS] ??
    OVERLAY_CLASS["gradient-bottom"];

  const mobileMedia = slide.mobileMedia ?? slide.desktopMedia;

  return (
    <section className="relative isolate min-h-[36rem] overflow-hidden bg-brand-900 md:min-h-[44rem] lg:min-h-[46rem]">
      {/* Mobile art direction: portrait-friendly crop. */}
      <div className="absolute inset-0 md:hidden">
        <JemImage
          media={mobileMedia}
          aspect="fill"
          sizes="100vw"
          priority
          decorative
          className="h-full w-full"
        />
      </div>

      {/* Desktop art direction. */}
      <div className="absolute inset-0 hidden md:block">
        <JemImage
          media={slide.desktopMedia}
          aspect="fill"
          sizes="100vw"
          priority
          decorative
          className="h-full w-full"
        />
      </div>

      <div
        aria-hidden
        className={cn("absolute inset-0")}
        style={{ opacity: slide.overlay_opacity }}
      >
        <div className={cn("h-full w-full", overlay)} />
      </div>

      <Container className="relative flex min-h-[36rem] flex-col justify-end pb-16 pt-32 md:min-h-[44rem] md:pb-24 lg:min-h-[46rem]">
        <div className="max-w-3xl">
          {slide.eyebrow ? (
            <Eyebrow tone="onDark" className="mb-5">
              {slide.eyebrow}
            </Eyebrow>
          ) : null}

          <h1 className="text-display text-sand-50">{slide.headline}</h1>

          {slide.subheadline ? (
            <p className="mt-6 max-w-xl text-lead text-sand-200">
              {slide.subheadline}
            </p>
          ) : null}

          <div className="mt-9 flex flex-wrap gap-3">
            {slide.cta_label && slide.cta_url ? (
              <ButtonLink href={slide.cta_url} variant="onDark" size="lg">
                {slide.cta_label}
              </ButtonLink>
            ) : null}
            {slide.secondary_cta_label && slide.secondary_cta_url ? (
              <ButtonLink
                href={slide.secondary_cta_url}
                variant="onDarkOutline"
                size="lg"
              >
                {slide.secondary_cta_label}
              </ButtonLink>
            ) : null}
            <ButtonLink
              href="/plan-your-trip"
              variant="onDarkOutline"
              size="lg"
              className="hidden sm:inline-flex"
            >
              Plan my trip
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
