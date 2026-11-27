import type { CollectionConfig } from "payload";
import { BlockTypeButtonsField } from "@/payload/fields/BlockTypeButtons";
import { DividerBlockFields } from "@/payload/fields/DividerImage";
import { isValidVideoUrl } from "@/lib/videoEmbed";

/**
 * Custom pages an editor can create and manage without a fixed page limit.
 * The initial "Spare Page 1/2/3" documents are seeded for convenience, but
 * editors can create additional pages from the collection list.
 *
 * Each page starts disabled and invisible:
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

  create: ({ req }) =>
    req.user?.role === "admin" || req.user?.role === "editor",

  update: ({ req }) =>
    req.user?.role === "admin" || req.user?.role === "editor",

  delete: ({ req }) =>
    req.user?.role === "admin" || req.user?.role === "editor",
},
  admin: {
    group: "Site Pages",
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
      beforeList: [
        { path: "./src/payload/components/DashboardListButton.tsx" },
      ],
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
      name: "customPagePreview",
      type: "ui",
      admin: {
        components: {
          Field: {
            path: "./src/payload/collections/CustomPages/PreviewField.tsx",
          },
        },
      },
    },
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
          'Tick to add this page to the header\'s "More" dropdown. Leave unticked to keep it off the header menu while still allowing you to link to it using the Direct Link below.',
      },
    },
    {
      type: "row",
      admin: {
        className: "gh-cp-title-row",
      },
      fields: [
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
          name: "titleAlignment",
          type: "select",
          label: false,
          defaultValue: "left",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
          admin: {
            components: {
              Field: {
                path: "./src/payload/collections/CustomPages/TitleAlignmentField.tsx",
              },
            },
          },
        },
      ],
    },
    {
      name: "columns",
      type: "select",
      label: "Page Layout Columns",
      defaultValue: "1",
      options: [
        { label: "1 Column (Default)", value: "1" },
        { label: "2 Columns", value: "2" },
        { label: "3 Columns", value: "3" },
      ],
      admin: {
        components: {
          Field: {
            path: "./src/payload/collections/CustomPages/ColumnsField.tsx",
          },
        },
      },
    },
    {
      name: "directLink",
      type: "ui",
      admin: {
        components: {
          Field: {
            path: "./src/payload/collections/CustomPages/DirectLinkField.tsx",
          },
        },
      },
    },
    {
      // The page body: an ordered list of blocks, each either a Paragraph, a
      // Heading or a Photo (the same text-block pattern as the Donate page,
      // extended with a photo block), so content can be added and stacked in
      // any order. A Photo block is an image from the Media collection
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
          'Add headings, paragraphs and photos in the order they should appear. In a paragraph or heading, newlines render as line breaks. A "Photo" block shows an image from the Media collection.',
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
          ...BlockTypeButtonsField({
            name: "type",
            options: [
              { label: "Heading", value: "Heading" },
              { label: "Paragraph", value: "Paragraph" },
              { label: "Photo", value: "Photo" },
              { label: "Video", value: "Video" },
              { label: "Divider", value: "Divider" },
            ],
            defaultValue: "Paragraph",
            required: true,
          }),
        },
        ...DividerBlockFields(),
        {
          // Headings remain plain text; paragraph copy uses Lexical formatting.
          name: "text",
          type: "textarea",
          label: false,
          admin: {
            placeholder: "Heading...",
            description: "The heading text.",
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type === "Heading",
            components: { Field: { path: "./src/payload/fields/BlockTextInput/Field.tsx" } },
          },
        },
        {
          name: "content",
          type: "richText",
          label: false,
          admin: {
            className: "gh-custom-page-paragraph-input",
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type === "Paragraph",
          },
        },
        {
          // The photo — only for Photo blocks. Must be uploaded to the Media
          // collection first (admin panel -> Media).
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: {
            components: {
              Field: {
                path: "./src/payload/fields/MediaPickerUploadField.tsx",
              },
            },
            className: "gh-block-photo-input",
            description: "The photo shown by this block.",
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type === "Photo",
          },
        },
        {
          name: "videoUrl",
          type: "text",
          label: "Video Link",
          admin: {
            components: {
              Field: {
                path: "./src/payload/fields/YouTubeUrlField.tsx",
              },
            },
            placeholder: "https://www.youtube.com/watch?v=... or https://vimeo.com/...",
            description: "Paste a YouTube or Vimeo video link shown by this block.",
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type === "Video",
          },
          validate: (value: unknown, { siblingData }: { siblingData?: unknown }) =>
            (siblingData as { type?: string } | null)?.type !== "Video" ||
            (typeof value === "string" && isValidVideoUrl(value))
              ? true
              : "Enter a valid YouTube or Vimeo link for this Video block.",
        },
        {
          // Optional caption under the photo or video.
          name: "caption",
          type: "text",
          label: "Caption (optional)",
          admin: {
            placeholder: "Descriptive text shown below the photo or video...",
            description: "Optional descriptive text displayed on the webpage below the photo or video.",
            condition: (_data, siblingData) => {
              const type = (siblingData as { type?: string } | null)?.type;
              return type === "Photo" || type === "Video";
            },
          },
        },
      ],
    },
  ],
};
