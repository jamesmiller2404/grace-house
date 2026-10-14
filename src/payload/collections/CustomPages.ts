import type { CollectionConfig } from "payload";
import { StatusSelectField } from "@/payload/fields/StatusSelect";

/**
 * The most custom pages the site supports. Exactly this many are seeded
 * ("Spare Page 1/2/3"); the create-access check below refuses new documents
 * once the collection is full, so the admin panel always shows the three
 * pre-wired pages an editor can put to work at any time.
 */
export const MAX_CUSTOM_PAGES = 3;

/**
 * A spare page an editor can fill with anything — headings, paragraphs,
 * photos and links — from the admin panel (/admin/collections/custom-pages).
 *
 * There are always exactly three documents ("Spare Page 1/2/3", seeded on
 * first init). Each starts disabled and invisible:
 *
 *  - The page's URL (/pages/<page-name>) renders 404 while the "Show in
 *    header menu" checkbox is off.
 *  - Once the checkbox is ticked and the page is named, the name appears as
 *    a link in the header's "More" dropdown (desktop + mobile) and the page
 *    goes live.
 *
 * The page name doubles as the URL slug (the same trick Events and Stories
 * use — the slug is derived from the title, never stored), so renaming a
 * page moves its URL. Blocks mirror the Donate page's text-block pattern:
 * an ordered array where each block is a Paragraph, a Heading or a Photo,
 * and Paragraphs/Headings may carry one optional link after their text.
 */
export const CustomPages: CollectionConfig = {
  slug: "custom-pages",
  labels: {
    singular: "Custom Page",
    plural: "Custom Pages",
  },
  // Public site content — allow anonymous reads of the REST API.
  // (The site itself reads through the Local API, which bypasses
  // access control; this opens the public /api/custom-pages endpoint.)
  access: {
    read: () => true,
    // Cap the collection at MAX_CUSTOM_PAGES documents, so the three
    // pre-wired spare pages are all the panel ever offers.
    create: async ({ req: { payload } }) => {
      const { totalDocs } = await payload.count({ collection: "custom-pages" });
      return totalDocs < MAX_CUSTOM_PAGES;
    },
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "enabled", "updatedAt"],
    description:
      'Spare pages you can use for anything. Tick "Show in header menu", name the page and add heading/paragraph/photo blocks — the page goes live at /pages/<page-name> and its name appears in the header\'s "More" dropdown.',
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
              path: "./src/payload/collections/CustomPages/EditView.tsx",
            },
          },
        },
      },
      // "Cancel" and "Done" buttons next to Save on the create/edit pages —
      // they render in the document controls bar (before the Save button, in
      // array order) so the bar reads "Cancel | Done | Save", exactly like
      // the Events and Hero pages. Cancel returns to the admin dashboard;
      // Done returns to the Custom Pages list.
      edit: {
        beforeDocumentControls: [
          {
            path: "./src/payload/collections/CustomPages/CancelToDashboardButton.tsx",
          },
          {
            path: "./src/payload/collections/CustomPages/DoneToListButton.tsx",
          },
        ],
      },
    },
  },
  fields: [
    {
      // Off by default — a spare page stays hidden (404, no menu link) until
      // the editor turns it on. Ticking it and saving publishes both the page
      // and its "More" dropdown link.
      name: "enabled",
      type: "checkbox",
      defaultValue: false,
      label: "Show in header menu",
      admin: {
        description:
          'Tick to publish this page and add its name to the header\'s "More" dropdown. Leave unticked to keep it hidden while you work on it.',
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      // Placeholder-only look, like the Events and Hero forms (the required
      // marker is painted by the Edit view — see ./CustomPages/EditView.tsx).
      label: false,
      admin: {
        placeholder: "Page name...",
        description:
          'The page name — it becomes the heading on the page, the link label in the "More" dropdown and the URL (/pages/<page-name>). Renaming the page moves its URL.',
      },
    },
    {
      // The page body: an ordered list of blocks, each either a Paragraph, a
      // Heading or a Photo (the same text-block pattern as the Donate page,
      // extended with a photo block), so content can be added and stacked in
      // any order. A Paragraph/Heading block may carry one optional link
      // after its text; a Photo block is an image from the Media collection
      // with an optional caption under it.
      name: "blocks",
      type: "array",
      labels: {
        singular: "Block",
        plural: "Blocks",
      },
      admin: {
        // Keep every block open so the order is visible at a glance.
        initCollapsed: false,
        description:
          'Add headings, paragraphs and photos in the order they should appear. In a paragraph or heading, newlines render as line breaks. To turn words into a link, fill in the two Link fields on the block; leave both empty for plain text. A "Photo" block shows an image from the Media collection.',
        // Friendly row labels ("1. Heading: Our History", "2. Photo") instead
        // of Payload's default "Block 01" — see ./CustomPages/BlockRowLabel.tsx.
        components: {
          RowLabel: {
            path: "./src/payload/collections/CustomPages/BlockRowLabel.tsx",
          },
        },
      },
      fields: [
        {
          // The same dropdown the Donate blocks and Stories body use,
          // extended with the "Photo" choice.
          ...StatusSelectField({
            name: "type",
            options: ["Paragraph", "Heading", "Photo"],
            defaultValue: "Paragraph",
            required: true,
          }),
        },
        {
          // The block's text — only for Paragraph/Heading blocks (hidden for
          // a Photo row). Not required here so a half-filled row still
          // saves; the site skips empty text.
          name: "text",
          type: "textarea",
          label: false,
          admin: {
            placeholder: "Text...",
            description:
              "The paragraph or heading text. Use a blank line between paragraphs.",
            // Hidden when the row is a Photo — condition runs per array row
            // (siblingData is the row).
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type !== "Photo",
          },
        },
        {
          name: "linkLabel",
          type: "text",
          label: "Link Text (optional)",
          admin: {
            placeholder: "e.g. (916) 470-0408 or Facebook",
            description:
              'The clickable words shown after the block\'s text. Example: for the text "Call us at" this would be "(916) 470-0408". Leave empty for a plain paragraph with no link.',
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type !== "Photo",
          },
        },
        {
          name: "linkHref",
          type: "text",
          label: "Link URL (optional)",
          admin: {
            placeholder: "e.g. tel:+19169529797 or https://example.com",
            description:
              "Where the link goes. Use https://... for a website (opens in a new tab), tel:+1... for a phone number (opens the phone's dialer) or mailto:... for an email (opens the mail app). Only used when Link Text is filled in.",
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type !== "Photo",
          },
        },
        {
          // The photo — only for Photo blocks. Must be uploaded to the Media
          // collection first (admin panel -> Media).
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "The photo shown by this block.",
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type === "Photo",
          },
        },
        {
          // Optional caption under the photo — only for Photo blocks.
          name: "caption",
          type: "text",
          label: "Caption (optional)",
          admin: {
            placeholder: "Caption...",
            description: "Text shown in small type under the photo.",
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type === "Photo",
          },
        },
      ],
    },
  ],
};
