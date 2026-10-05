import type { ComponentType } from "react";
import { sectionRegistry, type SectionConfig } from "./registry";

/**
 * Renders one layout entry. Unknown section types render nothing, so an
 * admin misconfiguration (or a not-yet-built component) degrades gracefully
 * instead of crashing the page.
 */
export default function SectionRenderer({
  section,
}: {
  section: SectionConfig;
}) {
  // Direct registry lookup (not a function call) so the component is a
  // stable, externally-defined reference rather than one created during render.
  const entry = (
    sectionRegistry as unknown as Record<
      string,
      { component: ComponentType<Record<string, unknown>> } | undefined
    >
  )[section.type];
  if (!entry) return null;
  const Component = entry.component;
  return <Component {...section.props} />;
}
