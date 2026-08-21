import Link from "next/link";

import { JemImage } from "@/components/media/JemImage";
import type { DestinationWithMedia } from "@/lib/catalogue/queries";

/**
 * Destination cards carry their label over the photograph rather than beneath
 * it — destinations are a browsing surface, and the image is the message.
 */
export function DestinationCard({
  destination,
  priority = false,
}: {
  destination: DestinationWithMedia;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative block overflow-hidden rounded-sm"
    >
      <JemImage
        media={destination.thumbnailMedia ?? destination.heroMedia}
        fallbackAlt={destination.name}
        aspect="card"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.05]"
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-brand-900/85 via-brand-900/25 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 p-6">
        {destination.region ? (
          <p className="text-eyebrow uppercase text-gold-300">
            {destination.region}
          </p>
        ) : null}
        <h3 className="mt-1 font-display text-2xl text-sand-50">
          {destination.name}
        </h3>
        {destination.summary ? (
          <p className="mt-2 line-clamp-2 text-sm text-sand-200">
            {destination.summary}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
