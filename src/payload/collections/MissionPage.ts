import type { CollectionConfig } from "payload";

/**
 * Mission page copy — the Payload version of `missionPage` in
 * `src/content/mission.ts` (each field maps 1:1 to that file's fields).
 *
 * The admin panel (/admin/collections/mission-page) gives you:
 *  - the single Mission page document with its Title and body text
 *  - edit buttons to update what the /about/mission page shows
 *
 * Only one document should exist here; the site reads the first one.
 */
export const MissionPage: CollectionConfig = {
  slug: "mission-page",
  labels: {
    singular: "Mission Page",
    plural: "Mission",
  },
  // Public site content — allow anonymous reads of the REST API.
  // (The site itself reads through the Local API, which bypasses
  // access control; this opens the public /api/mission-page endpoint.)
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title"],
    description:
      "The Title and body text shown on the Mission page (/about/mission).",
    // Custom Edit view wrapper that paints the mockup frame
    // (photoshop_assets/adminPanelMockup1.png) — the same #111115 page
    // background, rounded #2d2d33 panel around the fields and #101012 input
    // boxes as the Events and Hero create/edit pages. The same elements are
    // repainted for the Light theme.
    components: {
      views: {
        edit: {
          default: {
            Component: {
              path: "./src/payload/collections/MissionPage/EditView.tsx",
            },
          },
        },
      },
      // "Cancel" and "Done" buttons next to Save on the create/edit pages —
      // they render in the document controls bar (before the Save button, in
      // array order) so the bar reads "Cancel | Done | Save", exactly like
      // the Events and Hero pages. Cancel returns to the admin dashboard;
      // Done returns to the Mission Page list.
      edit: {
        beforeDocumentControls: [
          {
            path:
              "./src/payload/collections/MissionPage/CancelToDashboardButton.tsx",
          },
          {
            path: "./src/payload/collections/MissionPage/DoneToListButton.tsx",
          },
        ],
      },
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      // Placeholder-only look, like the Events and Hero forms (the required
      // marker is painted by the Edit view — see ./MissionPage/EditView.tsx).
      label: false,
      admin: {
        placeholder: "Title...",
        description:
          "The page heading (e.g. \"Mission\") and breadcrumb label.",
      },
    },
    {
      name: "body",
      type: "textarea",
      required: true,
      label: false,
      admin: {
        placeholder: "Body text...",
        description:
          "The mission statement. Use a blank line between paragraphs.",
      },
    },
  ],
};
