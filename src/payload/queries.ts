import { cache } from "react";
import { connection } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Event as PayloadEvent } from "../../payload-types";
import type { EventDetail, EventItem } from "@/content/events";
import type { MissionPage as PayloadMissionPage } from "../../payload-types";
import { missionPage as defaultMissionPage } from "@/content/mission";

/**
 * Event data access — the only place the app reads events from. Every event
 * shown on the site (the homepage section, the /events listing and each
 * /events/<slug> page) comes from the `events` collection in the database
 * through these helpers, so the admin panel (/admin/collections/events) is
 * the single source of truth: nothing event-related is hardcoded anymore.
 */

/** Grace House is in Sacramento, CA — the zone admin-panel dates are saved in. */
const SITE_TIMEZONE = "America/Los_Angeles";

/** Contact details shown on event pages when an event has none saved. */
const DEFAULT_PHONE = "(916) 555-5555";
const DEFAULT_EMAIL = "ghemail@gmail.com";

/** "Halloween Haunted House" → "halloween-haunted-house" (the URL slug). */
function eventSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Convert a stored event date to the ISO day (YYYY-MM-DD) the components
 * render. Payload returns either a plain "2026-10-31" string (written by the
 * seed) or a timestamp saved from the admin panel as site-local midnight
 * (e.g. "2026-10-31T07:00:00.000Z") — format timestamps back in the site
 * timezone so the day never drifts.
 */
function toISODate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Date(value).toLocaleDateString("en-CA", {
    timeZone: SITE_TIMEZONE,
  });
}

/** Map one database event to the card/list item the section renders. */
function toEventItem(doc: PayloadEvent): EventItem {
  return {
    title: doc.title,
    date: toISODate(doc.date),
    time: doc.startTime,
    endTime: doc.endTime ?? "",
    location: doc.location,
    city: doc.city ?? "",
    description: doc.description,
    cost: doc.cost ?? "Free",
    href: `/events/${eventSlug(doc.title)}`,
  };
}

/** Map one database event to the full single-event page content. */
function toEventDetail(doc: PayloadEvent): EventDetail {
  return {
    slug: eventSlug(doc.title),
    title: doc.title,
    description: doc.description,
    status: doc.status,
    date: toISODate(doc.date),
    startTime: doc.startTime,
    endTime: doc.endTime ?? "",
    location: doc.location,
    city: doc.city ?? "",
    cost: doc.cost ?? "Free",
    image: typeof doc.image === "object" && doc.image.url ? doc.image.url : "",
    about: (doc.about ?? []).map((paragraph) => paragraph.text),
    whatToExpect: (doc.whatToExpect ?? []).map((paragraph) => paragraph.text),
    contact: {
      questions: "Questions?",
      phone: `Call ${doc.contact?.phone ?? DEFAULT_PHONE} or`,
      email: `Email ${doc.contact?.email ?? DEFAULT_EMAIL}`,
    },
  };
}

/**
 * All upcoming events, soonest first, for the homepage section (capped to
 * MAX_HOME_EVENTS there) and the /events listing. An event appears when its
 * status is "Upcoming" in the admin panel; "Past" and "Cancelled" events are
 * hidden. Wrapped in React's cache so a page render queries at most once.
 */
export const getUpcomingEvents = cache(async (): Promise<EventItem[]> => {
  // Events are owned in the admin panel, so read them at request time —
  // this also opts the rendering routes out of static prerendering.
  await connection();
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "events",
    limit: 100,
    sort: "date",
    where: { status: { equals: "Upcoming" } },
  });
  return docs.map(toEventItem);
});

/**
 * One event by URL slug, for its /events/<slug> page. The slug is derived
 * from the title, so any event in the database gets a page automatically.
 */
export const getEventBySlug = cache(
  async (slug: string): Promise<EventDetail | undefined> => {
    await connection();
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "events",
      limit: 100,
    });
    const doc = docs.find((event) => eventSlug(event.title) === slug);
    return doc ? toEventDetail(doc) : undefined;
  },
);

/**
 * The Mission page copy (title + body), for the /about/mission page. The
 * first document in the `mission-page` collection is the source of truth;
 * if none exists yet (e.g. before the first seed), the static content in
 * src/content/mission.ts is shown so the page never breaks.
 */
export const getMissionPage = cache(
  async (): Promise<{ title: string; body: string }> => {
    await connection();
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "mission-page",
      limit: 1,
    });
    const doc = docs[0] as PayloadMissionPage | undefined;
    if (doc) {
      return { title: doc.title, body: doc.body };
    }
    return {
      title: defaultMissionPage.missionHeading,
      body: defaultMissionPage.missionStatement,
    };
  },
);
