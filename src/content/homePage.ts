import { site } from "./site";
import { pillars } from "./pillars";
import type { SectionConfig } from "@/sections/registry";

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
      eyebrow: "FAITH-BASED RECOVERY · SACRAMENTO",
      heading: "Hope starts here.",
      body: "Transforming lives. Restoring families. Renewing hope.",
      image: "/images/hero.jpg",
      primaryCta: { label: "Learn More", href: "#welcome" },
      secondaryCta: { label: "Our Stories", href: "/stories" },
    },
  },
    {
    type: "welcome",
    props: {
      heading: "Welcome to Grace House",
      body: "Grace House NorCal is a faith-based discipleship program in Sacramento, California, dedicated to helping men and women overcome life’s challenges, rebuild their lives, and discover lasting hope through spiritual growth, personal accountability, and strong moral values. Through compassionate support and lasting relationships, we strive...",
      pullQuote: "To see families restored and give hope to the hopeless.",
    },
  },
  {
    type: "help-strip",
    props: {
      heading: "Need help now?",
      openBody: "You don't have to figure this out alone. Talk to a real person.",
      closedBody: "It's late, and you still have options. The lines below are open right now.",
      phone: site.phone,
      phoneHref: site.phoneHref,
      cta: { label: "Start intake", href: "/get-help" },
      hours: site.hours,
      openNowLabel: "We're open now",
      closedLabel: "The office is closed. Leave a message and we'll call back within one business day.",
      facts: site.facts,
      crisisTitle: "SUPPORT AVAILABLE ANY TIME",
      crisisLines: site.crisisLines,
    },
  },
  {
    type: "four-pillars",
    props: {
      eyebrow: "WHAT GUIDES EVERYTHING WE DO",
      heading: "The Four Pillars of Recovery",
      intro: "Each step builds on the last, and the path leads home.",
      pillars,
      cta: { label: "Read about the Four Pillars →", href: "/about#pillars" },
    },
  },
];
