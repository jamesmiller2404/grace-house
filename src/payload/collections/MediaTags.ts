import type { CollectionConfig } from "payload";

/**
 * Reusable tags for organizing Media records. A Media record can reference
 * multiple tags, and each tag can be reused by multiple Media records.
 */
export const MediaTags: CollectionConfig = {
  slug: "media-tags",
  labels: {
    singular: "Media Tag",
    plural: "Media Tags",
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
      "Create reusable tags to organize images in the Media Library. An image can have multiple tags.",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Use a short, descriptive tag name, such as Events.",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Optional note explaining how this tag should be used.",
      },
    },
  ],
};
