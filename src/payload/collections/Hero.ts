import type { CollectionConfig } from "payload";

/**
 * Front-page hero — the Payload version of the hero section in
 * `src/content/homePage.ts` (each field maps 1:1 to that section's props).
 *
 * The admin panel (/admin/collections/hero) gives an editor:
 *  - the main heading ("Hope Starts Here")
 *  - the subline shown beneath it (the "eyebrow", e.g. "Faith-Based Recovery")
 *  - the background image, chosen from the Media collection
 *
 * Only one document should exist here; the site reads the first one.
 */
export const Hero: CollectionConfig = {
  slug: "hero",
  labels: {
    singular: "Hero",
    plural: "Hero",
  },
  // Public site content — allow anonymous reads of the REST API.
  // (The site itself reads through the Local API, which bypasses
  // access control; this opens the public /api/hero endpoint.)
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "heading",
    defaultColumns: ["heading", "eyebrow", "updatedAt"],
    description:
      "The front page hero: the main heading, the subline beneath it, and the background image.",
    // Custom Edit view wrapper that paints the mockup frame
    // (photoshop_assets/adminPanelMockup1.png) — the same #111115 page
    // background, rounded #2d2d33 panel around the fields and #101012 input
    // boxes as the Events create/edit page. The same elements are repainted
    // for the Light theme.
    components: {
      views: {
        edit: {
          default: {
            Component: {
              path: "./src/payload/collections/Hero/EditView.tsx",
            },
          },
        },
      },
      // "Cancel" and "Done" buttons next to Save on the edit page — they
      // render in the document controls bar (before the Save button, in
      // array order) so the bar reads "Cancel | Done | Save", exactly like
      // the Events pages. Cancel returns to the admin dashboard; Done
      // returns to the Hero list.
      edit: {
        beforeDocumentControls: [
          {
            path: "./src/payload/collections/Hero/CancelToDashboardButton.tsx",
          },
          {
            path: "./src/payload/collections/Hero/DoneToListButton.tsx",
          },
        ],
      },
    },
  },
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
      // Placeholder-only look, like the Events form (the required marker is
      // painted by the Edit view — see ./Hero/EditView.tsx).
      label: false,
      admin: {
        placeholder: "Heading...",
        description:
          "The main heading over the hero image (e.g. \"Hope Starts Here\").",
      },
    },
    {
      name: "eyebrow",
      type: "text",
      label: false,
      admin: {
        placeholder: "Eyebrow...",
        description:
          "The subline shown beneath the heading (e.g. \"Faith-Based Recovery\").",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: false,
      admin: {
        description:
          "The background image behind the hero text. Optional — the site falls back to the default image when empty.",
      },
    },
  ],
};
