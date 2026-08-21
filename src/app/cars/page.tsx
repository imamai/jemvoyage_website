import { permanentRedirect } from "next/navigation";

/**
 * `/cars` is the vehicle-detail namespace (`/cars/[slug]`). The browsing
 * surface lives at `/car-hire`, so send the bare path there permanently rather
 * than maintaining two competing listing pages — one canonical URL per surface
 * keeps the sitemap and search results clean.
 */
export default function CarsIndexPage() {
  permanentRedirect("/car-hire");
}
