import type { MetadataRoute } from "next";

import { publicEnv } from "@/lib/env";
import {
  getAllDestinationSlugs,
  getAllTourSlugs,
  getTourCategories,
} from "@/lib/catalogue/queries";
import { getAllVehicleSlugs, getVehicleCategories } from "@/lib/fleet/queries";
// The sitemap is generated without an HTTP request, so it uses the
// cookie-free client. RLS still limits it to published rows.
import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 3600;

/**
 * Only routes with real content are listed. Pages that currently render the
 * "coming soon" panel (/account, /book) are excluded and carry `noindex`, so we
 * never invite a crawler to an empty room.
 */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/tours", priority: 0.9, changeFrequency: "weekly" },
  { path: "/safaris", priority: 0.9, changeFrequency: "weekly" },
  { path: "/destinations", priority: 0.9, changeFrequency: "weekly" },
  { path: "/car-hire", priority: 0.9, changeFrequency: "weekly" },
  { path: "/chauffeur-services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/airport-transfers", priority: 0.8, changeFrequency: "monthly" },
  { path: "/corporate-travel", priority: 0.7, changeFrequency: "monthly" },
  { path: "/travel-agents", priority: 0.6, changeFrequency: "monthly" },
  { path: "/travel-guide", priority: 0.7, changeFrequency: "monthly" },
  { path: "/plan-your-trip", priority: 0.8, changeFrequency: "monthly" },
  { path: "/quote", priority: 0.7, changeFrequency: "monthly" },
  { path: "/offers", priority: 0.6, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/reviews", priority: 0.5, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const now = new Date();

  const supabase = createStaticClient();

  const [
    tourSlugs,
    destinationSlugs,
    vehicleSlugs,
    tourCategories,
    vehicleCategories,
    posts,
  ] = await Promise.all([
    getAllTourSlugs(),
    getAllDestinationSlugs(),
    getAllVehicleSlugs(),
    getTourCategories(),
    getVehicleCategories(),
    supabase
      .from("jemvoyage_blog_posts")
      .select("slug, updated_at")
      .eq("status", "published"),
  ]);

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${base}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...tourSlugs.map((slug) => ({
      url: `${base}/tours/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...tourCategories.map((c) => ({
      url: `${base}/tours/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...destinationSlugs.map((slug) => ({
      url: `${base}/destinations/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...vehicleSlugs.map((slug) => ({
      url: `${base}/cars/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...vehicleCategories.map((c) => ({
      url: `${base}/car-hire/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...(posts.data ?? []).map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
