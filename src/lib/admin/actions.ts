"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export type AdminActionState = { status: "idle" | "success" | "error"; message?: string };

/**
 * Admin mutations.
 *
 * All of these run under the caller's own session, never the service role —
 * so RLS decides whether the write is allowed, and the audit trigger records
 * who made it. A missing UI-level permission check would hide a button; it
 * could never let an unauthorised write through.
 */

const LEAD_STAGES = [
  "new", "contacted", "qualified", "planning", "quote_sent", "negotiation",
  "deposit_requested", "confirmed", "travelling", "completed", "repeat", "lost",
] as const;

export async function updateLeadStage(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = z
    .object({
      leadId: z.string().uuid(),
      stage: z.enum(LEAD_STAGES),
    })
    .safeParse({
      leadId: formData.get("leadId"),
      stage: formData.get("stage"),
    });

  if (!parsed.success) return { status: "error", message: "Invalid request." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("jemvoyage_leads")
    .update({ stage: parsed.data.stage })
    .eq("id", parsed.data.leadId);

  if (error) {
    console.error("[jemvoyage] lead stage update failed", { code: error.code });
    return {
      status: "error",
      message:
        error.code === "42501"
          ? "You do not have permission to update leads."
          : "Could not update that lead.",
    };
  }

  revalidatePath("/admin/leads");
  return { status: "success", message: "Lead updated." };
}

export async function moderateReview(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = z
    .object({
      reviewId: z.string().uuid(),
      status: z.enum(["approved", "rejected", "hidden", "pending"]),
      notes: z.string().trim().max(1000).optional().or(z.literal("")),
    })
    .safeParse({
      reviewId: formData.get("reviewId"),
      status: formData.get("status"),
      notes: formData.get("notes") ?? "",
    });

  if (!parsed.success) return { status: "error", message: "Invalid request." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("jemvoyage_reviews")
    .update({
      status: parsed.data.status,
      moderated_by: user?.id ?? null,
      moderated_at: new Date().toISOString(),
      moderation_notes: parsed.data.notes || null,
    })
    .eq("id", parsed.data.reviewId);

  if (error) {
    console.error("[jemvoyage] review moderation failed", { code: error.code });
    return { status: "error", message: "Could not update that review." };
  }

  // The public reviews page is statically cached, so it must be invalidated
  // explicitly or an approved review would not appear until the next revalidate.
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/");
  return { status: "success", message: "Review updated." };
}

/** Toggle published state for a tour, destination or vehicle. */
export async function togglePublished(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = z
    .object({
      entity: z.enum(["tour", "destination", "vehicle"]),
      id: z.string().uuid(),
      publish: z.enum(["true", "false"]),
    })
    .safeParse({
      entity: formData.get("entity"),
      id: formData.get("id"),
      publish: formData.get("publish"),
    });

  if (!parsed.success) return { status: "error", message: "Invalid request." };

  const supabase = await createClient();
  const publish = parsed.data.publish === "true";
  const { entity, id } = parsed.data;

  // Branched rather than driven from a lookup table: each of these tables has a
  // different Update shape, and a union of table names with a union of patches
  // gives the client no way to correlate the two.
  let error: { code: string; message: string } | null = null;
  let paths: string[] = [];

  if (entity === "tour") {
    ({ error } = await supabase
      .from("jemvoyage_tours")
      .update({
        status: publish ? "published" : "draft",
        published_at: publish ? new Date().toISOString() : null,
      })
      .eq("id", id));
    paths = ["/tours", "/safaris", "/"];
  } else if (entity === "destination") {
    ({ error } = await supabase
      .from("jemvoyage_destinations")
      .update({ status: publish ? "published" : "draft" })
      .eq("id", id));
    paths = ["/destinations", "/"];
  } else {
    ({ error } = await supabase
      .from("jemvoyage_vehicles")
      .update({ is_published: publish })
      .eq("id", id));
    paths = ["/car-hire", "/"];
  }

  if (error) {
    console.error("[jemvoyage] publish toggle failed", { code: error.code });
    return {
      status: "error",
      message:
        error.code === "42501"
          ? "You do not have permission to publish this."
          : "Could not update that record.",
    };
  }

  revalidatePath(`/admin/${entity}s`);
  for (const path of paths) revalidatePath(path);

  return {
    status: "success",
    message: publish ? "Published." : "Unpublished.",
  };
}
