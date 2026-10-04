import { getSectionComponent, type SectionConfig } from "./registry";

/**
 * Renders one layout entry. Unknown section types render nothing, so an
 * admin misconfiguration (or a not-yet-built component) degrades gracefully
 * instead of crashing the page.
 */
export default function SectionRenderer({ section }: { section: SectionConfig }) {
  const Component = getSectionComponent(section.type);
  if (!Component) return null;
  return <Component {...section.props} />;
}
