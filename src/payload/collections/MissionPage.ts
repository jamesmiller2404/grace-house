import type { CollectionConfig } from "payload";
import { BlockTypeButtonsField } from "@/payload/fields/BlockTypeButtons";
import { DividerBlockFields } from "@/payload/fields/DividerImage";
import { isValidVideoUrl } from "@/lib/videoEmbed";

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
    defaultColumns: ["title"],
    description:
      "The Title and body text shown on the Mission page (/about/mission).",
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
      // Keep the original text column for existing content and migration
      // fallback. Editors use the formatted Lexical field below.
      name: "body",
      type: "textarea",
      label: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: "bodyContent",
      type: "richText",
      label: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: "blocks",
      type: "array",
      labels: {
        singular: "Block",
        plural: "Blocks",
      },
      admin: {
        initCollapsed: false,
        description:
          "Add headings, paragraphs, photos, videos, and divider graphics in the order they should appear on the Mission page.",
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
              { label: "Divider", value: "Divider" },
            ],
            defaultValue: "Paragraph",
            required: true,
          }),
        },
        ...DividerBlockFields(),
        {
          name: "text",
          type: "textarea",
          label: false,
          admin: {
            placeholder: "Heading...",
            description: "The heading text.",
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type === "Heading",
            components: {
              Field: { path: "./src/payload/fields/BlockTextInput/Field.tsx" },
            },
          },
        },
        {
          name: "content",
          type: "richText",
          label: false,
          admin: {
            className: "gh-mission-body-input",
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
            placeholder:
              "https://www.youtube.com/watch?v=... or https://vimeo.com/...",
            description: "Paste a YouTube or Vimeo video link.",
            condition: (_data, siblingData) =>
              (siblingData as { type?: string } | null)?.type === "Video",
          },
          validate: (
            value: unknown,
            { siblingData }: { siblingData?: unknown },
          ) =>
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
            condition: (_data, siblingData) => {
              const t = (siblingData as { type?: string } | null)?.type;
              return t === "Photo" || t === "Video";
            },
          },
        },
      ],
    },
  ],
};
