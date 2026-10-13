/**
 * Home page layout — the ordered list of sections an editor can show/hide and
 * reorder from the admin panel (the `home-layout` global, at
 * /admin/globals/home-layout).
 *
 * This is the single source of truth shared by:
 *  - the `home-layout` global in the Payload admin panel (it builds the
 *    "Section" dropdown options from the list below), and
 *  - the front page (src/app/(frontend)/page.tsx), which renders the saved
 *    order.
 *
 * Each `type` maps 1:1 to a key in src/sections/registry.ts, so a saved row
 * can be handed straight to the SectionRenderer with no translation.
 */

/** The section types an editor can order/hide on the home page. */
export const homeSectionTypes = [
  "hero",
  "help-strip",
  "welcome",
  "four-pillars",
  "stories",
  "upcoming-events",
] as const;

export type HomeSectionType = (typeof homeSectionTypes)[number];

/**
 * Friendly names shown in the admin panel's "Section" dropdown and on each
 * row, matching how the sections are referred to on the site.
 */
export const homeSectionLabels: Record<HomeSectionType, string> = {
  hero: "Hero",
  "help-strip": "Get Help Now",
  welcome: "Intro",
  "four-pillars": "The Four Pillars",
  stories: "Lives Changed",
  "upcoming-events": "Upcoming Events",
};

/** One row of the home-layout global: a section and whether it's shown. */
export type HomeLayoutSection = {
  section: HomeSectionType;
  enabled?: boolean | null;
};

/**
 * The default order + visibility, matching the home page exactly as it was
 * before the admin panel took over. Used to seed the global on first run and
 * as the fallback the site renders when no layout document exists yet.
 */
export const defaultHomeLayout: HomeLayoutSection[] = homeSectionTypes.map(
  (section) => ({ section, enabled: true }),
);
