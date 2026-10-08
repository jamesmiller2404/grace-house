import { site } from "./site";
import { pillars } from "./pillars";
import { upcomingEvents } from "./events";
import { stories } from "./stories";
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
    props: {
      eyebrow: "Faith-Based Recovery",
      heading: "Hope Starts Here",
      image: "/images/hero1a.jpg",
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
        "The office is closed. Leave a message and we'll call back within two business day.",
      facts: site.facts,
      crisisTitle: "RESOURCES THAT ARE AVAILABLE 24/7",
      crisisLines: site.crisisLines,
    },
  },
  {
    type: "welcome",
    props: {
      heading: "What is Grace House",
      body: "Grace House NorCal is a faith-based discipleship program in Sacramento, California, dedicated to helping men and women overcome life’s challenges, rebuild their lives, and discover lasting hope through spiritual growth, personal accountability, and strong moral values. Through compassionate support and lasting relationships, we strive...",
      pullQuote: "to see families restored and give hope to the hopeless.",
      cta: { label: "Read our mission", href: "/about/mission" },
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
      events: upcomingEvents.slice(0, MAX_HOME_EVENTS),
      cta: { label: "View all events", href: "/events" },
    },
  },
];

