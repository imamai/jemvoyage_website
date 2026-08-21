import { publicEnv } from "@/lib/env";
import type { JemvoyageMedia, JemvoyageStorageBucket } from "@/lib/db/types";

/** Buckets whose objects are served straight off the CDN with no signing. */
const PUBLIC_BUCKETS: ReadonlySet<string> = new Set<JemvoyageStorageBucket>([
  "jemvoyage-media",
  "jemvoyage-tour-media",
  "jemvoyage-vehicle-images",
]);

export function isPublicBucket(bucket: string): boolean {
  return PUBLIC_BUCKETS.has(bucket);
}

/**
 * Resolve a media row to a renderable URL.
 *
 * Precedence is deliberate: an uploaded object always wins over the development
 * placeholder. The moment an administrator uploads the real photograph,
 * `file_path` is populated and `external_url` stops being consulted — no code
 * change, no redeploy (§44, §49).
 *
 * Returns null for private-bucket objects: those must go through
 * `createSignedMediaUrl`, never a guessable public path.
 */
export function mediaUrl(media: Pick<
  JemvoyageMedia,
  "storage_bucket" | "file_path" | "external_url"
> | null | undefined): string | null {
  if (!media) return null;

  if (media.file_path) {
    if (!isPublicBucket(media.storage_bucket)) return null;
    const base = publicEnv.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
    const path = media.file_path.replace(/^\//, "");
    return `${base}/storage/v1/object/public/${media.storage_bucket}/${path}`;
  }

  return media.external_url ?? null;
}

/**
 * Alt text with a sensible cascade. Never returns the filename — a screen
 * reader announcing "IMG_4021.jpg" is worse than an empty string.
 */
export function mediaAlt(
  media: Pick<JemvoyageMedia, "alt_text" | "title"> | null | undefined,
  fallback = "",
): string {
  return media?.alt_text?.trim() || media?.title?.trim() || fallback;
}

/** CSS object-position from the art-directed focal point. */
export function mediaFocalPosition(
  media: Pick<JemvoyageMedia, "focal_x" | "focal_y"> | null | undefined,
): string {
  const x = Math.round((media?.focal_x ?? 0.5) * 100);
  const y = Math.round((media?.focal_y ?? 0.5) * 100);
  return `${x}% ${y}%`;
}
