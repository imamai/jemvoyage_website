"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { subscribeToNewsletter, type SubscribeState } from "@/lib/cms/actions";

const initialState: SubscribeState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 shrink-0 rounded-sm bg-gold-500 px-6 text-sm font-medium text-brand-900 transition-colors hover:bg-gold-400 disabled:opacity-60"
    >
      {pending ? "Signing up…" : "Subscribe"}
    </button>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeToNewsletter, initialState);

  return (
    <form action={formAction} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-describedby={state.message ? "newsletter-status" : undefined}
          aria-invalid={state.status === "error" || undefined}
          className="h-12 w-full rounded-sm border border-sand-50/20 bg-sand-50/5 px-4 text-sm text-sand-50 placeholder:text-sand-400"
        />
        <SubmitButton />
      </div>

      {state.message ? (
        <p
          id="newsletter-status"
          role="status"
          aria-live="polite"
          className={
            state.status === "error"
              ? "mt-3 text-sm text-clay-300"
              : "mt-3 text-sm text-gold-300"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
