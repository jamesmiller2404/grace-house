import type { CollectionConfig } from "payload";

/** Central image library used by every content collection. */
export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Image",
    plural: "Media Library",
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
  endpoints: [
    {
      path: "/:id/apply-origin-tag",
      method: "post",
      handler: async (req) => {
        if (req.user?.role !== "admin" && req.user?.role !== "editor") {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = (await req.json?.()) as { sourceCollection?: unknown } | undefined;
        const collectionSlug =
          typeof body?.sourceCollection === "string" ? body.sourceCollection : "";

        const originTags: Record<string, string> = {
          events: "events",
          stories: "lives-changed",
          board: "board-members",
          "feeding-the-streets": "feeding-the-streets",
          "custom-pages": "custom-pages",
          donate: "donate",
          hero: "hero",
          intro: "intro",
          footer: "footer",
        };
        const tagName = originTags[collectionSlug];

        if (!tagName) {
          return Response.json(
            { error: "No automatic tag is configured for this upload source." },
            { status: 400 },
          );
        }

        const rawMediaID = req.routeParams?.id;
        const mediaID =
          typeof rawMediaID === "number"
            ? rawMediaID
            : typeof rawMediaID === "string" && /^\d+$/.test(rawMediaID)
              ? Number(rawMediaID)
              : null;
        if (mediaID === null) {
          return Response.json({ error: "A valid Media ID is required." }, { status: 400 });
        }

        const mediaDoc = await req.payload.findByID({
          collection: "media",
          id: mediaID,
          depth: 0,
          overrideAccess: true,
        });

        const existingTag = await req.payload.find({
          collection: "media-tags",
          where: { name: { equals: tagName } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        });

        let tag = existingTag.docs[0];
        if (!tag) {
          try {
            tag = await req.payload.create({
              collection: "media-tags",
              data: {
                name: tagName,
                description: `Default tag for images newly uploaded through the ${collectionSlug} collection.`,
              },
              overrideAccess: true,
            });
          } catch {
            const retry = await req.payload.find({
              collection: "media-tags",
              where: { name: { equals: tagName } },
              limit: 1,
              depth: 0,
              overrideAccess: true,
            });
            tag = retry.docs[0];
            if (!tag) throw new Error(`Could not create or find the ${tagName} media tag.`);
          }
        }

        const currentTags = Array.isArray(mediaDoc.tags) ? mediaDoc.tags : [];
        const tagIDs = currentTags
          .map((item) => {
            if (typeof item === "number") return item;
            if (item && typeof item === "object" && "id" in item) {
              const id = item.id;
              return typeof id === "number" ? id : null;
            }
            return null;
          })
          .filter((id): id is number => id !== null);

        if (!tagIDs.includes(tag.id)) {
          tagIDs.push(tag.id);
          await req.payload.update({
            collection: "media",
            id: mediaID,
            data: { tags: tagIDs },
            overrideAccess: true,
          });
        }

        return Response.json({ success: true, tag: tagName });
      },
    },
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
    group: "Community & Content",
    useAsTitle: "alt",
    defaultColumns: [
      "filename",
      "liveStatus",
      "alt",
      "tags",
      "mimeType",
      "updatedAt",
    ],
    description:
      "The central library for all website images. Use tags to organize and filter images.",
    components: {
      beforeList: [
        { path: "./src/payload/components/DashboardListButton.tsx" },
        { path: "./src/payload/collections/BulkMediaUpload.tsx" },
      ],
      beforeListTable: [
        { path: "./src/payload/collections/MediaTagFilters.tsx" },
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
      required: false,
      admin: {
        description: "Describe the image for screen readers. Leave blank for decorative images.",
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
