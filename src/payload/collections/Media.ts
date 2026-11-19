import type { CollectionConfig } from "payload";

/**
 * Upload collection for the central image library. Primary List is the
 * unfiltered Media collection view; user-created Media Lists are subsets.
 */

  
export const Media: CollectionConfig = {
  slug: "media",
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
        if (req.user?.role !== "admin" && req.user?.role !== "editor") {
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
            for (const doc of result.docs) {
              collectMediaIDs(doc, ids);
            }
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
    group: false,
    useAsTitle: "alt",
    defaultColumns: [
      "filename",
      "liveStatus",
      "alt",
      "tags",
      "lists",
      "mimeType",
      "updatedAt",
    ],
    description:
      "Primary List contains all images. Use albums to organize images into groups; an image can belong to multiple different albums.",
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
    adminThumbnail: ({ doc }) =>
      typeof doc.url === "string" ? doc.url : "",
    mimeTypes: ["image/*"],
    crop: false,
    focalPoint: false,
  },
  fields: [
    {
      name: "liveStatus",
      type: "ui",
      label: "Website",
      admin: {
        components: {
          Cell: {
            path: "./src/payload/collections/MediaLiveStatusCell.tsx",
          },
        },
      },
    },
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Describe the image for screen readers.",
      },
    },
    {
      name: "albumAssignmentNotice",
      type: "ui",
      admin: {
        components: {
          Field: {
            path: "./src/payload/collections/MediaAlbumAssignmentNotice.tsx",
          },
        },
      },
    },
    {
      name: "tags",
      type: "relationship",
      label: "Tags",
      relationTo: "media-tags",
      hasMany: true,
      admin: {
        description: "Assign one or more reusable tags to this image.",
      },
    },
    {
      name: "lists",
      type: "relationship",
      label: "Albums",
      relationTo: "media-lists",
      hasMany: true,
      admin: {
        description:
          "Add this image to one or more albums. Removing an album here does not delete the image.",
      },
    },
  ],
};

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
