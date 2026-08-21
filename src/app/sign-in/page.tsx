import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/service";
import { SignInForm } from "@/components/forms/auth-forms";
import { Container, Eyebrow, Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Jemvoyage account.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ next?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const [{ next }, user] = await Promise.all([searchParams, getCurrentUser()]);

  if (user) redirect(next?.startsWith("/") ? next : "/account");

  return (
    <Section tone="canvas" className="min-h-[70vh]">
      <Container>
        <div className="mx-auto max-w-md">
          <Eyebrow className="mb-3 text-center">Welcome back</Eyebrow>
          <h1 className="text-center text-h2 text-brand-800">Sign in</h1>
          <p className="mt-3 text-center text-sm text-fg-muted">
            Access your trips, quotations and travel documents.
          </p>

          <div className="mt-9 rounded-sm border border-border bg-surface p-6 md:p-8">
            <SignInForm next={next} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
