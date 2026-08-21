import Link from "next/link";

import { requireAdmin } from "@/lib/admin/guard";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function NoAccessPage() {
  const context = await requireAdmin();

  return (
    <AdminShell
      context={context}
      activePath="/admin/no-access"
      title="No access"
      standfirst="Your role does not include this module."
    >
      <div className="max-w-xl rounded-sm border border-border bg-surface p-8">
        <p className="text-sm leading-relaxed text-fg-muted">
          You are signed in as{" "}
          <span className="font-medium text-fg">{context.user.full_name}</span>,
          but that account does not hold the permission this page requires. If
          you believe it should, ask a Super Admin to review your role.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-block rounded-sm bg-brand-600 px-4 py-2.5 text-sm text-sand-50"
        >
          Back to dashboard
        </Link>
      </div>
    </AdminShell>
  );
}
