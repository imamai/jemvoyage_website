import Link from "next/link";

import { JemImage } from "@/components/media/JemImage";
import { Container, Eyebrow } from "@/components/ui/section";
import type { MediaRef } from "@/lib/cms/queries";

export type Crumb = { label: string; href?: string };

/**
 * Interior page header. Shorter than the homepage hero so the content below it
 * stays above the fold on a laptop, but built from the same CMS media pipeline.
 */
export function PageHero({
  eyebrow,
  title,
  standfirst,
  media,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: string;
  standfirst?: string | null;
  media?: MediaRef | null;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-800">
      {media ? (
        <>
          <div className="absolute inset-0">
            <JemImage
              media={media}
              aspect="fill"
              sizes="100vw"
              priority
              decorative
              className="h-full w-full"
            />
          </div>
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/70 to-brand-900/45"
          />
        </>
      ) : null}

      <Container className="relative py-16 md:py-24">
        {crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-sand-300">
              {crumbs.map((crumb, i) => (
                <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-sand-50"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-sand-100">
                      {crumb.label}
                    </span>
                  )}
                  {i < crumbs.length - 1 ? (
                    <span aria-hidden className="text-sand-500">
                      /
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {eyebrow ? (
          <Eyebrow tone="onDark" className="mb-4">
            {eyebrow}
          </Eyebrow>
        ) : null}

        <h1 className="max-w-4xl text-h1 text-sand-50">{title}</h1>

        {standfirst ? (
          <p className="mt-5 max-w-2xl text-lead text-sand-200">{standfirst}</p>
        ) : null}

        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </section>
  );
}
