"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { submitEnquiry, type EnquiryState } from "@/lib/crm/actions";

const initialState: EnquiryState = { status: "idle" };

const SERVICES = [
  { value: "tour", label: "Tour" },
  { value: "safari", label: "Safari" },
  { value: "car_hire", label: "Car hire" },
  { value: "chauffeur", label: "Chauffeur service" },
  { value: "transfer", label: "Airport transfer" },
  { value: "corporate", label: "Corporate travel" },
  { value: "custom", label: "Something custom" },
] as const;

const inputClass =
  "h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg " +
  "placeholder:text-sand-400 focus:border-brand-400";

const labelClass = "block text-xs font-medium uppercase tracking-wide text-sand-600";

function Field({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={labelClass}>
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

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 w-full rounded-sm bg-brand-600 px-6 text-sm font-medium text-sand-50 transition-colors hover:bg-brand-500 disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Sending…" : label}
    </button>
  );
}

export function EnquiryForm({
  variant = "full",
  defaultService,
  tourSlug,
  destinationSlug,
  vehicleSlug,
  submitLabel = "Send enquiry",
}: {
  /** "compact" drops the travel-detail fields, for a simple contact page. */
  variant?: "full" | "compact";
  defaultService?: (typeof SERVICES)[number]["value"];
  tourSlug?: string;
  destinationSlug?: string;
  vehicleSlug?: string;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(submitEnquiry, initialState);
  const id = useId();
  const err = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-sm border border-success/30 bg-success-soft p-8 text-center"
      >
        <CheckCircle2
          size={32}
          aria-hidden
          className="mx-auto text-success"
        />
        <h3 className="mt-4 text-h3 text-brand-800">Enquiry received</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Honeypot — visually hidden, not display:none, so bots still fill it. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {tourSlug ? <input type="hidden" name="tourSlug" value={tourSlug} /> : null}
      {destinationSlug ? (
        <input type="hidden" name="destinationSlug" value={destinationSlug} />
      ) : null}
      {vehicleSlug ? (
        <input type="hidden" name="vehicleSlug" value={vehicleSlug} />
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor={`${id}-name`} error={err.fullName}>
          <input
            id={`${id}-name`}
            name="fullName"
            required
            autoComplete="name"
            aria-invalid={Boolean(err.fullName) || undefined}
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
            aria-invalid={Boolean(err.email) || undefined}
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

        <Field label="Country (optional)" htmlFor={`${id}-country`}>
          <input
            id={`${id}-country`}
            name="country"
            autoComplete="country-name"
            className={inputClass}
            placeholder="Where you are travelling from"
          />
        </Field>
      </div>

      <Field label="What are you interested in?" htmlFor={`${id}-service`}>
        <select
          id={`${id}-service`}
          name="serviceInterest"
          defaultValue={defaultService ?? ""}
          className={cn(inputClass, "appearance-none")}
        >
          <option value="">Not sure yet</option>
          {SERVICES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>

      {variant === "full" ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Arrival date (optional)" htmlFor={`${id}-start`}>
              <input
                id={`${id}-start`}
                name="travelStartDate"
                type="date"
                className={inputClass}
              />
            </Field>
            <Field label="Departure date (optional)" htmlFor={`${id}-end`}>
              <input
                id={`${id}-end`}
                name="travelEndDate"
                type="date"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Adults" htmlFor={`${id}-adults`}>
              <input
                id={`${id}-adults`}
                name="adults"
                type="number"
                min={0}
                max={60}
                defaultValue={2}
                className={inputClass}
              />
            </Field>
            <Field label="Children" htmlFor={`${id}-children`}>
              <input
                id={`${id}-children`}
                name="children"
                type="number"
                min={0}
                max={60}
                defaultValue={0}
                className={inputClass}
              />
            </Field>
            <Field label="Budget per person (optional)" htmlFor={`${id}-budget`}>
              <input
                id={`${id}-budget`}
                name="budgetMax"
                type="number"
                min={0}
                step={1000}
                className={inputClass}
                placeholder="KES"
              />
            </Field>
          </div>
        </>
      ) : null}

      <Field label="Your message" htmlFor={`${id}-message`} error={err.message}>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          className="w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-sand-400 focus:border-brand-400"
          placeholder="Tell us how you like to travel, what you would like to see, and anything we should know."
        />
      </Field>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <SubmitButton label={submitLabel} />
        <p className="text-xs text-sand-500">
          We reply within one working day. Your details are never sold or shared.
        </p>
      </div>
    </form>
  );
}
