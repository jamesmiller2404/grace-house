import type { CollectionConfig } from "payload";

/**
 * Editor-managed organizational lists for the central Media library.
 * Membership is stored on each Media document, allowing one image to appear
 * in several lists without duplicating the uploaded file.
 */
export const MediaLists: CollectionConfig = {
  slug: "media-lists",
  labels: {
    singular: "Media List",
    plural: "Media Lists",
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
    useAsTitle: "name",
    defaultColumns: ["name", "description", "updatedAt"],
    description:
      "Create and manage named groups for images in the Media library. Assign images to lists from the Media edit screen.",
    components: {
      beforeList: [
        { path: "./src/payload/components/DashboardListButton.tsx" },
      ],
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description:
          "A clear name such as Home Page, Board Members, Events, or Staff.",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Optional note explaining what this list is for.",
      },
    },
    {
      name: "images",
      type: "join",
      collection: "media",
      on: "lists",
      admin: {
        defaultColumns: ["filename", "alt", "updatedAt"],
        description:
          "Images currently assigned to this list. Open an image to change its list assignments.",
      },
    },
  ],
};
