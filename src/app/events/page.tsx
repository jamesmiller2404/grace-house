import type { Metadata } from "next";
import UpcomingEvents from "@/sections/UpcomingEvents";
import { upcomingEvents } from "@/content/events";

export const metadata: Metadata = {
  title: "Upcoming Events — Grace House",
  description: "All upcoming events at Grace House — everyone is welcome.",
};

/**
 * A dedicated page listing all upcoming events. Reuses the same
 * `upcoming-events` section component as the homepage so both stay in sync
 * with the single source of truth in `@/content/events`.
 */
export default function EventsPage() {
  return (
    <>
      <main className="flex-1">
        <UpcomingEvents
          heading="Upcoming Events"
          subtitle="Join us — everyone is welcome."
          events={upcomingEvents}
          showControls
        />
      </main>
    </>
  );
}
