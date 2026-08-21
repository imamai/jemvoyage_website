"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export type ProfileState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name.").max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
});

/**
 * Update the signed-in user's own profile.
 *
 * The update is not filtered by id in application code: RLS on
 * jemvoyage_users restricts UPDATE to `id = auth.uid()` unless the caller holds
 * users.manage, so this cannot be turned into an account-takeover by tampering
 * with the form. Email is intentionally not editable here — changing it would
 * desynchronise auth.users, which four other applications also read.
 */
export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
    }
    return { status: "error", message: "Please check your details.", fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }

  const { error } = await supabase
    .from("jemvoyage_users")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
      updated_by: user.id,
    })
    .eq("id", user.id);

  if (error) {
    console.error("[jemvoyage] profile update failed", {
      code: error.code,
      message: error.message,
    });
    return { status: "error", message: "We could not save that. Please try again." };
  }

  revalidatePath("/account", "layout");
  return { status: "success", message: "Profile updated." };
}
