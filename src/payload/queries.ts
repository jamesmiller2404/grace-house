import { cache } from "react";
import { connection } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Event as PayloadEvent } from "../../payload-types";
import type { EventDetail, EventItem } from "@/content/events";
import type { MissionPage as PayloadMissionPage } from "../../payload-types";
import { missionPage as defaultMissionPage } from "@/content/mission";
import {
  donateDefaults,
  type DonatePage,
} from "@/content/donate";
import type { Hero as PayloadHero } from "../../payload-types";
import { heroDefaults } from "@/content/hero";
import type { Intro as PayloadIntro } from "../../payload-types";
import { introDefaults, type IntroContent } from "@/content/intro";
import type { GetHelpNow as PayloadGetHelpNow } from "../../payload-types";
import { helpStripDefaults } from "@/content/helpStrip";
import { site } from "@/content/site";
import type { HelpStripProps } from "@/sections/HelpStrip";
import type { HomeLayout as PayloadHomeLayout } from "../../payload-types";
import {
  defaultHomeLayout,
  type HomeLayoutSection,
} from "@/content/homeLayout";
import type { CustomPage as PayloadCustomPage } from "../../payload-types";
import {
  customPageSlug,
  type CustomPageBlock,
  type CustomPageContent,
  type CustomNavLink,
} from "@/content/customPages";
import { MAX_CUSTOM_PAGES } from "@/payload/collections/CustomPages";
import type { Story as PayloadStory } from "../../payload-types";
import {
  stories as defaultStories,
  type StoryItem,
} from "@/content/stories";
import {
  storyProfiles as defaultStoryProfiles,
  type StoryProfile,
} from "@/content/storyProfiles";
import { pillars } from "@/content/pillars";

/**
 * Event data access — the only place the app reads events from. Every event
 * shown on the site (the homepage section, the /events listing and each
 * /events/<slug> page) comes from the `events` collection in the database
 * through these helpers, so the admin panel (/admin/collections/events) is
 * the single source of truth: nothing event-related is hardcoded anymore.
 */

/** Grace House is in Sacramento, CA — the zone admin-panel dates are saved in. */
const SITE_TIMEZONE = "America/Los_Angeles";

/**
 * Last-resort contact details for event pages — only used when neither the
 * event itself nor the Contact Info panel has a phone number / email address
 * registered (see getEventBySlug, which resolves the event's contact pickers
 * against the registered entries first).
 */
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

/**
 * Map one database event to the full single-event page content. The contact
 * phone/email come in already resolved (getEventBySlug resolves the event's
 * pickers against the Contact Info panel's registered entries).
 */
function toEventDetail(
  doc: PayloadEvent,
  contact: { phone: string; email: string },
): EventDetail {
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
      phone: `Call ${contact.phone} or`,
      email: `Email ${contact.email}`,
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
 * The event's contact pickers are resolved against the Contact Info panel's
 * registered phone numbers / email addresses — a picked entry follows edits
 * made there, an unset picker uses the first registered entry, and only when
 * the panel has none at all do the static last-resort defaults apply.
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
    if (!doc) return undefined;

    const { phones, emails } = await getContactInfo();
    const contact = {
      phone:
        resolveContact(
          doc.contact?.phoneChoice,
          doc.contact?.phoneCustom,
          phones,
        ) ?? DEFAULT_PHONE,
      email:
        resolveContact(
          doc.contact?.emailChoice,
          doc.contact?.emailCustom,
          emails,
        ) ?? DEFAULT_EMAIL,
    };
    return toEventDetail(doc, contact);
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
 * The Donate page content, for the /support page. The first document in the
 * `donate` collection is the source of truth; if none exists yet (e.g. before
 * the first seed), the static content in src/content/donate.ts is shown so the
 * page never breaks. Each optional field falls back to its default value, so
 * a half-filled document still renders the current copy for everything the
 * editor has not touched.
 */
export const getDonate = cache(async (): Promise<DonatePage> => {
  await connection();
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "donate",
    limit: 1,
  });
  const doc = docs[0];
  if (!doc) return donateDefaults;
  const d = donateDefaults;
  return {
    title: doc.title || d.title,
    intro: doc.intro || d.intro,
    paypal: {
      heading: doc.paypal?.heading || d.paypal.heading,
      bodyStart: doc.paypal?.bodyStart ?? d.paypal.bodyStart,
      email: doc.paypal?.email ?? d.paypal.email,
      bodyEnd: doc.paypal?.bodyEnd ?? d.paypal.bodyEnd,
      buttonLabel: doc.paypal?.buttonLabel || d.paypal.buttonLabel,
      buttonHref: doc.paypal?.buttonHref || d.paypal.buttonHref,
    },
    venmo: {
      heading: doc.venmo?.heading || d.venmo.heading,
      bodyStart: doc.venmo?.bodyStart ?? d.venmo.bodyStart,
      username: doc.venmo?.username ?? d.venmo.username,
      bodyEnd: doc.venmo?.bodyEnd ?? d.venmo.bodyEnd,
      buttonLabel: doc.venmo?.buttonLabel || d.venmo.buttonLabel,
      buttonHref: doc.venmo?.buttonHref || d.venmo.profileHref,
      profileHref: doc.venmo?.profileHref || d.venmo.profileHref,
    },
    note: {
      text: doc.note?.text ?? d.note.text,
      phone: doc.note?.phone ?? d.note.phone,
      phoneHref: doc.note?.phoneHref ?? d.note.phoneHref,
    },
    blocks:
      doc.blocks?.map((block) => ({
        type: block.type === "Heading" ? "Heading" : "Paragraph",
        text: block.text,
        linkLabel: block.linkLabel ?? undefined,
        linkHref: block.linkHref ?? undefined,
      })) ?? d.blocks,
  };
});

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
 * Contact info data access — the only place the app reads the `contact-info`
 * global from. The registered phone numbers, email addresses and physical
 * addresses are managed in the admin panel (/admin/globals/contact-info);
 * every contact point the site shows (the footer, the Get Help Now strip)
 * picks one of them — or a custom value — so that panel is the single source
 * of truth for contact details and nothing stays hardcoded.
 */

/** One registered phone number / email address as the site consumes it. */
type RegisteredContact = { id: string; label: string | null; value: string };

/**
 * "(916) 470-0408" → "tel:+19164700408" — the tel: link derived from a
 * display phone number, so editors never maintain the link by hand. 10
 * digits get the US country code, 11 digits starting with 1 pass through,
 * anything else links as typed.
 */
function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  return `tel:${phone}`;
}

/**
 * Map the Contact Info global's raw rows (whose ids Payload types as
 * nullable, though array rows always carry one) to the RegisteredContact the
 * site consumes — rows without an id (never in practice) are dropped.
 */
function toRegisteredContacts(
  rows: { id?: string | null; label?: string | null; value: string }[],
): RegisteredContact[] {
  return rows
    .filter((row) => row.id)
    .map((row) => ({
      id: row.id as string,
      label: row.label ?? null,
      value: row.value,
    }));
}

/** The registered phone numbers, email addresses and street addresses, in panel order. */
export const getContactInfo = cache(
  async (): Promise<{
    phones: RegisteredContact[];
    emails: RegisteredContact[];
    addresses: RegisteredContact[];
  }> => {
    await connection();
    const payload = await getPayload({ config });
    const global = await payload.findGlobal({ slug: "contact-info" });
    return {
      phones: toRegisteredContacts(global.phoneNumbers ?? []),
      emails: toRegisteredContacts(global.emails ?? []),
      // Physical addresses share the { label, value } row shape with the
      // phone/email lists; nothing consumes them yet — they are read here so
      // this stays the only place the app touches the global.
      addresses: toRegisteredContacts(global.addresses ?? []),
    };
  },
);

/**
 * Resolve one picker's stored choice against the registered list — the
 * shared fallback chain of the footer (getFooterContact) and the Get Help
 * Now strip (getHelpStrip). A `registered:<id>` choice whose row still
 * exists returns that row's value (a live reference: edit the number once in
 * the Contact Info panel and every picker follows). A custom choice
 * returns the custom value; a row deleted since it was picked (or no valid
 * choice at all) falls back to the first registered entry, then to null so
 * the caller can use its own static default.
 */
function resolveContact(
  choice: string | null | undefined,
  custom: string | null | undefined,
  registered: RegisteredContact[],
): string | null {
  if (choice?.startsWith("registered:")) {
    const id = choice.slice("registered:".length);
    const match = registered.find((entry) => entry.id === id);
    if (match) return match.value;
  }
  if (choice === "custom" && custom?.trim()) return custom.trim();
  return registered[0]?.value ?? null;
}

/**
 * The phone number, email address and street address shown in the footer's
 * "Get Help" column — the choices made in the footer admin panel
 * (/admin/globals/footer), picked from the numbers/addresses registered in
 * Contact Info (or entered as custom values). The phone and email fall back
 * to the first registered entry, then to the static defaults in
 * src/content/site.ts, so the footer never breaks even before the panel is
 * filled in; the address has no static default — it comes back undefined and
 * the footer shows no address line until one is picked/registered. The tel:
 * and mailto: links are derived from the chosen values, never stored.
 */
export const getFooterContact = cache(
  async (): Promise<{
    phone: string;
    phoneHref: string;
    email: string;
    address?: string;
  }> => {
    await connection();
    const payload = await getPayload({ config });
    const footer = await payload.findGlobal({ slug: "footer" });
    const { phones, emails, addresses } = await getContactInfo();
    const phone =
      resolveContact(footer.phoneChoice, footer.phoneCustom, phones) ??
      site.phone;
    const email =
      resolveContact(footer.emailChoice, footer.emailCustom, emails) ??
      site.email;
    const address = resolveContact(
      footer.addressChoice,
      footer.addressCustom,
      addresses,
    );
    return {
      phone,
      phoneHref: telHref(phone),
      email,
      ...(address ? { address } : {}),
    };
  },
);

/**
 * The "Get Help Now" strip content — the heading, phone number, quick facts,
 * crisis resources and the assessment call-to-action. The first document in
 * the `get-help-now` collection (managed at /admin/collections/get-help-now)
 * is the source of truth — except the phone number, which is picked there
 * from the numbers registered in the Contact Info panel (or entered
 * manually) and resolved through getContactInfo above. If no document exists
 * yet (e.g. before the first seed) the
 * static defaults in src/content/helpStrip.ts are used so the strip never
 * breaks.
 *
 * When the document's "Show assessment call-to-action" checkbox is unticked,
 * the assessment sentence, the Start Assessment button and its note come
 * back as undefined — the HelpStrip section renders without them. The
 * undefined keys are returned deliberately (not omitted) so the caller's
 * `{...defaults, ...this}` spread also clears the static default values.
 */
export const getHelpStrip = cache(async (): Promise<HelpStripProps> => {
  await connection();
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "get-help-now",
    limit: 1,
  });
  const doc = docs[0] as PayloadGetHelpNow | undefined;
  if (!doc) return helpStripDefaults;

  const showAssessment = doc.showAssessment !== false;
  // The phone picked in the panel — a registered number (a live reference to
  // the Contact Info panel) or a custom one — with the tel: link derived from
  // it; falls back to the first registered number, then to the static default.
  const { phones } = await getContactInfo();
  const phone =
    resolveContact(doc.phoneChoice, doc.phoneCustom, phones) ??
    helpStripDefaults.phone;
  return {
    heading: doc.heading,
    body: doc.body,
    ...(showAssessment
      ? {
          assessmentNote: doc.assessmentNote ?? undefined,
          cta: {
            label: doc.ctaLabel ?? helpStripDefaults.cta!.label,
            href: doc.ctaHref ?? helpStripDefaults.cta!.href,
          },
          ctaNote: doc.ctaNote ?? undefined,
        }
      : {
          assessmentNote: undefined,
          cta: undefined,
          ctaNote: undefined,
        }),
    phone,
    phoneHref: telHref(phone),
    hours: doc.hours,
    facts: (doc.facts ?? []).map((fact) => fact.text),
    crisisTitle: doc.crisisTitle ?? undefined,
    crisisLines: (doc.crisisLines ?? []).map((line) => ({
      label: line.label,
      text: line.text,
      href: line.href,
    })),
  };
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
    return sections.map((row) => {
      // A "custom-page" row points at a `custom-pages` document; the
      // relationship comes back as a bare id, or as the populated document
      // when it was read with depth. Only the id is kept — the front page
      // resolves it through getCustomPageById, which re-checks visibility.
      const related = row.customPage;
      const customPage =
        typeof related === "object" && related !== null ? related.id : related;
      return {
        section: row.section as HomeLayoutSection["section"],
        enabled: row.enabled ?? true,
        customPage: customPage ?? null,
      };
    });
  }
  return defaultHomeLayout;
});

/**
 * Story data access — the only place the app reads Lives Changed / Stories
 * from. Every story shown on the site (the homepage "Lives Changed" section,
 * the /stories index and each /stories/<slug> page) comes from the `stories`
 * collection in the database through these helpers, so the admin panel
 * (/admin/collections/stories) is the single source of truth. When the
 * collection is still empty (e.g. before the first seed) the static content in
 * src/content/stories.ts and src/content/storyProfiles.ts is used so the pages
 * never break — the same fallback pattern as the hero / intro / mission
 * queries above.
 */

/** "Maria" -> "maria" (the /stories/<slug> URL segment). */
function storySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Index (0-based) into `pillars` of a story's saved pillar title. */
function pillarIndexFromTitle(title: string | null | undefined): number {
  if (!title) return 0;
  const index = pillars.findIndex((pillar) => pillar.title === title);
  return index >= 0 ? index : 0;
}

/** Read a media document's public URL from an upload field value. */
function mediaUrl(value: unknown): string {
  if (value && typeof value === "object" && "url" in value) {
    const url = (value as { url?: unknown }).url;
    return typeof url === "string" ? url : "";
  }
  return "";
}

/** The story body blocks mapped to the h2/p sequence the page renders. */
function toStoryBody(doc: PayloadStory): StoryProfile["body"] {
  return (doc.body ?? []).map((block) =>
    block.type === "Heading"
      ? { type: "h2" as const, text: block.text }
      : { type: "p" as const, text: block.text },
  );
}

/** Map one database story to the card/list item the sections render. */
function toStoryItem(doc: PayloadStory): StoryItem {
  const possessive = doc.pronouns?.possessive ?? "";
  return {
    name: doc.name,
    tag: doc.role,
    date: doc.date ?? "",
    // Fall back to the hero pull quote when no short card quote is set.
    excerpt: doc.excerpt ?? doc.pullQuote ?? "",
    image: mediaUrl(doc.image) || "/images/noPhotoAvailable_horizontall.png",
    href: `/stories/${storySlug(doc.name)}`,
    readLabel:
      doc.readLabel ??
      (possessive ? `Read ${possessive} story` : "Read their story"),
    pillarIndex: pillarIndexFromTitle(doc.pillar),
  };
}

/** Map one database story to the full single-story page content. */
function toStoryProfile(doc: PayloadStory): StoryProfile {
  return {
    slug: storySlug(doc.name),
    name: doc.name,
    tag: doc.role,
    image: mediaUrl(doc.image) || "/images/noPhotoAvailable_vertical.png",
    imagePositionX: doc.imagePositionX ?? 50,
    imagePositionY: doc.imagePositionY ?? 50,
    heroQuote: doc.pullQuote ?? "",
    body: toStoryBody(doc),
    quoteBand: {
      quote: doc.bannerQuote?.quote ?? "",
      attribution: doc.bannerQuote?.attribution ?? "",
    },
    closing: {
      heading: doc.closing?.heading ?? "",
      paragraphs: (doc.closing?.paragraphs ?? []).map((p) => p.text),
    },
    pillarIndex: pillarIndexFromTitle(doc.pillar),
    pronouns: {
      subject: doc.pronouns?.subject ?? "",
      possessive: doc.pronouns?.possessive ?? "",
    },
    memories: (doc.memories ?? []).map((memory) => ({
      image: mediaUrl(memory.image),
      alt: memory.alt ?? "",
      caption: memory.caption ?? "",
    })),
  };
}

/**
 * Every story as a card/list item, for the homepage "Lives Changed" section
 * (capped there) and the /stories index. Ordered by name; falls back to the
 * static src/content/stories.ts list when the collection is empty.
 */
export const getStories = cache(async (): Promise<StoryItem[]> => {
  await connection();
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "stories",
    limit: 100,
    sort: "name",
  });
  if (docs.length === 0) return defaultStories;
  return docs.map(toStoryItem);
});

/**
 * Every full story profile, for the /stories/<slug> pages and their "More
 * lives changed..." list. Falls back to the static src/content/storyProfiles.ts
 * list when the collection is empty.
 */
export const getStoryProfiles = cache(async (): Promise<StoryProfile[]> => {
  await connection();
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "stories",
    limit: 100,
    sort: "name",
  });
  if (docs.length === 0) return defaultStoryProfiles;
  return docs.map(toStoryProfile);
});

/**
 * One story profile by URL slug, for its /stories/<slug> page. The slug is
 * derived from the name, so any story in the database gets a page
 * automatically. Falls back to the static content before the first seed.
 */
export const getStoryProfileBySlug = cache(
  async (slug: string): Promise<StoryProfile | undefined> => {
    await connection();
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "stories",
      limit: 100,
      sort: "name",
    });
    const doc = docs.find((story) => storySlug(story.name) === slug);
    if (doc) return toStoryProfile(doc);
    return defaultStoryProfiles.find((profile) => profile.slug === slug);
  },
);

/**
 * Custom (spare) page data access — the only place the app reads the
 * `custom-pages` collection from. The three pre-wired spare pages are
 * managed in the admin panel (/admin/collections/custom-pages); a page only
 * exists to the public while its "Show in header menu" checkbox is ticked,
 * so every query here filters on `enabled`.
 */

/** Map one database custom page to the content the page renderer shows. */
function toCustomPageContent(doc: PayloadCustomPage): CustomPageContent {
  return {
    title: doc.title,
    slug: customPageSlug(doc.title),
    blocks: (doc.blocks ?? []).flatMap((block): CustomPageBlock[] => {
      // Photo rows render their Media image (with an optional caption).
      // A photo row with no image picked yet is skipped.
      if (block.type === "Photo") {
        const image = mediaUrl(block.image);
        if (!image) return [];
        return [
          {
            type: "photo",
            image,
            alt:
              typeof block.image === "object" && block.image
                ? (block.image.alt ?? "")
                : "",
            caption: block.caption ?? undefined,
          },
        ];
      }
      // Paragraph/Heading rows render their text with the optional link.
      // An empty-text row (half-filled in the admin panel) is skipped.
      const text = block.text ?? "";
      if (!text.trim()) return [];
      return [
        {
          type: block.type === "Heading" ? "heading" : "paragraph",
          text,
          linkLabel: block.linkLabel ?? undefined,
          linkHref: block.linkHref ?? undefined,
        },
      ];
    }),
  };
}

/**
 * One enabled custom page by id — used by the home page for a "Custom Page"
 * row of the home-layout global (the row stores the page id; see
 * src/app/(frontend)/page.tsx). Returns undefined for a page that is missing
 * or no longer visible (its "Show in header menu" checkbox unticked), so the
 * row renders nothing — the same graceful degradation as an unknown section
 * type.
 */
export const getCustomPageById = cache(
  async (id: number | string): Promise<CustomPageContent | undefined> => {
    await connection();
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "custom-pages",
      limit: 1,
      where: { id: { equals: id } },
    });
    const doc = docs[0];
    if (!doc || doc.enabled !== true) return undefined;
    return toCustomPageContent(doc);
  },
);

/**
 * The enabled custom pages as header "More" dropdown entries (label + URL),
 * for the site layout to hand to the nav. Disabled spare pages never appear.
 */
export const getCustomNavItems = cache(
  async (): Promise<CustomNavLink[]> => {
    await connection();
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "custom-pages",
      limit: MAX_CUSTOM_PAGES,
      where: { enabled: { equals: true } },
    });
    return docs.map((doc) => ({
      label: doc.title,
      href: `/pages/${customPageSlug(doc.title)}`,
    }));
  },
);

/**
 * One enabled custom page by URL slug, for its /pages/<slug> page. The slug
 * is derived from the title, so a renamed page moves to a new URL. Disabled
 * (or unknown) slugs return undefined — the page renderer turns that into a
 * 404, so a spare page stays invisible until it is switched on.
 */
export const getCustomPageBySlug = cache(
  async (slug: string): Promise<CustomPageContent | undefined> => {
    await connection();
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "custom-pages",
      limit: MAX_CUSTOM_PAGES,
      where: { enabled: { equals: true } },
    });
    const doc = docs.find((page) => customPageSlug(page.title) === slug);
    return doc ? toCustomPageContent(doc) : undefined;
  },
);
