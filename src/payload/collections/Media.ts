import type { CollectionConfig } from "payload";

/**
 * Images uploaded through the admin panel. Event pages each reference one
 * image from this collection, so images can be reused across events.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "mimeType", "updatedAt"],
  },
  upload: {
    // Only allow image files — these accompany event pages.
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Describe the image for screen readers.",
      },
    },
  ],
};
