import { pillars } from "./pillars";
import { stories } from "./stories";
import { heroDefaults } from "./hero";
import { introDefaults } from "./intro";
import { helpStripDefaults } from "./helpStrip";
import type { SectionConfig } from "@/sections/registry";

/**
 * Maximum number of cards each homepage section displays. The full lists still
 * live on the dedicated /stories and /events pages; the homepage only shows a
 * preview, capped here.
 */
export const MAX_HOME_STORIES = 3;
export const MAX_HOME_EVENTS = 3;

/**
 * Front-page section layout — one source of truth for which sections appear,
 * in what order, and with what content.
 *
 * This array is what the future Payload admin panel will own: each entry's
 * `type` maps 1:1 to a Payload block slug in the `pages` collection, and the
 * shape of `props` mirrors that block's sub-fields. Editing this array is how
 * sections are turned on/off, reordered or swapped until Payload takes over.
 */
export const homePageSections: SectionConfig[] = [
  {
    type: "hero",
    // Heading, subline and image are editable in the admin panel
    // (/admin/collections/hero); these defaults are the fallback before the
    // database has a hero document.
    props: {
      ...heroDefaults,
      primaryCta: { label: "Get Help", href: "#help" },
      secondaryCta: { label: "Our Stories", href: "/#stories" },
    },
  },
  {
    type: "help-strip",
    // Heading, phone, assessment link and crisis resources are shared with the
    // standalone /get-help page via src/content/helpStrip.ts.
    props: {
      ...helpStripDefaults,
    },
  },
  {
    type: "welcome",
    // Heading, body, link and colors are editable in the admin panel
    // (/admin/collections/intro); these defaults are the fallback before the
    // database has an intro document.
    props: {
      ...introDefaults,
    },
  },
  {
    type: "four-pillars",
    props: {
      eyebrow: "WHAT GUIDES GRACE HOUSE",
      heading: "The Four Pillars of Recovery",
      subtitle: "- The Way -",
      pillars,
      cta: {
        label: "Read more about The Four Pillars",
        href: "/about/four-pillars",
      },
    },
  },
  {
    type: "stories",
    props: {
      eyebrow: "Lives Changed",
      heading: "Every journey begins somewhere.",
      subtitle: "Read how graduates found their footing, and their way home.",
      stories: stories.slice(0, MAX_HOME_STORIES),
      cta: { label: "View all stories", href: "/stories" },
    },
  },
  {
    type: "upcoming-events",
    props: {
      heading: "Upcoming Events",
      subtitle: "Join us.",
      // Filled in at render time from the Payload `events` collection
      // (see src/payload/queries.ts); capped to MAX_HOME_EVENTS there.
      events: [],
      cta: { label: "View all events", href: "/events" },
    },
  },
];
