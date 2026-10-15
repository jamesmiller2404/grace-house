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
  // A custom (spare) page shown as a home page section — the row also picks
  // which page (see HomeLayoutSection.customPage below).
  "custom-page",
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
  "custom-page": "Custom Page",
};

/** One row of the home-layout global: a section and whether it's shown. */
export type HomeLayoutSection = {
  section: HomeSectionType;
  enabled?: boolean | null;
  /**
   * For a "custom-page" row: the id of the `custom-pages` document it shows.
   * The admin panel only offers pages that are visible (their "Show in header
   * menu" checkbox is ticked); the front page skips the row when the page is
   * missing or no longer visible.
   */
  customPage?: number | null;
};

/**
 * The default order + visibility, matching the home page exactly as it was
 * before the admin panel took over. Used to seed the global on first run and
 * as the fallback the site renders when no layout document exists yet.
 *
 * "custom-page" is left out: there is no page to show until an editor adds a
 * row and picks one.
 */
export const defaultHomeLayout: HomeLayoutSection[] = homeSectionTypes
  .filter((section) => section !== "custom-page")
  .map((section) => ({ section, enabled: true }));
