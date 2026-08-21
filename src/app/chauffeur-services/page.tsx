import type { Metadata } from "next";

import { getVehicles } from "@/lib/fleet/queries";
import { ServicePage } from "@/components/site/service-page";
import { VehicleCard } from "@/components/fleet/vehicle-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHeader } from "@/components/ui/section";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Chauffeur car hire in Nairobi & Kenya",
  description:
    "Chauffeur-driven vehicles across Kenya — executive saloons for business travel, 4x4s for safari circuits, and vans for group movements.",
  alternates: { canonical: "/chauffeur-services" },
};

export default async function ChauffeurServicesPage() {
  const vehicles = await getVehicles({ driveType: "chauffeur", limit: 6 });

  return (
    <ServicePage
      eyebrow="Driven for you"
      title="Chauffeur services"
      standfirst="Professional drivers who know the roads, the routes and the traffic — so you can work, rest or simply look out of the window."
      media={vehicles[0]?.media ?? null}
      crumbs={[{ label: "Home", href: "/" }, { label: "Chauffeur services" }]}
      defaultService="chauffeur"
      intro={[
        "Our chauffeurs are employed and trained by us, not sourced per job. They hold current licences and PSV badges where the vehicle requires one, and their documents are tracked so nothing lapses unnoticed.",
        "You can hire by the day, by the half-day, or for a full safari circuit. For business travel we can hold the same driver across a visit, which most corporate clients prefer to a different face each morning.",
      ]}
      featuresHeading="How chauffeur hire works"
      features={[
        {
          title: "Daily and half-day rates",
          body: "Rates include the vehicle, fuel within the stated mileage, and a driver allowance. Waiting time is included within the booked hours rather than billed separately.",
        },
        {
          title: "The same driver throughout",
          body: "For multi-day bookings we hold one driver for the whole period wherever possible, so you are not re-explaining your schedule each day.",
        },
        {
          title: "Safari-experienced guides",
          body: "For park circuits we assign drivers who guide as well as drive — they know where the animals have been moving and how to position the vehicle.",
        },
        {
          title: "Airport and hotel pickups",
          body: "Flights are monitored so an early or delayed arrival is met at the right time, at no extra charge.",
        },
        {
          title: "Corporate accounts",
          body: "Regular users can move to monthly billing with named approvers and per-employee spending limits.",
        },
        {
          title: "Executive vehicles",
          body: "Saloons for city and business movements, 4x4s where the road demands it, and vans when the party is larger.",
        },
      ]}
      enquiryHeading="Book a chauffeur"
      enquiryBody="Tell us the dates, the vehicle you have in mind and roughly where you need to go."
    >
      {vehicles.length > 0 ? (
        <Section tone="canvas">
          <Container>
            <SectionHeader
              eyebrow="The fleet"
              heading="Chauffeur-driven vehicles"
              action={
                <ButtonLink href="/car-hire" variant="outline">
                  Full fleet
                </ButtonLink>
              }
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </ServicePage>
  );
}
