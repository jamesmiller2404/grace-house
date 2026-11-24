import type { CollectionConfig } from "payload";
import { BlockTypeButtonsField } from "@/payload/fields/BlockTypeButtons";
import { isValidVideoUrl } from "@/lib/videoEmbed";

/**
 * The "What is Grace House" homepage section. Editors set one rendered title
 * and add standard Heading, Paragraph and Photo blocks in display order.
 * Only one document should exist; the site reads the first one.
 */
export const Intro: CollectionConfig = {
  slug: "intro",
  labels: {
    singular: "What is Grace House",
    plural: "What is Grace House",
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === "admin" || req.user?.role === "editor",
    update: ({ req }) => req.user?.role === "admin" || req.user?.role === "editor",
    delete: ({ req }) => req.user?.role === "admin" || req.user?.role === "editor",
  },
  admin: {
    group: "Site Pages",
    useAsTitle: "title",
    defaultColumns: ["title", "updatedAt"],
    description: 'The "What is Grace House" section on the home page.',
    components: {
      beforeList: [
        { path: "./src/payload/components/DashboardListButton.tsx" },
      ],
      views: {
        edit: {
          default: {
            Component: {
              path: "./src/payload/collections/Intro/EditView.tsx",
            },
          },
        },
      },
      edit: {
        beforeDocumentControls: [
          { path: "./src/payload/collections/Intro/CancelToDashboardButton.tsx" },
          { path: "./src/payload/collections/Intro/DoneToListButton.tsx" },
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
        placeholder: "Page title...",
        description: "The title displayed above this section's content.",
      },
    },
    {
      name: "blocks",
      type: "array",
      labels: { singular: "Block", plural: "Blocks" },
      admin: {
        initCollapsed: false,
        description:
          "Add headings, paragraphs and photos in the order they should appear. A Photo block shows an image from the Media collection.",
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
              { label: "Header", value: "Heading" },
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
            placeholder: "Text...",
            description: "The header or paragraph text.",
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type === "Heading",
            components: {
              Field: {
                path: "./src/payload/fields/BlockTextInput/Field.tsx",
              },
            },
          },
        },
        {
          name: "content",
          type: "richText",
          label: false,
          admin: {
            className: "gh-intro-paragraph-input",
            description: "Write the paragraph and use the link tool to add clickable links.",
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type === "Paragraph",
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
