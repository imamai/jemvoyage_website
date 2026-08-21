import { permanentRedirect } from "next/navigation";

/** Transfers are documented and sold at /airport-transfers. */
export default function TransfersIndexPage() {
  permanentRedirect("/airport-transfers");
}
