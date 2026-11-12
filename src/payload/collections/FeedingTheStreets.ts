import type { CollectionConfig } from "payload";
import { BlockTypeButtonsField } from "@/payload/fields/BlockTypeButtons";

/**
 * Feeding the Streets page content — Title plus an ordered stack of
 * heading/paragraph/photo blocks managed in the admin panel
 * (/admin/collections/feeding-the-streets).
 *
 * Only one document should exist here; the site reads the first one.
 */
export const FeedingTheStreets: CollectionConfig = {
  slug: "feeding-the-streets",
  labels: {
    singular: "Feeding the Streets",
    plural: "Feeding the Streets",
  },
  // Public site content — allow anonymous reads of the REST API.
  // (The site itself reads through the Local API, which bypasses
  // access control; this opens the public /api/feeding-the-streets endpoint.)
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
    useAsTitle: "title",
    defaultColumns: ["title", "updatedAt"],
    description:
      "The Title and heading/paragraph/photo blocks shown on the Feeding the Streets page (/feeding-the-streets).",
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
      name: "title",
      type: "text",
      required: true,
      label: false,
      admin: {
        placeholder: "Title...",
        description:
          "The page heading (e.g. \"Feeding the Streets\") and breadcrumb label.",
      },
    },
    {
      name: "blocks",
      type: "array",
      labels: {
        singular: "Block",
        plural: "Content Blocks",
      },
      admin: {
        initCollapsed: false,
        description:
          "Add headings, paragraphs and photos in the order they should appear on the page. Use a blank line between paragraphs in a text block.",
        components: {
          RowLabel: {
            path: "./src/payload/collections/CustomPages/BlockRowLabel.tsx",
          },
        },
      },
      fields: [
        {
          ...BlockTypeButtonsField({
            name: "type",
            options: [
              { label: "Heading", value: "Heading" },
              { label: "Paragraph", value: "Paragraph" },
              { label: "Photo", value: "Photo" },
            ],
            defaultValue: "Paragraph",
            required: true,
          }),
        },
        {
          name: "text",
          type: "textarea",
          label: false,
          admin: {
            placeholder: "Text...",
            description:
              "The paragraph or heading text. Use a blank line between paragraphs.",
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type !== "Photo",
            components: { Field: { path: "./src/payload/fields/BlockTextInput/Field.tsx" } },
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
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: {
            className: "gh-block-photo-input",
            description: "The photo shown by this block.",
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type === "Photo",
          },
        },
        {
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