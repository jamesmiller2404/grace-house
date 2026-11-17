import type { CollectionConfig } from "payload";

const mediaReferenceFields = new Set(["image", "memorialPhoto"]);

function collectMediaIDs(value: unknown, ids: Set<string>, fieldName?: string): void {
  if (Array.isArray(value)) {
    for (const item of value) collectMediaIDs(item, ids, fieldName);
    return;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (fieldName && mediaReferenceFields.has(fieldName)) {
      const id = record.id;
      if (typeof id === "string" || typeof id === "number") {
        ids.add(String(id));
      }
    }
    for (const [key, child] of Object.entries(record)) {
      collectMediaIDs(child, ids, key);
    }
    return;
  }

  if (
    fieldName &&
    mediaReferenceFields.has(fieldName) &&
    (typeof value === "string" || typeof value === "number")
  ) {
    ids.add(String(value));
  }
}

/**
 * Images uploaded through the admin panel. Event pages and other site
 * sections can reuse the same image; organizational lists do not duplicate
 * or move the underlying media file.
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
  endpoints: [
    {
      path: "/live-ids",
      method: "get",
      handler: async (req) => {
        if (
          req.user?.role !== "admin" &&
          req.user?.role !== "editor"
        ) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const ids = new Set<string>();
        const collections = [
          "events",
          "board",
          "custom-pages",
          "donate",
          "feeding-the-streets",
          "hero",
          "intro",
          "stories",
        ] as const;

        await Promise.all(
          collections.map(async (collection) => {
            const result = await req.payload.find({
              collection,
              depth: 0,
              limit: 1000,
              pagination: false,
              overrideAccess: true,
            });
            for (const doc of result.docs) collectMediaIDs(doc, ids);
          }),
        );

        const footer = await req.payload.findGlobal({
          slug: "footer",
          depth: 0,
          overrideAccess: true,
        });
        collectMediaIDs(footer, ids);

        return Response.json({ ids: Array.from(ids) });
      },
    },
  ],
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "lists", "mimeType", "updatedAt"],
    description:
      "Central image library. Use Lists to organize images by page, section, or purpose. An image can belong to multiple lists.",
    // Custom Edit view wrapper that paints the mockup frame.
    components: {
      beforeList: [
        { path: "./src/payload/components/DashboardListButton.tsx" },
      ],
      views: {
        edit: {
          default: {
            Component: {
              path: "./src/payload/collections/MediaEditView.tsx",
            },
          },
        },
      },
      // Keep the existing Cancel / Done controls beside Save.
      edit: {
        beforeDocumentControls: [
          {
            path: "./src/payload/collections/MediaCancelToDashboardButton.tsx",
          },
          {
            path: "./src/payload/collections/MediaDoneToListButton.tsx",
          },
        ],
      },
    },
  },
  upload: {
    // Use the original image for the larger Media list previews.
    adminThumbnail: ({ doc }) =>
      typeof doc.url === "string" ? doc.url : "",
    // Only allow image files.
    mimeTypes: ["image/*"],
    // Images are used exactly as uploaded; visible positioning is chosen
    // in the page-specific image-positioning controls.
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
    {
      name: "lists",
      type: "relationship",
      relationTo: "media-lists",
      hasMany: true,
      admin: {
        description:
          "Add this image to one or more lists. Removing a list here does not delete the image.",
      },
    },
  ],
};
