"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/section";

/**
 * Route-level error boundary.
 *
 * §69: a customer never sees a stack trace or a database message. They see a
 * plain apology and a way forward; the technical detail stays in the server log
 * and is identified only by Next's error `digest`, which support can quote back
 * to an engineer.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Reaches the server log / observability sink, never the page.
    console.error("[jemvoyage] route error", {
      digest: error.digest,
      message: error.message,
    });
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center bg-canvas">
      <Container className="py-24 text-center">
        <Eyebrow className="mb-5">Something went wrong</Eyebrow>
        <h1 className="mx-auto max-w-2xl text-h1 text-brand-800">
          We could not load this page
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lead text-fg-muted">
          The problem is on our side, not yours. Try again in a moment — if it
          persists, our team can help you directly.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} size="lg">
            Try again
          </Button>
          <Link
            href="/contact"
            className="inline-flex h-13 items-center justify-center rounded-sm border border-brand-600 px-8 text-base text-brand-700 transition-colors hover:bg-brand-600 hover:text-sand-50"
          >
            Contact us
          </Link>
        </div>

        {error.digest ? (
          <p className="mt-8 text-xs text-sand-500">
            Reference: <code className="font-mono">{error.digest}</code>
          </p>
        ) : null}
      </Container>
    </section>
  );
}
