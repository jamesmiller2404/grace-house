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
    plural: "Mission Pages",
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
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description:
          "The page heading (e.g. \"Mission\") and breadcrumb label.",
      },
    },
    {
      name: "body",
      type: "textarea",
      required: true,
      admin: {
        description:
          "The mission statement. Use a blank line between paragraphs.",
      },
    },
  ],
};
