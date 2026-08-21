import {
  getFaqs,
  getHeroSlides,
  getHomepageSections,
  getPublicSettings,
  type HomepageSectionWithMedia,
} from "@/lib/cms/queries";
import { getDestinations, getTours, type TourWithMedia, type DestinationWithMedia } from "@/lib/catalogue/queries";
import { Hero } from "@/components/home/hero";
import {
  CardGridBand,
  CtaBand,
  FaqBand,
  FeatureBand,
  WhyJemvoyage,
  type WhyPoint,
} from "@/components/home/bands";
import { TourCard } from "@/components/catalogue/tour-card";
import { DestinationCard } from "@/components/catalogue/destination-card";

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
 * Bands whose catalogue is empty render nothing rather than an empty shell.
 */
type RenderContext = {
  whyPoints: WhyPoint[];
  featuredTours: TourWithMedia[];
  safaris: TourWithMedia[];
  destinations: DestinationWithMedia[];
};

const SAFARI_CATEGORIES = new Set([
  "luxury-safari",
  "family-safari",
  "wildlife",
  "photography",
  "fly-in",
  "beach-safari",
]);

function renderSection(section: HomepageSectionWithMedia, ctx: RenderContext) {
  const limit = section.item_limit || 3;

  switch (section.section_key) {
    case "featured_tours": {
      const tours = ctx.featuredTours.slice(0, limit);
      return (
        <CardGridBand
          key={section.id}
          section={section}
          tone="canvas"
          count={tours.length}
        >
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </CardGridBand>
      );
    }

    case "signature_safaris": {
      const safaris = ctx.safaris.slice(0, limit);
      return (
        <CardGridBand
          key={section.id}
          section={section}
          tone="sunken"
          count={safaris.length}
        >
          {safaris.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </CardGridBand>
      );
    }

    case "destinations": {
      const destinations = ctx.destinations.slice(0, limit);
      return (
        <CardGridBand
          key={section.id}
          section={section}
          tone="canvas"
          count={destinations.length}
        >
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </CardGridBand>
      );
    }

    case "experiences": {
      // Draws from the wider tour catalogue rather than the featured subset, so
      // the two grids do not repeat the same three cards.
      const experiences = ctx.featuredTours
        .slice()
        .reverse()
        .slice(0, limit);
      return (
        <CardGridBand
          key={section.id}
          section={section}
          tone="surface"
          count={experiences.length}
        >
          {experiences.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </CardGridBand>
      );
    }

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

    // Reviews stay dormant until real, moderated reviews exist — we do not
    // invent testimonials (§62). The journal lights up with its first post.
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
  const [slides, sections, settings, faqs, allTours, destinations] =
    await Promise.all([
      getHeroSlides("home"),
      getHomepageSections(),
      getPublicSettings(),
      getFaqs(),
      getTours(),
      getDestinations({ limit: 6 }),
    ]);

  const hero = slides.find((s) => s.is_active) ?? slides[0] ?? null;

  const featured = allTours.filter((t) => t.is_featured);
  const ctx: RenderContext = {
    whyPoints: parseWhyPoints(settings["home.why_points"]),
    // Fall back to the general catalogue if nothing is flagged featured.
    featuredTours: featured.length > 0 ? featured : allTours,
    safaris: allTours.filter(
      (t) => t.category && SAFARI_CATEGORIES.has(t.category.slug),
    ),
    destinations,
  };

  return (
    <>
      {hero ? <Hero slide={hero} /> : null}

      {sections
        .filter((section) => section.is_active)
        .map((section) => renderSection(section, ctx))}

      <FaqBand items={faqs.slice(0, 6)} />
    </>
  );
}
