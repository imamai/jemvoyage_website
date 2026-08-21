import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type {
  JemvoyageFaq,
  JemvoyageHeroSlide,
  JemvoyageHomepageSection,
  JemvoyageMedia,
  JemvoyageMenuItem,
} from "@/lib/db/types";

/**
 * Read side of the CMS.
 *
 * Media is fetched separately and joined in memory rather than through
 * PostgREST embedding. Two reasons: the hand-written Database type declares no
 * relationships (deliberately — see lib/db/types.ts), and the homepage needs
 * roughly twenty media rows total, so one extra round trip beats N embedded
 * sub-selects.
 *
 * Every function is wrapped in React's `cache`, so a layout and a page that
 * both need the primary menu share a single query per request.
 */

const MEDIA_COLUMNS =
  "id, storage_bucket, file_path, external_url, alt_text, title, focal_x, focal_y, blur_data_url, is_placeholder, category";

export type MediaRef = Pick<
  JemvoyageMedia,
  | "id" | "storage_bucket" | "file_path" | "external_url" | "alt_text"
  | "title" | "focal_x" | "focal_y" | "blur_data_url" | "is_placeholder"
  | "category"
>;

/** Look up several media rows at once, keyed by id. */
export const getMediaByIds = cache(
  async (ids: (string | null | undefined)[]): Promise<Map<string, MediaRef>> => {
    const unique = [...new Set(ids.filter((id): id is string => Boolean(id)))];
    if (unique.length === 0) return new Map();

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("jemvoyage_media")
      .select(MEDIA_COLUMNS)
      .in("id", unique);

    if (error || !data) return new Map();
    return new Map(data.map((m) => [m.id, m as MediaRef]));
  },
);

export type HeroSlideWithMedia = JemvoyageHeroSlide & {
  desktopMedia: MediaRef | null;
  mobileMedia: MediaRef | null;
};

export const getHeroSlides = cache(
  async (placement = "home"): Promise<HeroSlideWithMedia[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("jemvoyage_hero_slides")
      .select("*")
      .eq("placement", placement)
      .order("display_order", { ascending: true });

    if (error || !data) return [];

    const media = await getMediaByIds(
      data.flatMap((s) => [s.desktop_media_id, s.mobile_media_id]),
    );

    return data.map((slide) => ({
      ...slide,
      desktopMedia: slide.desktop_media_id
        ? media.get(slide.desktop_media_id) ?? null
        : null,
      mobileMedia: slide.mobile_media_id
        ? media.get(slide.mobile_media_id) ?? null
        : null,
    }));
  },
);

export type HomepageSectionWithMedia = JemvoyageHomepageSection & {
  media: MediaRef | null;
};

export const getHomepageSections = cache(
  async (): Promise<HomepageSectionWithMedia[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("jemvoyage_homepage_sections")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data) return [];

    const media = await getMediaByIds(data.map((s) => s.media_id));

    return data.map((section) => ({
      ...section,
      media: section.media_id ? media.get(section.media_id) ?? null : null,
    }));
  },
);

/** Sections keyed by section_key, for direct lookup while composing a page. */
export const getHomepageSectionMap = cache(
  async (): Promise<Map<string, HomepageSectionWithMedia>> => {
    const sections = await getHomepageSections();
    return new Map(sections.map((s) => [s.section_key, s]));
  },
);

export const getMenu = cache(
  async (key: string): Promise<JemvoyageMenuItem[]> => {
    const supabase = await createClient();

    const { data: menu } = await supabase
      .from("jemvoyage_menus")
      .select("id")
      .eq("key", key)
      .maybeSingle();

    if (!menu) return [];

    const { data, error } = await supabase
      .from("jemvoyage_menu_items")
      .select("*")
      .eq("menu_id", menu.id)
      .order("display_order", { ascending: true });

    return error || !data ? [] : data;
  },
);

/**
 * Public settings as a plain record. Only rows flagged `is_public` are readable
 * by anon under RLS, so this is safe to call from unauthenticated pages.
 */
export const getPublicSettings = cache(
  async (): Promise<Record<string, unknown>> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("jemvoyage_settings")
      .select("key, value")
      .eq("is_public", true);

    if (error || !data) return {};
    return Object.fromEntries(data.map((row) => [row.key, row.value]));
  },
);

/** Read a public setting as a string, with a fallback for unseeded keys. */
export function settingString(
  settings: Record<string, unknown>,
  key: string,
  fallback = "",
): string {
  const value = settings[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

export const getFaqs = cache(
  async (category?: string): Promise<JemvoyageFaq[]> => {
    const supabase = await createClient();
    let query = supabase
      .from("jemvoyage_faqs")
      .select("*")
      .order("display_order", { ascending: true });

    if (category) query = query.eq("category", category);

    const { data, error } = await query;
    return error || !data ? [] : data;
  },
);
