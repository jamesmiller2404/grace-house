/**
 * Upcoming events — one source of truth for what the events section shows.
 * Later this becomes a Payload `events` collection: each entry's fields map
 * 1:1 to that collection's fields. Dates are ISO strings (YYYY-MM-DD) so the
 * admin panel can store them as dates and the section can render the
 * month / day / weekday tiles itself.
 */
export type EventItem = {
  title: string;
  /** ISO date string, e.g. "2026-10-18". */
  date: string;
  /** Start time shown on the card, e.g. "4:00 PM". */
  time: string;
  /** Where the event happens, e.g. "Grace House". */
  location: string;
  /** Small gold pill label, e.g. "Community". */
  category: string;
  /** Where "View event" links to. */
  href: string;
};

export const upcomingEvents: EventItem[] = [
  {
    title: "Friends Giving",
    date: "2026-10-18",
    time: "4:00 PM",
    location: "Grace House",
    category: "Community",
    href: "/events/friends-giving",
  },
  {
    title: "Friends Giving",
    date: "2026-10-18",
    time: "4:00 PM",
    location: "Grace House",
    category: "Community",
    href: "/events/friends-giving",
  },
  {
    title: "Friends Giving",
    date: "2026-10-18",
    time: "4:00 PM",
    location: "Grace House",
    category: "Community",
    href: "/events/friends-giving",
  },
  {
    title: "Friends Giving",
    date: "2026-10-18",
    time: "4:00 PM",
    location: "Grace House",
    category: "Community",
    href: "/events/friends-giving",
  },
];
