import { getFaqs, getHeroSlides, getHomepageSections, getPublicSettings } from "@/lib/cms/queries";
import { Hero } from "@/components/home/hero";
import {
  CtaBand,
  FaqBand,
  FeatureBand,
  WhyJemvoyage,
  type WhyPoint,
} from "@/components/home/bands";
import type { HomepageSectionWithMedia } from "@/lib/cms/queries";

// Content is CMS-managed and changes rarely; revalidate hourly rather than
// hitting the database on every request.
export const revalidate = 3600;

/**
 * Homepage.
 *
 * The page does not hard-code its own running order. It reads
 * jemvoyage_homepage_sections and renders whatever is active, in the order an
 * administrator set — so bands can be reordered, retitled, re-imaged or
 * switched off from the CMS with no deploy (§11, §33).
 *
 * Section keys whose data source is not built yet render nothing rather than an
 * empty shell. They will light up on their own once the catalogue tables land,
 * with no change to this file.
 */
function renderSection(
  section: HomepageSectionWithMedia,
  ctx: { whyPoints: WhyPoint[] },
) {
  switch (section.section_key) {
    case "why_jemvoyage":
      return (
        <WhyJemvoyage key={section.id} section={section} points={ctx.whyPoints} />
      );

    case "car_hire":
      return <FeatureBand key={section.id} section={section} tone="surface" />;

    case "airport_transfers":
      return (
        <FeatureBand key={section.id} section={section} reverse tone="canvas" />
      );

    case "luxury":
      return <FeatureBand key={section.id} section={section} tone="sunken" />;

    case "corporate":
      return (
        <FeatureBand key={section.id} section={section} reverse tone="surface" />
      );

    case "plan_journey":
      return <CtaBand key={section.id} section={section} />;

    // Awaiting the catalogue, CRM and review modules. Intentionally silent.
    case "featured_tours":
    case "signature_safaris":
    case "destinations":
    case "experiences":
    case "reviews":
    case "inspiration":
      return null;

    // The newsletter band lives in the footer on every page.
    case "newsletter":
      return null;

    default:
      return null;
  }
}

function parseWhyPoints(value: unknown): WhyPoint[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const { title, description } = entry as Record<string, unknown>;
    if (typeof title !== "string" || typeof description !== "string") return [];
    return [{ title, description }];
  });
}

export default async function HomePage() {
  const [slides, sections, settings, faqs] = await Promise.all([
    getHeroSlides("home"),
    getHomepageSections(),
    getPublicSettings(),
    getFaqs(),
  ]);

  const hero = slides.find((s) => s.is_active) ?? slides[0] ?? null;
  const whyPoints = parseWhyPoints(settings["home.why_points"]);

  return (
    <>
      {hero ? <Hero slide={hero} /> : null}

      {sections
        .filter((section) => section.is_active)
        .map((section) => renderSection(section, { whyPoints }))}

      <FaqBand items={faqs.slice(0, 6)} />
    </>
  );
}
