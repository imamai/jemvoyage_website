"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2 } from "lucide-react";

import { updateProfileAction, type ProfileState } from "@/lib/portal/actions";

const initialState: ProfileState = { status: "idle" };

const inputClass =
  "h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg " +
  "placeholder:text-sand-400 focus:border-brand-400 disabled:bg-surface-sunken disabled:text-sand-500";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 rounded-sm bg-brand-600 px-6 text-sm font-medium text-sand-50 transition-colors hover:bg-brand-500 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export function ProfileForm({
  fullName,
  email,
  phone,
}: {
  fullName: string;
  email: string;
  phone: string;
}) {
  const [state, formAction] = useActionState(updateProfileAction, initialState);
  const id = useId();
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor={`${id}-name`}
          className="block text-xs font-medium uppercase tracking-wide text-sand-600"
        >
          Full name
        </label>
        <input
          id={`${id}-name`}
          name="fullName"
          defaultValue={fullName}
          required
          autoComplete="name"
          className={`${inputClass} mt-1.5`}
        />
        {err.fullName ? (
          <p className="mt-1.5 text-xs text-danger" role="alert">
            {err.fullName}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor={`${id}-email`}
          className="block text-xs font-medium uppercase tracking-wide text-sand-600"
        >
          Email
        </label>
        <input
          id={`${id}-email`}
          defaultValue={email}
          disabled
          className={`${inputClass} mt-1.5`}
        />
        <p className="mt-1.5 text-xs text-sand-500">
          Contact us to change the email on your account.
        </p>
      </div>

      <div>
        <label
          htmlFor={`${id}-phone`}
          className="block text-xs font-medium uppercase tracking-wide text-sand-600"
        >
          Phone
        </label>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          defaultValue={phone}
          autoComplete="tel"
          className={`${inputClass} mt-1.5`}
          placeholder="+254 …"
        />
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      {state.status === "success" ? (
        <p
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 text-sm text-success"
        >
          <CheckCircle2 size={16} aria-hidden />
          {state.message}
        </p>
      ) : null}

      <Submit />
    </form>
  );
}
