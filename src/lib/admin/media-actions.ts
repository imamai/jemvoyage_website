"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import type { JemvoyageStorageBucket } from "@/lib/db/types";

export type MediaActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const MAX_BYTES = 25 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
]);

const CATEGORIES = [
  "general", "hero", "tours", "safaris", "destinations", "vehicles", "fleet",
  "lodging", "activities", "blog", "offers", "corporate", "team", "testimonials",
] as const;

/** Public marketing buckets only — this action never writes private buckets. */
const BUCKET_FOR_CATEGORY: Record<string, JemvoyageStorageBucket> = {
  tours: "jemvoyage-tour-media",
  safaris: "jemvoyage-tour-media",
  vehicles: "jemvoyage-vehicle-images",
  fleet: "jemvoyage-vehicle-images",
};

function safeFileName(name: string): string {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-120);
  return cleaned || "upload";
}

/**
 * Upload a new image into the media library.
 *
 * Runs under the administrator's own session, so the storage policy
 * (`media.manage`) and the table policy both apply — this is not a service-role
 * back door. Validation here is a courtesy to the user; the bucket's own
 * mime/size limits are the real ceiling.
 */
export async function uploadMedia(
  _prev: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose an image to upload." };
  }
  if (file.size > MAX_BYTES) {
    return { status: "error", message: "That file is larger than 25 MB." };
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return {
      status: "error",
      message: "Use a JPEG, PNG, WebP, AVIF or SVG image.",
    };
  }

  const parsed = z
    .object({
      category: z.enum(CATEGORIES),
      title: z.string().trim().max(200).optional().or(z.literal("")),
      altText: z.string().trim().max(300).optional().or(z.literal("")),
      /** When set, the new file replaces this row's image in place. */
      replacesId: z.string().uuid().optional().or(z.literal("")),
    })
    .safeParse({
      category: formData.get("category") ?? "general",
      title: formData.get("title") ?? "",
      altText: formData.get("altText") ?? "",
      replacesId: formData.get("replacesId") ?? "",
    });

  if (!parsed.success) {
    return { status: "error", message: "Check the category and try again." };
  }

  const { category, title, altText, replacesId } = parsed.data;
  const bucket = BUCKET_FOR_CATEGORY[category] ?? "jemvoyage-media";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = `${category}/${Date.now()}-${safeFileName(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  if (uploadError) {
    console.error("[jemvoyage] media upload failed", uploadError.message);
    return {
      status: "error",
      message:
        uploadError.message.toLowerCase().includes("policy") ||
        uploadError.message.toLowerCase().includes("unauthorized")
          ? "You do not have permission to upload media."
          : "The upload failed. Please try again.",
    };
  }

  if (replacesId) {
    // §44: replacing points the existing row at the uploaded object and clears
    // the placeholder flag. Every tour, vehicle and hero already referencing
    // this media id picks up the new photograph with no further edits.
    const { error } = await supabase
      .from("jemvoyage_media")
      .update({
        storage_bucket: bucket,
        file_path: path,
        file_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        is_placeholder: false,
        ...(title ? { title } : {}),
        ...(altText ? { alt_text: altText } : {}),
      })
      .eq("id", replacesId);

    if (error) {
      // The object is already stored; roll it back so we do not orphan it.
      await supabase.storage.from(bucket).remove([path]);
      console.error("[jemvoyage] media replace failed", { code: error.code });
      return { status: "error", message: "Could not update that media record." };
    }
  } else {
    const { error } = await supabase.from("jemvoyage_media").insert({
      storage_bucket: bucket,
      file_path: path,
      file_name: file.name,
      mime_type: file.type,
      file_size: file.size,
      category,
      title: title || file.name,
      alt_text: altText || null,
      is_placeholder: false,
      uploaded_by: user?.id ?? null,
    });

    if (error) {
      await supabase.storage.from(bucket).remove([path]);
      console.error("[jemvoyage] media insert failed", { code: error.code });
      return { status: "error", message: "Could not save that media record." };
    }
  }

  revalidatePath("/admin/media");
  revalidatePath("/", "layout");

  return {
    status: "success",
    message: replacesId ? "Image replaced." : "Image uploaded.",
  };
}

/** Edit the descriptive fields that drive accessibility and search. */
export async function updateMediaDetails(
  _prev: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> {
  const parsed = z
    .object({
      id: z.string().uuid(),
      title: z.string().trim().max(200).optional().or(z.literal("")),
      altText: z.string().trim().max(300).optional().or(z.literal("")),
      caption: z.string().trim().max(500).optional().or(z.literal("")),
    })
    .safeParse({
      id: formData.get("id"),
      title: formData.get("title") ?? "",
      altText: formData.get("altText") ?? "",
      caption: formData.get("caption") ?? "",
    });

  if (!parsed.success) return { status: "error", message: "Invalid request." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("jemvoyage_media")
    .update({
      title: parsed.data.title || null,
      alt_text: parsed.data.altText || null,
      caption: parsed.data.caption || null,
    })
    .eq("id", parsed.data.id);

  if (error) {
    return { status: "error", message: "Could not save those details." };
  }

  revalidatePath("/admin/media");
  revalidatePath("/", "layout");
  return { status: "success", message: "Details saved." };
}

/**
 * Soft-delete a media row.
 *
 * §44: the stored object is deliberately NOT removed. Anything still pointing
 * at this row falls back to a category placeholder rather than breaking, and
 * an accidental delete stays recoverable.
 */
export async function archiveMedia(
  _prev: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> {
  const parsed = z
    .object({ id: z.string().uuid() })
    .safeParse({ id: formData.get("id") });

  if (!parsed.success) return { status: "error", message: "Invalid request." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("jemvoyage_media")
    .update({ is_active: false, deleted_at: new Date().toISOString() })
    .eq("id", parsed.data.id);

  if (error) {
    return { status: "error", message: "Could not archive that image." };
  }

  revalidatePath("/admin/media");
  revalidatePath("/", "layout");
  return { status: "success", message: "Image archived." };
}
