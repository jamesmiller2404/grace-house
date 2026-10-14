import { site } from "./site";
import type { HelpStripProps } from "@/sections/HelpStrip";

/**
 * The "Get Help Now" content. Kept in one place so the home page strip
 * (src/content/homePage.ts) and the standalone /get-help page render the exact
 * same heading, phone number, assessment link and crisis resources — the two
 * can never drift apart. Typed against the HelpStrip section's props so the
 * shape stays in sync with the component.
 */
export const helpStripDefaults: HelpStripProps = {
  heading: "Need help now?",
  body: "You don't have to figure this out alone. Talk to a real person. Or you can fill out the assessment below and we will contact you within two business days.",
  phone: site.phone,
  phoneHref: site.phoneHref,
  cta: { label: "Start Assessment", href: "/assessment" },
  ctaNote: "Fill out the Grace House Assessment Form",
  hours: site.hours.label,
  facts: site.facts,
  crisisTitle: "RESOURCES THAT ARE AVAILABLE 24/7",
  crisisLines: site.crisisLines,
};
