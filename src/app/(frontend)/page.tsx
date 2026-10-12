import SectionRenderer from "@/sections/SectionRenderer";
import { homePageSections, MAX_HOME_EVENTS } from "@/content/homePage";
import { getHero, getUpcomingEvents } from "@/payload/queries";
import type { SectionConfig } from "@/sections/registry";

/**
 * The front page is fully layout-driven: whatever sections appear in the
 * layout data get rendered in order. Adding, removing, hiding or reordering
 * a section never requires touching this file. Content that lives in the
 * database — the hero (from the `hero` collection) and upcoming events
 * (from the `events` collection) — is injected into its section here at
 * render time.
 */
export default async function Home() {
  const [events, hero] = await Promise.all([getUpcomingEvents(), getHero()]);

  const sections: SectionConfig[] = homePageSections.map((section) => {
    // Overlay the editable hero heading / subline / image from the database.
    if (section.type === "hero") {
      return { ...section, props: { ...section.props, ...hero } };
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
