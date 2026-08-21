"use server";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const subscribeSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  fullName: z.string().trim().max(120).optional(),
  source: z.string().trim().max(60).default("website"),
});

export type SubscribeState = {
  status: "idle" | "success" | "error";
  message?: string;
};

/**
 * Newsletter opt-in.
 *
 * Anonymous visitors hold INSERT but not SELECT on
 * jemvoyage_newsletter_subscribers, so a duplicate address cannot be detected
 * by reading first — that would leak whether an address is already subscribed.
 * We let the unique constraint fire and treat 23505 as success, which is both
 * correct for the user and non-disclosing.
 */
export async function subscribeToNewsletter(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const parsed = subscribeSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName") || undefined,
    source: formData.get("source") || "website",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check your details.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("jemvoyage_newsletter_subscribers")
    .insert({
      email: parsed.data.email,
      full_name: parsed.data.fullName ?? null,
      source: parsed.data.source,
    });

  if (error && error.code !== "23505") {
    return {
      status: "error",
      message: "We could not save that just now. Please try again shortly.",
    };
  }

  return { status: "success", message: "Thank you — you are on the list." };
}
