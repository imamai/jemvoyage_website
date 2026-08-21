"use server";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

/**
 * Public enquiry capture.
 *
 * Anonymous visitors hold INSERT but not SELECT on jemvoyage_leads, so the
 * insert MUST NOT chain `.select()` — asking for the row back triggers the
 * SELECT policy and fails with 42501. The lead reference is assigned by a
 * SECURITY DEFINER trigger, so nothing here needs to generate one.
 */

const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Please tell us your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  serviceInterest: z
    .enum(["tour", "safari", "car_hire", "chauffeur", "transfer", "corporate", "custom"])
    .optional(),
  travelStartDate: z.string().trim().optional().or(z.literal("")),
  travelEndDate: z.string().trim().optional().or(z.literal("")),
  adults: z.coerce.number().int().min(0).max(60).default(1),
  children: z.coerce.number().int().min(0).max(60).default(0),
  budgetMax: z.coerce.number().min(0).optional(),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  // Hidden context from the page the enquiry was sent from.
  tourSlug: z.string().trim().max(120).optional().or(z.literal("")),
  destinationSlug: z.string().trim().max(120).optional().or(z.literal("")),
  vehicleSlug: z.string().trim().max(120).optional().or(z.literal("")),
  // Honeypot: real people leave this empty.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

function emptyToNull(value: string | undefined): string | null {
  return value && value.trim() ? value.trim() : null;
}

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const parsed = enquirySchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    country: formData.get("country") ?? "",
    serviceInterest: formData.get("serviceInterest") || undefined,
    travelStartDate: formData.get("travelStartDate") ?? "",
    travelEndDate: formData.get("travelEndDate") ?? "",
    adults: formData.get("adults") ?? 1,
    children: formData.get("children") ?? 0,
    budgetMax: formData.get("budgetMax") || undefined,
    message: formData.get("message") ?? "",
    tourSlug: formData.get("tourSlug") ?? "",
    destinationSlug: formData.get("destinationSlug") ?? "",
    vehicleSlug: formData.get("vehicleSlug") ?? "",
    company: formData.get("company") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  // Silently accept bot submissions so they do not learn the trap exists.
  if (data.company) {
    return { status: "success", message: "Thank you — we will be in touch shortly." };
  }

  const supabase = await createClient();

  // Resolve slugs to ids where they were supplied by the originating page.
  const [tour, destination, vehicle, source] = await Promise.all([
    data.tourSlug
      ? supabase.from("jemvoyage_tours").select("id").eq("slug", data.tourSlug).maybeSingle()
      : Promise.resolve({ data: null }),
    data.destinationSlug
      ? supabase
          .from("jemvoyage_destinations")
          .select("id")
          .eq("slug", data.destinationSlug)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    data.vehicleSlug
      ? supabase
          .from("jemvoyage_vehicles")
          .select("id")
          .eq("slug", data.vehicleSlug)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("jemvoyage_lead_sources").select("id").eq("slug", "website").maybeSingle(),
  ]);

  const { error } = await supabase.from("jemvoyage_leads").insert({
    full_name: data.fullName,
    email: data.email,
    phone: emptyToNull(data.phone),
    country: emptyToNull(data.country),
    service_interest: data.serviceInterest ?? null,
    tour_id: tour.data?.id ?? null,
    destination_id: destination.data?.id ?? null,
    vehicle_id: vehicle.data?.id ?? null,
    source_id: source.data?.id ?? null,
    travel_start_date: emptyToNull(data.travelStartDate),
    travel_end_date: emptyToNull(data.travelEndDate),
    adults: data.adults,
    children: data.children,
    budget_max: data.budgetMax ?? null,
    message: emptyToNull(data.message),
    stage: "new",
  });
  // No `.select()` above — see the module comment.

  if (error) {
    // §69: the customer never sees the database message.
    console.error("[jemvoyage] enquiry insert failed", {
      code: error.code,
      message: error.message,
    });
    return {
      status: "error",
      message:
        "We could not send that just now. Please try again, or email us directly.",
    };
  }

  return {
    status: "success",
    message:
      "Thank you — your enquiry is with our travel team. We reply within one working day.",
  };
}
