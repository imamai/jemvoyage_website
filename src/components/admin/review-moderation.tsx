"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { moderateReview, type AdminActionState } from "@/lib/admin/actions";

const initial: AdminActionState = { status: "idle" };

function Btn({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="status"
      value={value}
      disabled={pending}
      className={`rounded-sm px-3 py-1.5 text-xs transition-colors disabled:opacity-50 ${className}`}
    >
      {label}
    </button>
  );
}

export function ReviewModeration({
  reviewId,
  status,
}: {
  reviewId: string;
  status: string;
}) {
  const [state, formAction] = useActionState(moderateReview, initial);

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="reviewId" value={reviewId} />

      {status !== "approved" ? (
        <Btn
          value="approved"
          label="Approve & publish"
          className="bg-success text-sand-50 hover:opacity-90"
        />
      ) : null}
      {status !== "rejected" ? (
        <Btn
          value="rejected"
          label="Reject"
          className="border border-danger/30 text-danger hover:bg-danger-soft"
        />
      ) : null}
      {status === "approved" ? (
        <Btn
          value="hidden"
          label="Unpublish"
          className="border border-border text-sand-700 hover:bg-sand-100"
        />
      ) : null}

      {state.status === "error" ? (
        <span role="alert" className="text-xs text-danger">
          {state.message}
        </span>
      ) : null}
      {state.status === "success" ? (
        <span role="status" className="text-xs text-success">
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
