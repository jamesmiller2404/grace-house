import type { GlobalConfig } from "payload";
import { homeSectionLabels, homeSectionTypes } from "@/content/homeLayout";

/**
 * Home page layout — the admin panel page (/admin/globals/home-layout) where
 * an editor chooses which home page sections appear and in what order.
 *
 * The page lists every section as one row (see src/content/homeLayout.ts for
 * the list and the friendly names). Each row has:
 *  - a "Section" dropdown (which section the row controls), and
 *  - a "Show on home page" checkbox (untick to hide it without losing its
 *    place in the order).
 *
 * Reordering uses Payload's built-in array controls: drag a row on desktop, or
 * open the row's "..." menu and use Move Up / Move Down — the easiest option
 * on a phone, where dragging is fiddly. The saved row order is what the front
 * page renders; see src/app/(frontend)/page.tsx.
 *
 * Only one document exists; the site reads it through the Local API
 * (src/payload/queries.ts -> getHomeLayout).
 */
export const HomeLayout: GlobalConfig = {
  slug: "home-layout",
  label: "Home Page Layout",
  // Public site content — allow anonymous reads of the REST API.
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Choose which sections appear on the home page and in what order. Drag a section to reorder it, or open its "..." menu and use Move Up / Move Down (the easiest way on a phone). Untick "Show on home page" to hide a section without removing it.',
  },
  fields: [
    {
      name: "sections",
      type: "array",
      required: true,
      minRows: 1,
      labels: {
        singular: "Section",
        plural: "Sections",
      },
      admin: {
        // Keep every row open so the section name, its "Show on home page"
        // checkbox and the reorder controls are all visible at a glance.
        initCollapsed: false,
        // Friendly row labels ("1. Get Help Now") instead of Payload's
        // default "Section 01" — see ./HomeLayout/RowLabel.tsx.
        components: {
          RowLabel: {
            path: "./src/payload/globals/HomeLayout/RowLabel.tsx",
          },
        },
      },
      fields: [
        {
          name: "section",
          type: "select",
          required: true,
          options: homeSectionTypes.map((value) => ({
            label: homeSectionLabels[value],
            value,
          })),
          admin: {
            description: "Which home page section this row controls.",
          },
        },
        {
          name: "enabled",
          type: "checkbox",
          defaultValue: true,
          label: "Show on home page",
          admin: {
            description:
              "Untick to hide this section without removing it from the order.",
          },
        },
      ],
    },
  ],
};
