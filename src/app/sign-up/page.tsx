import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/service";
import { SignUpForm } from "@/components/forms/auth-forms";
import { Container, Eyebrow, Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Jemvoyage account to track your trips and quotations.",
  robots: { index: false, follow: false },
};

export default async function SignUpPage() {
  if (await getCurrentUser()) redirect("/account");

  return (
    <Section tone="canvas" className="min-h-[70vh]">
      <Container>
        <div className="mx-auto max-w-md">
          <Eyebrow className="mb-3 text-center">Get started</Eyebrow>
          <h1 className="text-center text-h2 text-brand-800">Create an account</h1>
          <p className="mt-3 text-center text-sm text-fg-muted">
            Keep your quotations, bookings and documents in one place.
          </p>

          <div className="mt-9 rounded-sm border border-border bg-surface p-6 md:p-8">
            <SignUpForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
