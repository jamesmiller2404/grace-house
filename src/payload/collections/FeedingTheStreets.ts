import type { CollectionConfig } from "payload";
import { BlockTypeButtonsField } from "@/payload/fields/BlockTypeButtons";
import { isValidVideoUrl } from "@/lib/videoEmbed";

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
    group: "Community & Content",
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
          "Add headings, formatted paragraphs and photos in the order they should appear on the page. Use the paragraph editor toolbar to format text and add links.",
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
              { label: "Video", value: "Video" },
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
            className: "gh-feeding-paragraph-input",
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type === "Paragraph",
          },
        },
        {
          name: "linkLabel",
          type: "text",
          label: "Link Text (optional)",
          admin: {
            hidden: true,
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
            hidden: true,
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