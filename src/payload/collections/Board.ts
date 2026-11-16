import type { CollectionConfig } from "payload";

/**
 * Board of Directors page — one document controls the page title, introduction,
 * and repeatable member profiles shown at /about/board.
 */
export const Board: CollectionConfig = {
  slug: "board",
  labels: {
    singular: "Board of Directors",
    plural: "Board of Directors",
  },
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
      "Manage the title, introduction, and board member profiles displayed on /about/board. Use one document for this page.",
    components: {
      beforeList: [
        { path: "./src/payload/components/DashboardListButton.tsx" },
      ],
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Page Title",
      defaultValue: "Board of Directors",
      admin: {
        placeholder: "Board of Directors",
        description: "The heading shown at the top of the public page.",
      },
    },
    {
      name: "intro",
      type: "richText",
      label: "Introduction",
      admin: {
        description:
          "Introductory text displayed beneath the page title. Use the editor toolbar to format text and add links.",
      },
    },
    {
      name: "members",
      type: "array",
      label: "Board Members",
      labels: {
        singular: "Board Member",
        plural: "Board Members",
      },
      minRows: 1,
      admin: {
        initCollapsed: false,
        description:
          "Add one section for each board member. Each section includes a profile picture, name, and role. The role is free text, so enter any title you need.",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          label: "Name",
          admin: {
            placeholder: "Board member's name...",
          },
        },
        {
          name: "role",
          type: "text",
          label: "Role",
          admin: {
            placeholder: "e.g. Board President, Treasurer, Member...",
            description: "Enter any role or title. This is a text field, not a dropdown.",
          },
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Profile Picture",
          admin: {
            components: {
              Field: {
                path: "./src/payload/fields/MediaPickerUploadField.tsx",
              },
            },
            description: "Choose this board member's profile picture from Media.",
          },
        },
      ],
    },
  ],
};
