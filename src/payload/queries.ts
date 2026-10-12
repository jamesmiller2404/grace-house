import { cache } from "react";
import { connection } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Event as PayloadEvent } from "../../payload-types";
import type { EventDetail, EventItem } from "@/content/events";
import type { MissionPage as PayloadMissionPage } from "../../payload-types";
import { missionPage as defaultMissionPage } from "@/content/mission";
import type { Hero as PayloadHero } from "../../payload-types";
import { heroDefaults } from "@/content/hero";
import type { Intro as PayloadIntro } from "../../payload-types";
import { introDefaults, type IntroContent } from "@/content/intro";
import type { HomeLayout as PayloadHomeLayout } from "../../payload-types";
import {
  defaultHomeLayout,
  type HomeLayoutSection,
} from "@/content/homeLayout";

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
    // Start time is optional in the admin panel — coalesce to "" so the
    // section components can skip the time line when it's empty.
    time: doc.startTime ?? "",
    endTime: doc.endTime ?? "",
    location: doc.location,
    city: doc.city ?? "",
    description: doc.description ?? "",
    cost: doc.cost ?? "Free",
    href: `/events/${eventSlug(doc.title)}`,
    image:
      typeof doc.image === "object" && doc.image
        ? (doc.image.thumbnailURL ?? doc.image.url ?? "")
        : "",
    imagePositionX: doc.imagePositionX ?? 50,
    imagePositionY: doc.imagePositionY ?? 50,
  };
}

/** Map one database event to the full single-event page content. */
function toEventDetail(doc: PayloadEvent): EventDetail {
  return {
    slug: eventSlug(doc.title),
    title: doc.title,
    // The one-line description and start time are optional in the admin
    // panel — coalesce to "" so the page can skip them when they're empty.
    description: doc.description ?? "",
    status: doc.status,
    date: toISODate(doc.date),
    startTime: doc.startTime ?? "",
    endTime: doc.endTime ?? "",
    location: doc.location,
    city: doc.city ?? "",
    cost: doc.cost ?? "Free",
    image:
      typeof doc.image === "object" && doc.image && doc.image.url
        ? doc.image.url
        : "",
    imagePositionX: doc.imagePositionX ?? 50,
    imagePositionY: doc.imagePositionY ?? 50,
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

/**
 * The front-page hero content (heading, subline and background image), for the
 * homepage hero section. The first document in the `hero` collection is the
 * source of truth; if none exists yet (e.g. before the first seed), or a field
 * is empty, the static defaults in src/content/hero.ts are used so the hero
 * never breaks.
 */
export const getHero = cache(
  async (): Promise<{ heading: string; eyebrow: string; image: string }> => {
    await connection();
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "hero",
      limit: 1,
    });
    const doc = docs[0] as PayloadHero | undefined;
    if (doc) {
      return {
        heading: doc.heading,
        eyebrow: doc.eyebrow ?? heroDefaults.eyebrow,
        image:
          typeof doc.image === "object" && doc.image && doc.image.url
            ? doc.image.url
            : heroDefaults.image,
      };
    }
    return heroDefaults;
  },
);

/**
 * The "What is Grace House" (Intro) section content for the home page: the
 * heading, body, link and colors. The first document in the `intro` collection
 * is the source of truth, and its text fields are passed through exactly as
 * saved: a field left empty in the admin panel (e.g. the pull quote or the link
 * text) renders empty on the site — no default copy is substituted. Only when
 * no intro document exists at all (e.g. before the first seed) do the static
 * defaults in src/content/intro.ts keep the section from breaking; the color
 * fields fall back to those same defaults because they always carry a value.
 */
export const getIntro = cache(async (): Promise<IntroContent> => {
  await connection();
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "intro",
    limit: 1,
  });
  const doc = docs[0] as PayloadIntro | undefined;
  if (doc) {
    return {
      heading: doc.heading,
      body: doc.body,
      // A saved-empty text field stays empty — the admin value is the whole
      // story, so no default text is filled in here.
      pullQuote: doc.pullQuote ?? "",
      linkLabel: doc.linkLabel ?? "",
      linkHref: doc.linkHref ?? "",
      bgColor: doc.bgColor ?? introDefaults.bgColor,
      textColor: doc.textColor ?? introDefaults.textColor,
      linkColor: doc.linkColor ?? introDefaults.linkColor,
      linkHoverColor: doc.linkHoverColor ?? introDefaults.linkHoverColor,
    };
  }
  return introDefaults;
});

/**
 * The home page section order + visibility, for the front page. The
 * `home-layout` global is the source of truth: it lists each section in the
 * order an editor saved, with a flag for whether it is shown. When the global
 * is still empty (e.g. before the first seed) the static default order in
 * src/content/homeLayout.ts is used, so the page never breaks.
 */
export const getHomeLayout = cache(async (): Promise<HomeLayoutSection[]> => {
  await connection();
  const payload = await getPayload({ config });
  const doc = (await payload.findGlobal({
    slug: "home-layout",
  })) as PayloadHomeLayout | null;

  const sections = doc?.sections;
  if (Array.isArray(sections) && sections.length > 0) {
    return sections.map((row) => ({
      section: row.section as HomeLayoutSection["section"],
      enabled: row.enabled ?? true,
    }));
  }
  return defaultHomeLayout;
});
