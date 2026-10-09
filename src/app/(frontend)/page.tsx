import SectionRenderer from "@/sections/SectionRenderer";
import { homePageSections, MAX_HOME_EVENTS } from "@/content/homePage";
import { getUpcomingEvents } from "@/payload/queries";

/**
 * The front page is fully layout-driven: whatever sections appear in the
 * layout data get rendered in order. Adding, removing, hiding or reordering
 * a section never requires touching this file. Content that lives in the
 * database — today, upcoming events from the `events` collection — is
 * injected into its section here at render time.
 */
export default async function Home() {
  const events = await getUpcomingEvents();

  // Fill the upcoming-events section with live data from the database,
  // capped to the homepage's preview limit.
  const sections = homePageSections.map((section) =>
    section.type === "upcoming-events"
      ? {
          ...section,
          props: {
            ...section.props,
            events: events.slice(0, MAX_HOME_EVENTS),
          },
        }
      : section,
  );

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
