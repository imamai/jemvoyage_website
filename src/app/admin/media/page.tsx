import { requireAdmin } from "@/lib/admin/guard";
import { createClient } from "@/lib/supabase/server";
import { MEDIA_COLUMNS, type MediaRef } from "@/lib/cms/queries";
import { JemImage } from "@/components/media/JemImage";
import { AdminShell, AdminEmpty } from "@/components/admin/admin-shell";
import { MediaUploader, MediaItemControls } from "@/components/admin/media-manager";

export const metadata = { title: "Media library" };

type Props = {
  searchParams: Promise<{ category?: string; placeholder?: string }>;
};

export default async function AdminMediaPage({ searchParams }: Props) {
  const [context, params] = await Promise.all([
    requireAdmin("media.view"),
    searchParams,
  ]);

  const supabase = await createClient();
  let query = supabase
    .from("jemvoyage_media")
    .select(MEDIA_COLUMNS)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(300);

  if (params.category) query = query.eq("category", params.category);
  if (params.placeholder === "1") query = query.eq("is_placeholder", true);

  const { data } = await query;
  const media = (data ?? []) as MediaRef[];
  const canManage = context.can("media.manage");

  const placeholderCount = media.filter((m) => m.is_placeholder).length;

  const categories = [
    "hero", "tours", "safaris", "destinations", "vehicles", "fleet",
    "lodging", "activities", "blog", "offers", "corporate", "general",
  ];

  return (
    <AdminShell
      context={context}
      activePath="/admin/media"
      title="Media library"
      standfirst="Every image on the public site resolves through this library. Replace one here and it changes everywhere it is used — no deploy required."
    >
      {canManage ? (
        <div className="mb-8">
          <MediaUploader />
        </div>
      ) : (
        <p className="mb-8 rounded-sm border border-border bg-surface p-4 text-sm text-fg-muted">
          You have read-only access to the media library.
        </p>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        <a
          href="/admin/media"
          className={
            !params.category && params.placeholder !== "1"
              ? "rounded-sm bg-brand-600 px-3 py-1.5 text-xs text-sand-50"
              : "rounded-sm border border-border bg-surface px-3 py-1.5 text-xs text-sand-700 hover:bg-sand-100"
          }
        >
          All
        </a>
        <a
          href="/admin/media?placeholder=1"
          className={
            params.placeholder === "1"
              ? "rounded-sm bg-gold-500 px-3 py-1.5 text-xs text-brand-900"
              : "rounded-sm border border-gold-300 bg-gold-50 px-3 py-1.5 text-xs text-gold-700 hover:bg-gold-100"
          }
        >
          Placeholders only
        </a>
        {categories.map((category) => (
          <a
            key={category}
            href={`/admin/media?category=${category}`}
            className={
              params.category === category
                ? "rounded-sm bg-brand-600 px-3 py-1.5 text-xs capitalize text-sand-50"
                : "rounded-sm border border-border bg-surface px-3 py-1.5 text-xs capitalize text-sand-700 hover:bg-sand-100"
            }
          >
            {category}
          </a>
        ))}
      </div>

      {placeholderCount > 0 ? (
        <p className="mb-6 rounded-sm border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-800">
          {placeholderCount} of the {media.length} images shown are development
          placeholders. They are marked below and are safe to replace at any time.
        </p>
      ) : null}

      {media.length === 0 ? (
        <AdminEmpty
          title="Nothing here yet"
          body="Upload an image above, or clear the filters to see the rest of the library."
        />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {media.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-sm border border-border bg-surface"
            >
              <div className="relative">
                <JemImage
                  media={item}
                  fallbackAlt={item.title ?? "Media item"}
                  aspect="card"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                {item.is_placeholder ? (
                  // §48: flagged clearly for administrators, invisible to the public.
                  <span className="absolute left-2 top-2 rounded-xs bg-gold-500 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-brand-900">
                    Placeholder
                  </span>
                ) : null}
              </div>

              <div className="p-3">
                <p className="truncate text-sm text-brand-800">
                  {item.title ?? "Untitled"}
                </p>
                <p className="mt-0.5 text-xs capitalize text-sand-500">
                  {item.category}
                </p>
                {!item.alt_text ? (
                  <p className="mt-1.5 text-xs text-warning">
                    No alt text — add one for accessibility
                  </p>
                ) : null}
              </div>

              {canManage ? <MediaItemControls media={item} /> : null}
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
