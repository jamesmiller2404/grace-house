/**
 * Section registry — the bridge between page layout data and React components.
 *
 * Today the layout data comes from src/content/homePage.ts. When Payload is
 * wired in, it will come from a `pages` collection whose `layout` field is an
 * array of blocks whose slugs match the keys below 1:1. The components and
 * this registry stay unchanged.
 *
 * To add a new admin-managed section:
 *   1. Create src/sections/MySection.tsx with a typed props export.
 *   2. Register it below (key = future Payload block slug).
 *   3. Add it to the layout data (now homePage.ts, later Payload).
 */
import type { ComponentType } from "react";
import Hero, { type HeroProps } from "./Hero";
import Welcome, { type WelcomeProps } from "./Welcome";
import FourPillars, { type FourPillarsProps } from "./FourPillars";
import HelpStrip, { type HelpStripProps } from "./HelpStrip";
import UpcomingEvents, { type UpcomingEventsProps } from "./UpcomingEvents";

export type SectionConfig =
  | { type: "hero"; props: HeroProps }
  | { type: "welcome"; props: WelcomeProps }
  | { type: "four-pillars"; props: FourPillarsProps }
  | { type: "help-strip"; props: HelpStripProps }
  | { type: "upcoming-events"; props: UpcomingEventsProps };

export const sectionRegistry = {
  hero: { component: Hero },
  welcome: { component: Welcome },
  "four-pillars": { component: FourPillars },
  "help-strip": { component: HelpStrip },
  "upcoming-events": { component: UpcomingEvents },
} as const;

export type SectionType = keyof typeof sectionRegistry;

/** Returns the component for a section type, or undefined for unknown types. */
export function getSectionComponent(
  type: string,
): ComponentType<Record<string, unknown>> | undefined {
  const entry = (
    sectionRegistry as Record<string, { component: ComponentType<unknown> }>
  )[type];
  // The cast is contained here: every section component validates its own props at render time.
  return entry
    ? (entry.component as unknown as ComponentType<Record<string, unknown>>)
    : undefined;
}
