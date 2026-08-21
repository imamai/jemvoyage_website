import type { Metadata } from "next";

import { getCurrentUser } from "@/lib/auth/service";
import { getMyCustomer } from "@/lib/portal/queries";
import { PortalShell } from "@/components/portal/portal-shell";
import { ProfileForm } from "@/components/portal/profile-form";
import { signOutAction } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const [user, customer] = await Promise.all([getCurrentUser(), getMyCustomer()]);

  return (
    <PortalShell
      title="Profile"
      standfirst="Your details, and how we reach you."
      activePath="/account/profile"
    >
      <div className="max-w-xl">
        <div className="rounded-sm border border-border bg-surface p-6 md:p-8">
          <ProfileForm
            fullName={user?.full_name ?? ""}
            email={user?.email ?? ""}
            phone={user?.phone ?? ""}
          />
        </div>

        {customer ? (
          <div className="mt-6 rounded-sm border border-border bg-surface-sunken p-6">
            <h2 className="text-h3 text-brand-800">Customer record</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="text-sand-500">Reference:</dt>
                <dd className="font-mono text-fg">{customer.reference}</dd>
              </div>
              {customer.segment ? (
                <div className="flex gap-2">
                  <dt className="text-sand-500">Segment:</dt>
                  <dd className="capitalize text-fg">
                    {customer.segment.replace(/_/g, " ")}
                  </dd>
                </div>
              ) : null}
              <div className="flex gap-2">
                <dt className="text-sand-500">Trips booked:</dt>
                <dd className="text-fg">{customer.total_bookings}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-sand-500">
              Quote this reference when you contact us and we will find you
              immediately.
            </p>
          </div>
        ) : null}

        <form action={signOutAction} className="mt-6 lg:hidden">
          <button
            type="submit"
            className="w-full rounded-sm border border-border px-3 py-3 text-sm text-sand-700"
          >
            Sign out
          </button>
        </form>
      </div>
    </PortalShell>
  );
}
