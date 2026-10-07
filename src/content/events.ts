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
    title: "Halloween Haunted House",
    date: "2026-10-31",
    time: "4:00 PM",
    location: "St. Augustine Community Church",
    category: "Community",
    href: "/events/halloween-haunted-house",
  },
  {
    title: "Friends Giving",
    date: "2026-11-24",
    time: "4:00 PM",
    location: "Grace House",
    category: "Community",
    href: "/events/friends-giving",
  },
  {
    title: "Christmas Dinner",
    date: "2026-12-25",
    time: "4:00 PM",
    location: "Grace House",
    category: "Community",
    href: "/events/christmas-dinner",
  },
  {
    title: "Spring Open House",
    date: "2027-03-20",
    time: "4:00 PM",
    location: "Grace House",
    category: "Community",
    href: "/events/spring-open-house",
  },
  {
    title: "Christmas Service",
    date: "2026-12-25",
    time: "6:30 PM",
    location: "Cross Roads Church",
    category: "Community",
    href: "/events/christmas-service",
  },
];

/**
 * Full content for a single event page (mockup in
 * photoshop_assets/eventPage-genericMockup.png). Each entry maps to one
 * `/events/<slug>` page. Later this becomes a Payload `events` collection;
 * the fields here map 1:1 to that collection's fields.
 */
export type EventDetail = {
  slug: string;
  title: string;
  /** Gold pill label, e.g. "Community". */
  category: string;
  /** Status pill, e.g. "Upcoming". */
  status: string;
  /** ISO date string, e.g. "2026-10-18". */
  date: string;
  /** e.g. "4:00pm". */
  startTime: string;
  /** e.g. "6:00pm". */
  endTime: string;
  location: string;
  /** e.g. "Free". */
  cost: string;
  /** Wide photo below the event facts. */
  image: string;
  /** Lead copy under the "About Event" heading. */
  about: string[];
  /** Copy under the "What to Expect" heading. */
  whatToExpect: string[];
  /** Note under the RSVP button, e.g. "Helps us plan enough food". */
  rsvpNote: string;
  /** Small pills in the "Who it's for" card. */
  audience: string[];
  contact: { questions: string; phone: string; email: string };
};

export const eventDetails: EventDetail[] = [
  {
    slug: "halloween-haunted-house",
    title: "Halloween Haunted House",
    category: "Community",
    status: "Upcoming",
    date: "2026-10-31",
    startTime: "4:00pm",
    endTime: "6:00pm",
    location: "St. Augustine Community Church",
    cost: "Free",
    image: "/images/halloween1.png",
    about: [
      "Join us for a spooky (but family-friendly) Halloween Haunted House, hosted at St. Augustine Community Church. Costumes encouraged — come enjoy the fun with the Grace House community.",
    ],
    whatToExpect: [
      "Tour the haunted hallways room by room, then warm up with hot cider and treats in the fellowship area. A kids-friendly hour runs first, with slightly scarier walkthroughs after 5:00pm.",
    ],
    rsvpNote: "Helps us plan enough treats",
    audience: ["Open to everyone", "Families welcome", "Costumes encouraged"],
    contact: {
      questions: "Questions?",
      phone: "Call (916) 555-5555 or",
      email: "Email ghemail@gmail.com",
    },
  },
  {
    slug: "friends-giving",
    title: "Friends Giving Dinner",
    category: "Community",
    status: "Upcoming",
    date: "2026-11-24",
    startTime: "4:00pm",
    endTime: "6:00pm",
    location: "Grace House",
    cost: "Free",
    image: "/images/dinner1.png",
    about: [
      "An evening meal with residents, graduates, families and friends. Come hungry and meet the people behind Grace House.",
    ],
    whatToExpect: [
      "Dinner is served family style at long tables. You do not need to bring anything. A few residents will share a little of their story, and then it is just a good meal.",
    ],
    rsvpNote: "Helps us plan enough food",
    audience: ["Open to everyone", "Families welcome", "Children welcome"],
    contact: {
      questions: "Questions?",
      phone: "Call (916) 555-5555 or",
      email: "Email ghemail@gmail.com",
    },
  },
  {
    slug: "christmas-dinner",
    title: "Christmas Dinner",
    category: "Community",
    status: "Upcoming",
    date: "2026-12-25",
    startTime: "4:00pm",
    endTime: "6:00pm",
    location: "Grace House",
    cost: "Free",
    image: "/images/christmas1.png",
    about: [
      "Spend Christmas evening with the Grace House community. A warm holiday meal for residents, graduates, families and friends — no one should be alone on Christmas.",
    ],
    whatToExpect: [
      "A festive family-style dinner with holiday decorations, carols between courses, and a small gift for every guest. Just come as you are; the house provides everything.",
    ],
    rsvpNote: "Helps us plan enough food",
    audience: ["Open to everyone", "Families welcome", "Gifts provided"],
    contact: {
      questions: "Questions?",
      phone: "Call (916) 555-5555 or",
      email: "Email ghemail@gmail.com",
    },
  },
  {
    slug: "spring-open-house",
    title: "Spring Open House",
    category: "Community",
    status: "Upcoming",
    date: "2027-03-20",
    startTime: "4:00pm",
    endTime: "6:00pm",
    location: "Grace House",
    cost: "Free",
    image: "/images/spring1.png",
    about: [
      "Tour the house, meet current residents and graduates, and see what a season of recovery at Grace House looks like. Refreshments served throughout.",
    ],
    whatToExpect: [
      "Guided tours of the rooms and common spaces run every half hour, followed by coffee and refreshments with staff, residents and alumni. Ask anything — this is your chance to see the house for yourself.",
    ],
    rsvpNote: "Helps us plan enough refreshments",
    audience: ["Open to everyone", "Families welcome", "Guided tours"],
    contact: {
      questions: "Questions?",
      phone: "Call (916) 555-5555 or",
      email: "Email ghemail@gmail.com",
    },
  },
];

export function getEventDetail(slug: string): EventDetail | undefined {
  return eventDetails.find((e) => e.slug === slug);
}
