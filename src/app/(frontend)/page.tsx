import SectionRenderer from "@/sections/SectionRenderer";
import {
  homePageSections,
  MAX_HOME_EVENTS,
  MAX_HOME_STORIES,
} from "@/content/homePage";
import {
  getCustomPageById,
  getHero,
  getHelpStrip,
  getHomeLayout,
  getIntro,
  getStories,
  getUpcomingEvents,
} from "@/payload/queries";
import type { SectionConfig } from "@/sections/registry";

/**
 * The front page is fully layout-driven: the order in which the sections
 * appear — and which of them appear at all — is owned by the admin panel's
 * "Home Page Layout" page (the `home-layout` global). Each saved row names a
 * section type; here it is mapped to the static config that carries that
 * section's props (src/content/homePage.ts) and hidden rows are dropped. A
 * "Custom Page" row instead names a `custom-pages` document, which is
 * resolved here (enabled pages only) into the same kind of section config.
 *
 * Content that lives in the database — the hero (from the `hero` collection),
 * the "What is Grace House" intro (from the `intro` collection), upcoming
 * events (from the `events` collection) and the "Lives Changed" stories (from
 * the `stories` collection) — is injected into its section here at render
 * time.
 */
export default async function Home() {
  const [events, hero, helpStrip, intro, layout, stories] = await Promise.all([
    getUpcomingEvents(),
    getHero(),
    getHelpStrip(),
    getIntro(),
    getHomeLayout(),
    getStories(),
  ]);

  // The static section configs, keyed by type, supply each section's props.
  const byType = new Map<string, SectionConfig>(
    homePageSections.map((section) => [section.type, section]),
  );

  // The custom (spare) pages the layout places on the front page: a "Custom
  // Page" row stores the picked page's id, resolved here. Only enabled pages
  // resolve — a row whose page was hidden or deleted renders nothing, the
  // same graceful degradation as an unknown section type.
  const customPageIds = layout
    .filter((row) => row.section === "custom-page" && row.enabled !== false)
    .map((row) => row.customPage)
    .filter((id): id is number => id !== null && id !== undefined);
  const customPageSections = new Map<string, SectionConfig>();
  await Promise.all(
    customPageIds.map(async (id) => {
      const page = await getCustomPageById(id);
      if (page) {
        customPageSections.set(String(id), {
          type: "custom-page",
          props: { page },
        });
      }
    }),
  );

  // Whether the "Get Help Now" strip is shown on the home page. The hero's
  // "Get Help" button links to the on-page strip when it is; when an editor
  // hides the strip, the button falls back to the standalone /get-help page.
  const helpStripVisible = layout.some(
    (row) => row.section === "help-strip" && row.enabled !== false,
  );

  const sections: SectionConfig[] = layout
    // Skip sections the editor has hidden.
    .filter((row) => row.enabled !== false)
    // Resolve each saved row to its section config; unknown types and
    // custom-page rows whose page is missing/hidden are dropped.
    .map((row) =>
      row.section === "custom-page"
        ? row.customPage
          ? customPageSections.get(String(row.customPage))
          : undefined
        : byType.get(row.section),
    )
    .filter((section): section is SectionConfig => section !== undefined)
    .map((section) => {
      // Overlay the editable hero heading / subline / image from the database.
      if (section.type === "hero") {
        return {
          ...section,
          props: {
            ...section.props,
            ...hero,
            // Point the "Get Help" button at the "Get Help Now" strip when it
            // is shown; otherwise send visitors to the standalone /get-help
            // page so the button always leads somewhere useful.
            primaryCta: {
              label: section.props.primaryCta?.label ?? "Get Help",
              href: helpStripVisible ? "#help" : "/get-help",
            },
          },
        };
      }
      // Overlay the editable "Get Help Now" strip content (heading, phone,
      // quick facts, crisis resources, and whether the assessment
      // call-to-action is shown at all) from the database.
      if (section.type === "help-strip") {
        return { ...section, props: { ...section.props, ...helpStrip } };
      }
      // Overlay the editable "What is Grace House" copy and colors.
      if (section.type === "welcome") {
        return { ...section, props: { ...section.props, ...intro } };
      }
      // Fill the upcoming-events section with live data from the database,
      // capped to the homepage's preview limit.
      if (section.type === "upcoming-events") {
        return {
          ...section,
          props: {
            ...section.props,
            events: events.slice(0, MAX_HOME_EVENTS),
          },
        };
      }
      // Fill the "Lives Changed" section with live data from the database,
      // capped to the homepage's preview limit.
      if (section.type === "stories") {
        return {
          ...section,
          props: {
            ...section.props,
            stories: stories.slice(0, MAX_HOME_STORIES),
          },
        };
      }
      return section;
    });

  return (
    <>
      <main className="flex-1">
        {sections.map((section, i) => (
          <SectionRenderer key={`${section.type}-${i}`} section={section} />
        ))}
      </main>
    </>
  );
}
