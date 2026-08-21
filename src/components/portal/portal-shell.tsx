import Link from "next/link";

import { signOutAction } from "@/lib/auth/actions";
import { Container } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/account", label: "Overview" },
  { href: "/account/trips", label: "My trips" },
  { href: "/account/rentals", label: "My rentals" },
  { href: "/account/quotes", label: "Quotations" },
  { href: "/account/invoices", label: "Invoices" },
  { href: "/account/profile", label: "Profile" },
];

export function PortalShell({
  title,
  standfirst,
  activePath,
  children,
}: {
  title: string;
  standfirst?: string;
  activePath: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="border-b border-border bg-brand-800">
        <Container className="py-12 md:py-16">
          <p className="text-eyebrow uppercase text-gold-300">Your account</p>
          <h1 className="mt-3 text-h1 text-sand-50">{title}</h1>
          {standfirst ? (
            <p className="mt-3 max-w-xl text-lead text-sand-200">{standfirst}</p>
          ) : null}
        </Container>
      </section>

      <section className="bg-canvas py-10 md:py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-14">
            <nav aria-label="Account" className="lg:sticky lg:top-28 lg:self-start">
              <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
                {NAV.map((item) => {
                  const active =
                    item.href === "/account"
                      ? activePath === "/account"
                      : activePath.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "block whitespace-nowrap rounded-sm px-3 py-2.5 text-sm transition-colors",
                          active
                            ? "bg-brand-600 text-sand-50"
                            : "text-sand-700 hover:bg-sand-100",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <form action={signOutAction} className="mt-6 hidden lg:block">
                <button
                  type="submit"
                  className="w-full rounded-sm border border-border px-3 py-2.5 text-sm text-sand-700 transition-colors hover:bg-sand-100"
                >
                  Sign out
                </button>
              </form>
            </nav>

            <div className="min-w-0">{children}</div>
          </div>
        </Container>
      </section>
    </>
  );
}

/** Consistent empty state across every portal list. */
export function PortalEmpty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-border bg-surface p-10 text-center">
      <h2 className="text-h3 text-brand-800">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-muted">
        {body}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

const STATUS_TONE: Record<string, string> = {
  confirmed: "bg-success-soft text-success",
  completed: "bg-success-soft text-success",
  paid: "bg-success-soft text-success",
  accepted: "bg-success-soft text-success",
  active: "bg-success-soft text-success",
  pending: "bg-warning-soft text-warning",
  sent: "bg-info-soft text-info",
  reserved: "bg-info-soft text-info",
  in_progress: "bg-info-soft text-info",
  partially_paid: "bg-warning-soft text-warning",
  unpaid: "bg-warning-soft text-warning",
  overdue: "bg-danger-soft text-danger",
  cancelled: "bg-danger-soft text-danger",
  rejected: "bg-danger-soft text-danger",
  expired: "bg-sand-200 text-sand-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-xs px-2 py-0.5 text-xs font-medium capitalize",
        STATUS_TONE[status] ?? "bg-sand-200 text-sand-700",
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
