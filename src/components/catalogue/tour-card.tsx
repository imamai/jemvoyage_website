import Link from "next/link";
import { Clock, MapPin, Users } from "lucide-react";

import { JemImage } from "@/components/media/JemImage";
import { formatMoney, pluralise } from "@/lib/utils";
import type { TourWithMedia } from "@/lib/catalogue/queries";

export function TourCard({
  tour,
  priority = false,
}: {
  tour: TourWithMedia;
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-sm bg-surface shadow-subtle transition-shadow duration-300 hover:shadow-lifted">
      <Link href={`/tours/${tour.slug}`} className="block overflow-hidden">
        <JemImage
          media={tour.media}
          fallbackAlt={tour.title}
          aspect="card"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        {tour.category ? (
          <p className="text-eyebrow uppercase text-gold-600">
            {tour.category.name}
          </p>
        ) : null}

        <h3 className="mt-2 text-h3 text-brand-800">
          <Link
            href={`/tours/${tour.slug}`}
            className="transition-colors hover:text-brand-600"
          >
            {tour.title}
          </Link>
        </h3>

        {tour.summary ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-fg-muted">
            {tour.summary}
          </p>
        ) : null}

        <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-sand-600">
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Duration</dt>
            <Clock size={14} aria-hidden className="text-gold-600" />
            <dd>{pluralise(tour.duration_days, "day")}</dd>
          </div>
          {tour.destination ? (
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Destination</dt>
              <MapPin size={14} aria-hidden className="text-gold-600" />
              <dd>{tour.destination.name}</dd>
            </div>
          ) : null}
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Group size</dt>
            <Users size={14} aria-hidden className="text-gold-600" />
            <dd>
              {tour.max_travellers
                ? `${tour.min_travellers}–${tour.max_travellers}`
                : `${tour.min_travellers}+`}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
          <div>
            {tour.price_from ? (
              <>
                <p className="text-xs text-sand-600">From</p>
                <p className="font-display text-xl text-brand-800">
                  {formatMoney(tour.price_from, tour.currency)}
                  <span className="ml-1 text-xs font-normal text-sand-600">
                    {tour.price_basis === "per_person" ? "per person" : "per group"}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-sm text-sand-600">Price on request</p>
            )}
          </div>
          <Link
            href={`/tours/${tour.slug}`}
            className="text-sm text-brand-600 underline-offset-4 transition-colors hover:text-gold-600 hover:underline"
          >
            View details
            <span className="sr-only"> for {tour.title}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
