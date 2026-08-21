"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { signUp as signUpUser, JemvoyageSignUpError } from "@/lib/auth/service";

export type AuthState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

/** Only allow relative paths, so `?next=` cannot be used as an open redirect. */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
    }
    return { status: "error", message: "Please check your details.", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Deliberately identical whether the email is unknown or the password is
    // wrong — distinguishing them lets an attacker enumerate accounts.
    return {
      status: "error",
      message: "That email and password do not match an account.",
    };
  }

  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next")));
}

const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please tell us your name.").max(120),
    email: z.string().trim().email("Enter a valid email address."),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    password: z
      .string()
      .min(10, "Use at least 10 characters.")
      .max(200, "That password is too long."),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
    }
    return { status: "error", message: "Please check your details.", fieldErrors };
  }

  try {
    // Routed through the auth service, which guarantees a non-empty full_name
    // and an email — without those, the other applications' signup triggers on
    // this shared auth.users table fail and take the whole transaction down.
    const { error } = await signUpUser({
      email: parsed.data.email,
      password: parsed.data.password,
      fullName: parsed.data.fullName,
      phone: parsed.data.phone || undefined,
    });

    if (error) {
      return {
        status: "error",
        message:
          error.message === "User already registered"
            ? "An account with that email already exists. Try signing in."
            : "We could not create that account. Please try again.",
      };
    }
  } catch (err) {
    if (err instanceof JemvoyageSignUpError) {
      return { status: "error", message: err.message };
    }
    throw err;
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
