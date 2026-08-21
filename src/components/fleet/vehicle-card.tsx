import Link from "next/link";
import { Briefcase, Cog, Fuel, Users } from "lucide-react";

import { JemImage } from "@/components/media/JemImage";
import { formatMoney } from "@/lib/utils";
import type { VehicleWithMedia } from "@/lib/fleet/queries";

export function VehicleCard({
  vehicle,
  priority = false,
}: {
  vehicle: VehicleWithMedia;
  priority?: boolean;
}) {
  const driveLabels = [
    vehicle.supports_self_drive ? "Self-drive" : null,
    vehicle.supports_chauffeur ? "Chauffeur" : null,
  ].filter(Boolean);

  return (
    <article className="group flex flex-col overflow-hidden rounded-sm bg-surface shadow-subtle transition-shadow duration-300 hover:shadow-lifted">
      <Link href={`/cars/${vehicle.slug}`} className="block overflow-hidden">
        <JemImage
          media={vehicle.media}
          fallbackAlt={`${vehicle.make} ${vehicle.model}`}
          aspect="card"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            {vehicle.category ? (
              <p className="text-eyebrow uppercase text-gold-600">
                {vehicle.category.name}
              </p>
            ) : null}
            <h3 className="mt-2 text-h3 text-brand-800">
              <Link
                href={`/cars/${vehicle.slug}`}
                className="transition-colors hover:text-brand-600"
              >
                {vehicle.make} {vehicle.model}
              </Link>
            </h3>
          </div>
          {vehicle.is_four_wheel ? (
            <span className="shrink-0 rounded-sm bg-brand-50 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-brand-700">
              4x4
            </span>
          ) : null}
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-sand-600">
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Seats</dt>
            <Users size={14} aria-hidden className="text-gold-600" />
            <dd>{vehicle.seats} seats</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Transmission</dt>
            <Cog size={14} aria-hidden className="text-gold-600" />
            <dd className="capitalize">{vehicle.transmission}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Fuel</dt>
            <Fuel size={14} aria-hidden className="text-gold-600" />
            <dd className="capitalize">{vehicle.fuel_type}</dd>
          </div>
          {vehicle.luggage_capacity ? (
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Luggage</dt>
              <Briefcase size={14} aria-hidden className="text-gold-600" />
              <dd>{vehicle.luggage_capacity} bags</dd>
            </div>
          ) : null}
        </dl>

        {driveLabels.length > 0 ? (
          <p className="mt-4 text-xs text-sand-600">
            Available {driveLabels.join(" · ").toLowerCase()}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between border-t border-border pt-5">
          <div>
            {vehicle.dailyFrom ? (
              <>
                <p className="text-xs text-sand-600">From</p>
                <p className="font-display text-xl text-brand-800">
                  {formatMoney(vehicle.dailyFrom, "KES")}
                  <span className="ml-1 text-xs font-normal text-sand-600">
                    per day
                  </span>
                </p>
              </>
            ) : (
              <p className="text-sm text-sand-600">Rate on request</p>
            )}
          </div>
          <Link
            href={`/cars/${vehicle.slug}`}
            className="text-sm text-brand-600 underline-offset-4 transition-colors hover:text-gold-600 hover:underline"
          >
            View vehicle
            <span className="sr-only">
              {" "}
              — {vehicle.make} {vehicle.model}
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
