import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { getMediaByIds, MEDIA_COLUMNS, type MediaRef } from "@/lib/cms/queries";
import type {
  DriveType,
  JemvoyageVehicle,
  JemvoyageVehicleCategory,
  JemvoyageVehicleRate,
} from "@/lib/db/types";

/**
 * Fleet reads for the public car-hire pages.
 *
 * Only `is_published` vehicles are visible to anon under RLS, and the marketing
 * surface never exposes registration-level operational data beyond what a
 * customer needs to choose a vehicle.
 */

export type VehicleWithMedia = JemvoyageVehicle & {
  media: MediaRef | null;
  category: JemvoyageVehicleCategory | null;
  rates: JemvoyageVehicleRate[];
  /** Lowest active daily rate across drive types, for "from" pricing. */
  dailyFrom: number | null;
};

async function decorateVehicles(
  rows: JemvoyageVehicle[],
): Promise<VehicleWithMedia[]> {
  if (rows.length === 0) return [];
  const supabase = await createClient();

  const [media, categories, rates] = await Promise.all([
    getMediaByIds(rows.map((v) => v.primary_media_id)),
    supabase
      .from("jemvoyage_vehicle_categories")
      .select("*")
      .in(
        "id",
        [...new Set(rows.map((v) => v.category_id).filter(Boolean))] as string[],
      ),
    supabase
      .from("jemvoyage_vehicle_rates")
      .select("*")
      .eq("is_active", true)
      .in("vehicle_id", rows.map((v) => v.id)),
  ]);

  const categoryMap = new Map((categories.data ?? []).map((c) => [c.id, c]));

  const ratesByVehicle = new Map<string, JemvoyageVehicleRate[]>();
  for (const rate of rates.data ?? []) {
    if (!rate.vehicle_id) continue;
    const list = ratesByVehicle.get(rate.vehicle_id) ?? [];
    list.push(rate);
    ratesByVehicle.set(rate.vehicle_id, list);
  }

  return rows.map((vehicle) => {
    const vehicleRates = ratesByVehicle.get(vehicle.id) ?? [];
    const dailyRates = vehicleRates
      .map((r) => r.daily_rate)
      .filter((r): r is number => typeof r === "number" && r > 0);

    return {
      ...vehicle,
      media: vehicle.primary_media_id
        ? media.get(vehicle.primary_media_id) ?? null
        : null,
      category: vehicle.category_id
        ? categoryMap.get(vehicle.category_id) ?? null
        : null,
      rates: vehicleRates,
      dailyFrom: dailyRates.length ? Math.min(...dailyRates) : null,
    };
  });
}

export const getVehicles = cache(
  async (opts: {
    limit?: number;
    categorySlug?: string;
    driveType?: DriveType;
  } = {}): Promise<VehicleWithMedia[]> => {
    const supabase = await createClient();

    let query = supabase
      .from("jemvoyage_vehicles")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (opts.driveType === "self_drive") query = query.eq("supports_self_drive", true);
    if (opts.driveType === "chauffeur") query = query.eq("supports_chauffeur", true);
    if (opts.limit) query = query.limit(opts.limit);

    if (opts.categorySlug) {
      const { data: cat } = await supabase
        .from("jemvoyage_vehicle_categories")
        .select("id")
        .eq("slug", opts.categorySlug)
        .maybeSingle();
      if (!cat) return [];
      query = query.eq("category_id", cat.id);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return decorateVehicles(data);
  },
);

export const getVehicleBySlug = cache(
  async (slug: string): Promise<VehicleWithMedia | null> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("jemvoyage_vehicles")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (!data) return null;
    const [decorated] = await decorateVehicles([data]);
    return decorated ?? null;
  },
);

// Called from generateStaticParams, so this whole path — including its media
// lookup — must avoid cookies().
export const getVehicleCategories = cache(
  async (): Promise<(JemvoyageVehicleCategory & { media: MediaRef | null })[]> => {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("jemvoyage_vehicle_categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (!data) return [];

    const mediaIds = [
      ...new Set(data.map((c) => c.media_id).filter(Boolean)),
    ] as string[];

    const media = new Map<string, MediaRef>();
    if (mediaIds.length > 0) {
      const { data: rows } = await supabase
        .from("jemvoyage_media")
        .select(MEDIA_COLUMNS)
        .in("id", mediaIds);
      for (const row of rows ?? []) media.set(row.id, row as MediaRef);
    }

    return data.map((c) => ({
      ...c,
      media: c.media_id ? media.get(c.media_id) ?? null : null,
    }));
  },
);

export const getAllVehicleSlugs = cache(async (): Promise<string[]> => {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("jemvoyage_vehicles")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map((v) => v.slug);
});
