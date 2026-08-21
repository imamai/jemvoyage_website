"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

import { signInAction, signUpAction, type AuthState } from "@/lib/auth/actions";

const initialState: AuthState = { status: "idle" };

const inputClass =
  "h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg " +
  "placeholder:text-sand-400 focus:border-brand-400";

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium uppercase tracking-wide text-sand-600"
      >
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-1.5 text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Submit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 w-full rounded-sm bg-brand-600 px-6 text-sm font-medium text-sand-50 transition-colors hover:bg-brand-500 disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function SignInForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(signInAction, initialState);
  const id = useId();
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <Field label="Email" htmlFor={`${id}-email`} error={err.email}>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
          placeholder="you@example.com"
        />
      </Field>

      <Field label="Password" htmlFor={`${id}-password`} error={err.password}>
        <input
          id={`${id}-password`}
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <Submit label="Sign in" pendingLabel="Signing in…" />

      <p className="text-center text-sm text-fg-muted">
        No account yet?{" "}
        <Link href="/sign-up" className="text-brand-600 underline underline-offset-2">
          Create one
        </Link>
      </p>
    </form>
  );
}

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);
  const id = useId();
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Full name" htmlFor={`${id}-name`} error={err.fullName}>
        <input
          id={`${id}-name`}
          name="fullName"
          required
          autoComplete="name"
          className={inputClass}
          placeholder="Your name"
        />
      </Field>

      <Field label="Email" htmlFor={`${id}-email`} error={err.email}>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
          placeholder="you@example.com"
        />
      </Field>

      <Field label="Phone (optional)" htmlFor={`${id}-phone`} error={err.phone}>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          className={inputClass}
          placeholder="+254 …"
        />
      </Field>

      <Field label="Password" htmlFor={`${id}-password`} error={err.password}>
        <input
          id={`${id}-password`}
          name="password"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-sand-500">At least 10 characters.</p>
      </Field>

      <Field
        label="Confirm password"
        htmlFor={`${id}-confirm`}
        error={err.confirmPassword}
      >
        <input
          id={`${id}-confirm`}
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <Submit label="Create account" pendingLabel="Creating…" />

      <p className="text-center text-sm text-fg-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-brand-600 underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </form>
  );
}
