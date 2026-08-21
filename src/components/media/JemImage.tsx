import Image from "next/image";

import { cn } from "@/lib/utils";
import { mediaAlt, mediaFocalPosition, mediaUrl } from "@/lib/media/url";
import type { JemvoyageMedia } from "@/lib/db/types";

type MediaLike = Pick<
  JemvoyageMedia,
  | "storage_bucket"
  | "file_path"
  | "external_url"
  | "alt_text"
  | "title"
  | "focal_x"
  | "focal_y"
  | "blur_data_url"
>;

const ASPECT_CLASS = {
  hero: "aspect-[16/9]",
  card: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  fill: "h-full w-full",
} as const;

export type JemImageAspect = keyof typeof ASPECT_CLASS;

type JemImageProps = {
  media: MediaLike | null | undefined;
  /** Used for the accessible name when the media row has no alt text. */
  fallbackAlt?: string;
  aspect?: JemImageAspect;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  /** Marks the image as decorative — announces nothing to screen readers. */
  decorative?: boolean;
};

/**
 * The only way an image reaches a Jemvoyage page.
 *
 * Components receive a media *row*, never a URL, so photography is swapped from
 * the CMS without touching code. When a row is missing or its file has been
 * deleted, this renders a branded canvas rather than a broken image or a grey
 * box (§76) — the layout keeps its shape and the page still looks finished.
 */
export function JemImage({
  media,
  fallbackAlt = "",
  aspect = "card",
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
  priority = false,
  className,
  imageClassName,
  decorative = false,
}: JemImageProps) {
  const src = mediaUrl(media);
  const alt = decorative ? "" : mediaAlt(media, fallbackAlt);

  const wrapper = cn(
    "relative overflow-hidden bg-sand-200",
    ASPECT_CLASS[aspect],
    className,
  );

  if (!src) {
    return (
      <div
        className={cn(
          wrapper,
          "bg-gradient-to-br from-sand-200 via-sand-300 to-brand-100",
        )}
        role={decorative || !alt ? "presentation" : "img"}
        aria-label={decorative || !alt ? undefined : alt}
      />
    );
  }

  return (
    <div className={wrapper}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={cn("object-cover", imageClassName)}
        style={{ objectPosition: mediaFocalPosition(media) }}
        {...(media?.blur_data_url
          ? { placeholder: "blur" as const, blurDataURL: media.blur_data_url }
          : {})}
      />
    </div>
  );
}
