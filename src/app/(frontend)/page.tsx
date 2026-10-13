import SectionRenderer from "@/sections/SectionRenderer";
import {
  homePageSections,
  MAX_HOME_EVENTS,
  MAX_HOME_STORIES,
} from "@/content/homePage";
import {
  getHero,
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
 * section's props (src/content/homePage.ts) and hidden rows are dropped.
 *
 * Content that lives in the database — the hero (from the `hero` collection),
 * the "What is Grace House" intro (from the `intro` collection), upcoming
 * events (from the `events` collection) and the "Lives Changed" stories (from
 * the `stories` collection) — is injected into its section here at render
 * time.
 */
export default async function Home() {
  const [events, hero, intro, layout, stories] = await Promise.all([
    getUpcomingEvents(),
    getHero(),
    getIntro(),
    getHomeLayout(),
    getStories(),
  ]);

  // The static section configs, keyed by type, supply each section's props.
  const byType = new Map<string, SectionConfig>(
    homePageSections.map((section) => [section.type, section]),
  );

  const sections: SectionConfig[] = layout
    // Skip sections the editor has hidden.
    .filter((row) => row.enabled !== false)
    // Resolve each saved row to its section config; unknown types are dropped.
    .map((row) => byType.get(row.section))
    .filter((section): section is SectionConfig => section !== undefined)
    .map((section) => {
      // Overlay the editable hero heading / subline / image from the database.
      if (section.type === "hero") {
        return { ...section, props: { ...section.props, ...hero } };
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
