"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Upload } from "lucide-react";

import {
  uploadMedia,
  updateMediaDetails,
  archiveMedia,
  type MediaActionState,
} from "@/lib/admin/media-actions";
import type { MediaRef } from "@/lib/cms/queries";

const initial: MediaActionState = { status: "idle" };

const CATEGORIES = [
  "general", "hero", "tours", "safaris", "destinations", "vehicles", "fleet",
  "lodging", "activities", "blog", "offers", "corporate", "team", "testimonials",
];

const inputClass =
  "h-10 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg " +
  "placeholder:text-sand-400 focus:border-brand-400";

function Pending({ idle, busy }: { idle: string; busy: string }) {
  const { pending } = useFormStatus();
  return <>{pending ? busy : idle}</>;
}

function Feedback({ state }: { state: MediaActionState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      aria-live="polite"
      className={
        state.status === "error"
          ? "mt-2 text-xs text-danger"
          : "mt-2 flex items-center gap-1.5 text-xs text-success"
      }
    >
      {state.status === "success" ? <CheckCircle2 size={13} aria-hidden /> : null}
      {state.message}
    </p>
  );
}

/** Upload a brand-new image into the library. */
export function MediaUploader() {
  const [state, formAction] = useActionState(uploadMedia, initial);

  return (
    <form
      action={formAction}
      className="rounded-sm border border-dashed border-border bg-surface p-5"
    >
      <h2 className="flex items-center gap-2 text-h3 text-brand-800">
        <Upload size={18} aria-hidden className="text-gold-600" />
        Upload an image
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="upload-file" className="sr-only">
            Image file
          </label>
          <input
            id="upload-file"
            name="file"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
            className="w-full text-sm text-sand-700 file:mr-3 file:rounded-sm file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:text-sand-50"
          />
        </div>

        <div>
          <label htmlFor="upload-category" className="sr-only">
            Category
          </label>
          <select
            id="upload-category"
            name="category"
            defaultValue="general"
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="upload-alt" className="sr-only">
            Alt text
          </label>
          <input
            id="upload-alt"
            name="altText"
            className={inputClass}
            placeholder="Alt text — describe the image"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 h-10 rounded-sm bg-brand-600 px-5 text-sm text-sand-50 transition-colors hover:bg-brand-500"
      >
        <Pending idle="Upload" busy="Uploading…" />
      </button>

      <Feedback state={state} />
      <p className="mt-2 text-xs text-sand-500">
        JPEG, PNG, WebP, AVIF or SVG, up to 25 MB. Alt text is what screen
        readers announce — describe what is in the picture, not the filename.
      </p>
    </form>
  );
}

/** Per-image controls: replace the file, edit its text, or archive it. */
export function MediaItemControls({ media }: { media: MediaRef }) {
  const [tab, setTab] = useState<"details" | "replace" | null>(null);
  const [detailState, detailAction] = useActionState(updateMediaDetails, initial);
  const [replaceState, replaceAction] = useActionState(uploadMedia, initial);
  const [archiveState, archiveAction] = useActionState(archiveMedia, initial);

  return (
    <div className="border-t border-border p-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab(tab === "replace" ? null : "replace")}
          aria-expanded={tab === "replace"}
          className="rounded-sm border border-border px-2.5 py-1 text-xs text-sand-700 hover:bg-sand-100"
        >
          Replace image
        </button>
        <button
          type="button"
          onClick={() => setTab(tab === "details" ? null : "details")}
          aria-expanded={tab === "details"}
          className="rounded-sm border border-border px-2.5 py-1 text-xs text-sand-700 hover:bg-sand-100"
        >
          Edit text
        </button>
        <form action={archiveAction} className="ml-auto">
          <input type="hidden" name="id" value={media.id} />
          <button
            type="submit"
            className="rounded-sm border border-danger/30 px-2.5 py-1 text-xs text-danger hover:bg-danger-soft"
          >
            <Pending idle="Archive" busy="…" />
          </button>
        </form>
      </div>

      <Feedback state={archiveState} />

      {tab === "replace" ? (
        <form action={replaceAction} className="mt-3 space-y-2">
          <input type="hidden" name="replacesId" value={media.id} />
          <input type="hidden" name="category" value={media.category} />
          <label htmlFor={`replace-${media.id}`} className="sr-only">
            Replacement image
          </label>
          <input
            id={`replace-${media.id}`}
            name="file"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
            className="w-full text-xs text-sand-700 file:mr-2 file:rounded-sm file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-xs file:text-sand-50"
          />
          <button
            type="submit"
            className="h-9 w-full rounded-sm bg-brand-600 text-xs text-sand-50"
          >
            <Pending idle="Upload replacement" busy="Uploading…" />
          </button>
          <p className="text-[0.65rem] leading-snug text-sand-500">
            Everything already using this image updates automatically.
          </p>
          <Feedback state={replaceState} />
        </form>
      ) : null}

      {tab === "details" ? (
        <form action={detailAction} className="mt-3 space-y-2">
          <input type="hidden" name="id" value={media.id} />
          <label htmlFor={`title-${media.id}`} className="sr-only">
            Title
          </label>
          <input
            id={`title-${media.id}`}
            name="title"
            defaultValue={media.title ?? ""}
            placeholder="Title"
            className={inputClass}
          />
          <label htmlFor={`alt-${media.id}`} className="sr-only">
            Alt text
          </label>
          <input
            id={`alt-${media.id}`}
            name="altText"
            defaultValue={media.alt_text ?? ""}
            placeholder="Alt text"
            className={inputClass}
          />
          <button
            type="submit"
            className="h-9 w-full rounded-sm bg-brand-600 text-xs text-sand-50"
          >
            <Pending idle="Save" busy="Saving…" />
          </button>
          <Feedback state={detailState} />
        </form>
      ) : null}
    </div>
  );
}
