import type { CollectionConfig } from "payload";

/**
 * Images uploaded through the admin panel. Event pages each reference one
 * image from this collection, so images can be reused across events.
 */
export const Media: CollectionConfig = {
  slug: "media",
  // Event photos are public site content — allow anonymous reads so the
  // site's <Image> tags (via the Next image optimizer) can fetch them.
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
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "mimeType", "updatedAt"],
  },
  upload: {
    // Only allow image files — these accompany event pages.
    mimeTypes: ["image/*"],
    // No image editing (crop / focal point adjustments) from the admin
    // panel: the "Edit Image" button this enables in the upload drawer is
    // unwanted on the event create/edit flow — the visible part of the
    // image is chosen with the draggable preview (ImagePositionField)
    // instead, so images are always used exactly as uploaded.
    crop: false,
    focalPoint: false,
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
