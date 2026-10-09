import SectionRenderer from "@/sections/SectionRenderer";
import { homePageSections } from "@/content/homePage";

/**
 * The front page is fully layout-driven: whatever sections appear in the
 * layout data (homePageSections today, a Payload `pages` document later)
 * get rendered in order. Adding, removing, hiding or reordering a section
 * never requires touching this file.
 */
export default function Home() {
  return (
    <>
      <main className="flex-1">
        {homePageSections.map((section, i) => (
          <SectionRenderer key={`${section.type}-${i}`} section={section} />
        ))}
      </main>
    </>
  );
}
