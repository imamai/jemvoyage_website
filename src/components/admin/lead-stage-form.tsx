"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateLeadStage, type AdminActionState } from "@/lib/admin/actions";

const initial: AdminActionState = { status: "idle" };

const STAGES = [
  "new", "contacted", "qualified", "planning", "quote_sent", "negotiation",
  "deposit_requested", "confirmed", "travelling", "completed", "repeat", "lost",
] as const;

function AutoSubmit() {
  const { pending } = useFormStatus();
  return pending ? (
    <span className="text-xs text-sand-500" role="status">
      Saving…
    </span>
  ) : null;
}

export function LeadStageForm({
  leadId,
  stage,
  disabled,
}: {
  leadId: string;
  stage: string;
  disabled?: boolean;
}) {
  const [state, formAction] = useActionState(updateLeadStage, initial);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="leadId" value={leadId} />
      <label className="sr-only" htmlFor={`stage-${leadId}`}>
        Pipeline stage
      </label>
      <select
        id={`stage-${leadId}`}
        name="stage"
        defaultValue={stage}
        disabled={disabled}
        // Submitting on change keeps the pipeline one click deep. The server
        // action re-validates the value, so a tampered <option> is rejected.
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-9 rounded-sm border border-border bg-surface px-2 text-xs capitalize text-fg disabled:opacity-50"
      >
        {STAGES.map((s) => (
          <option key={s} value={s}>
            {s.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <AutoSubmit />
      {state.status === "error" ? (
        <span className="text-xs text-danger" role="alert">
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
