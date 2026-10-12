import { site } from "./site";
import { pillars } from "./pillars";
import { stories } from "./stories";
import { heroDefaults } from "./hero";
import { introDefaults } from "./intro";
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
      primaryCta: { label: "Our Home", href: "#welcome" },
      secondaryCta: { label: "Our Stories", href: "/#stories" },
    },
  },
  {
    type: "help-strip",
    props: {
      heading: "Need help now?",
      openBody:
        "Our office is open. You don't have to figure this out alone. Talk to a real person. Or you can fill out the assessment below and we will contact you within two business days.",
      closedBody:
        "Our office is currently closed. You can fill out the assessment below and we will contact you within two business days.",
      phone: site.phone,
      phoneHref: site.phoneHref,
      cta: { label: "Start Assessment", href: "/assessment" },
      ctaNote: "Fill out the Grace House Assessment Form",
      hours: site.hours,
      openNowLabel: "We're open now",
      closedLabel:
        "The office is closed. Leave a message and we'll call back within two business days.",
      facts: site.facts,
      crisisTitle: "RESOURCES THAT ARE AVAILABLE 24/7",
      crisisLines: site.crisisLines,
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
