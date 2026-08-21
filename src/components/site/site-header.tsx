import Link from "next/link";
import { UserRound } from "lucide-react";

import { getMenuTree, getPublicSettings, settingString } from "@/lib/cms/queries";
import { ButtonLink } from "@/components/ui/button";
import { NavDropdown } from "@/components/site/nav-dropdown";
import { MobileNav } from "@/components/site/mobile-nav";

/*
 * The account link deliberately does NOT branch on session state.
 *
 * Reading cookies() here would opt the root layout — and therefore every page
 * on the site — out of static rendering. Instead the link always points at
 * /account, and the auth proxy sends signed-out visitors to /sign-in and back
 * again afterwards. Same destination for both states, no per-request render.
 *
 * The phone number lives in the footer rather than here: it competed with the
 * primary CTA for attention and cost the nav the width it needed to sit on one
 * row. It is still CMS-managed under `contact.phone`.
 */
export async function SiteHeader() {
  const [tree, settings] = await Promise.all([
    getMenuTree("primary"),
    getPublicSettings(),
  ]);

  const siteName = settingString(settings, "site.name", "Jemvoyage");

  return (
    <header
      className="sticky top-0 z-40 border-b border-border/70 bg-surface/85 backdrop-blur-md"
      style={{ ["--header-height" as string]: "4.5rem" }}
    >
      {/*
        Three-part layout: the logo and the actions size to their content, and
        the nav takes the whole remaining width and centres inside it. That
        keeps the groups optically balanced between the two edges at any width,
        rather than bunched against the logo.
      */}
      <div className="container-page flex h-18 items-center gap-6">
        <Link
          href="/"
          className="shrink-0 font-display text-2xl leading-none tracking-tight text-brand-800"
        >
          {siteName}
          <span className="text-gold-500">.</span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden flex-1 justify-center lg:flex"
        >
          <ul className="flex flex-nowrap items-center gap-7 xl:gap-10">
            {tree.map((node) => (
              <li key={node.id} className="shrink-0">
                {node.children.length > 0 ? (
                  <NavDropdown node={node} />
                ) : (
                  <Link
                    href={node.url}
                    className="whitespace-nowrap py-2 text-sm text-sand-700 transition-colors hover:text-brand-600"
                  >
                    {node.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* ml-auto keeps the actions hard right on mobile, where the nav is hidden. */}
        <div className="ml-auto flex shrink-0 items-center gap-3 lg:ml-0 lg:gap-4">
          <Link
            href="/account"
            aria-label="My account"
            className="hidden items-center gap-1.5 text-sm text-sand-700 transition-colors hover:text-brand-600 lg:inline-flex"
          >
            <UserRound size={16} aria-hidden />
            <span className="hidden xl:inline">Account</span>
          </Link>

          <ButtonLink
            href="/plan-your-trip"
            className="hidden whitespace-nowrap lg:inline-flex"
          >
            Plan my trip
          </ButtonLink>

          <MobileNav tree={tree} />
        </div>
      </div>
    </header>
  );
}
