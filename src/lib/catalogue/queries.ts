import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { getMediaByIds, type MediaRef } from "@/lib/cms/queries";
import type {
  JemvoyageDestination,
  JemvoyageTour,
  JemvoyageTourCategory,
  JemvoyageTourItinerary,
} from "@/lib/db/types";

/**
 * Catalogue reads.
 *
 * RLS already restricts these tables to published, non-private rows for anon,
 * so the filters below are for ordering and intent rather than for security —
 * a missing `.eq("status", "published")` here cannot leak a draft.
 */

export type TourWithMedia = JemvoyageTour & {
  media: MediaRef | null;
  category: JemvoyageTourCategory | null;
  destination: Pick<JemvoyageDestination, "id" | "slug" | "name" | "region"> | null;
};

export type DestinationWithMedia = JemvoyageDestination & {
  heroMedia: MediaRef | null;
  thumbnailMedia: MediaRef | null;
};

/** Attach media, category and destination to a set of tour rows in 3 queries. */
async function decorateTours(rows: JemvoyageTour[]): Promise<TourWithMedia[]> {
  if (rows.length === 0) return [];
  const supabase = await createClient();

  const [media, categories, destinations] = await Promise.all([
    getMediaByIds(rows.flatMap((t) => [t.thumbnail_media_id, t.primary_media_id])),
    supabase
      .from("jemvoyage_tour_categories")
      .select("*")
      .in(
        "id",
        [...new Set(rows.map((t) => t.category_id).filter(Boolean))] as string[],
      ),
    supabase
      .from("jemvoyage_destinations")
      .select("id, slug, name, region")
      .in(
        "id",
        [...new Set(rows.map((t) => t.primary_destination_id).filter(Boolean))] as string[],
      ),
  ]);

  const categoryMap = new Map((categories.data ?? []).map((c) => [c.id, c]));
  const destinationMap = new Map((destinations.data ?? []).map((d) => [d.id, d]));

  return rows.map((tour) => ({
    ...tour,
    media:
      (tour.thumbnail_media_id ? media.get(tour.thumbnail_media_id) : null) ??
      (tour.primary_media_id ? media.get(tour.primary_media_id) : null) ??
      null,
    category: tour.category_id ? categoryMap.get(tour.category_id) ?? null : null,
    destination: tour.primary_destination_id
      ? destinationMap.get(tour.primary_destination_id) ?? null
      : null,
  }));
}

export const getTours = cache(
  async (opts: {
    limit?: number;
    featuredOnly?: boolean;
    categorySlug?: string;
    destinationSlug?: string;
  } = {}): Promise<TourWithMedia[]> => {
    const supabase = await createClient();

    let query = supabase
      .from("jemvoyage_tours")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true });

    if (opts.featuredOnly) query = query.eq("is_featured", true);
    if (opts.limit) query = query.limit(opts.limit);

    if (opts.categorySlug) {
      const { data: cat } = await supabase
        .from("jemvoyage_tour_categories")
        .select("id")
        .eq("slug", opts.categorySlug)
        .maybeSingle();
      if (!cat) return [];
      query = query.eq("category_id", cat.id);
    }

    if (opts.destinationSlug) {
      const { data: dest } = await supabase
        .from("jemvoyage_destinations")
        .select("id")
        .eq("slug", opts.destinationSlug)
        .maybeSingle();
      if (!dest) return [];
      query = query.eq("primary_destination_id", dest.id);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return decorateTours(data);
  },
);

export type TourDetail = TourWithMedia & {
  heroMedia: MediaRef | null;
  gallery: MediaRef[];
  itinerary: JemvoyageTourItinerary[];
};

export const getTourBySlug = cache(
  async (slug: string): Promise<TourDetail | null> => {
    const supabase = await createClient();

    const { data: tour } = await supabase
      .from("jemvoyage_tours")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!tour) return null;

    const [decorated, itinerary, galleryLinks] = await Promise.all([
      decorateTours([tour]),
      supabase
        .from("jemvoyage_tour_itineraries")
        .select("*")
        .eq("tour_id", tour.id)
        .order("day_number", { ascending: true }),
      supabase
        .from("jemvoyage_tour_media")
        .select("media_id, display_order")
        .eq("tour_id", tour.id)
        .order("display_order", { ascending: true }),
    ]);

    const galleryIds = (galleryLinks.data ?? []).map((g) => g.media_id);
    const [heroMedia, galleryMedia] = await Promise.all([
      getMediaByIds([tour.primary_media_id]),
      getMediaByIds(galleryIds),
    ]);

    return {
      ...decorated[0],
      heroMedia: tour.primary_media_id
        ? heroMedia.get(tour.primary_media_id) ?? null
        : null,
      gallery: galleryIds
        .map((id) => galleryMedia.get(id))
        .filter((m): m is MediaRef => Boolean(m)),
      itinerary: itinerary.data ?? [],
    };
  },
);

// Called from generateStaticParams, so it must not touch cookies().
export const getTourCategories = cache(
  async (): Promise<JemvoyageTourCategory[]> => {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("jemvoyage_tour_categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    return data ?? [];
  },
);

export const getDestinations = cache(
  async (opts: { limit?: number; featuredOnly?: boolean } = {}): Promise<
    DestinationWithMedia[]
  > => {
    const supabase = await createClient();

    let query = supabase
      .from("jemvoyage_destinations")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true });

    if (opts.featuredOnly) query = query.eq("is_featured", true);
    if (opts.limit) query = query.limit(opts.limit);

    const { data, error } = await query;
    if (error || !data) return [];

    const media = await getMediaByIds(
      data.flatMap((d) => [d.hero_media_id, d.thumbnail_media_id]),
    );

    return data.map((d) => ({
      ...d,
      heroMedia: d.hero_media_id ? media.get(d.hero_media_id) ?? null : null,
      thumbnailMedia: d.thumbnail_media_id
        ? media.get(d.thumbnail_media_id) ?? null
        : null,
    }));
  },
);

export const getDestinationBySlug = cache(
  async (slug: string): Promise<DestinationWithMedia | null> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("jemvoyage_destinations")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!data) return null;

    const media = await getMediaByIds([data.hero_media_id, data.thumbnail_media_id]);
    return {
      ...data,
      heroMedia: data.hero_media_id ? media.get(data.hero_media_id) ?? null : null,
      thumbnailMedia: data.thumbnail_media_id
        ? media.get(data.thumbnail_media_id) ?? null
        : null,
    };
  },
);

/** Slugs for generateStaticParams / sitemap — both run without a request. */
export const getAllTourSlugs = cache(async (): Promise<string[]> => {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("jemvoyage_tours")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((t) => t.slug);
});

export const getAllDestinationSlugs = cache(async (): Promise<string[]> => {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("jemvoyage_destinations")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((d) => d.slug);
});
