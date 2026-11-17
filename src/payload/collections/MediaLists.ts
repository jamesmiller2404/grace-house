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
  endpoints: [
    {
      path: "/counts",
      method: "get",
      handler: async (req) => {
        if (req.user?.role !== "admin" && req.user?.role !== "editor") {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch memberships once and aggregate counts for every list. This
        // avoids one Media API request per list on the Media Lists screen.
        const media = await req.payload.find({
          collection: "media",
          depth: 0,
          limit: 10000,
          pagination: false,
          overrideAccess: true,
        });
        const counts: Record<string, number> = {};
        for (const image of media.docs) {
          if (!Array.isArray(image.lists)) continue;
          for (const relation of image.lists) {
            const id =
              typeof relation === "object" && relation !== null
                ? relation.id
                : relation;
            if (typeof id === "string" || typeof id === "number") {
              const key = String(id);
              counts[key] = (counts[key] ?? 0) + 1;
            }
          }
        }

        return Response.json({
          counts: { primary: media.docs.length, ...counts },
        });
      },
    },
  ],
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "description", "updatedAt"],
    description:
      "Create and manage named groups for images in the Media library. Assign images to lists from the Media edit screen.",
    components: {
      beforeList: [
        { path: "./src/payload/components/DashboardListButton.tsx" },
      ],
      edit: {
        beforeDocumentControls: [
          {
            path: "./src/payload/collections/MediaLists/CancelButton.tsx",
          },
          {
            path: "./src/payload/collections/MediaLists/DoneButton.tsx",
          },
        ],
      },
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
