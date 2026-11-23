import type { CollectionConfig } from "payload";

function extractUserIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  const ids: number[] = [];
  for (const entry of value) {
    if (typeof entry === "number" && Number.isFinite(entry)) {
      ids.push(entry);
    } else if (typeof entry === "string" && /^\d+$/.test(entry)) {
      ids.push(Number(entry));
    } else if (entry && typeof entry === "object" && "id" in entry) {
      const id = (entry as { id?: unknown }).id;
      if (typeof id === "number" && Number.isFinite(id)) {
        ids.push(id);
      } else if (typeof id === "string" && /^\d+$/.test(id)) {
        ids.push(Number(id));
      }
    }
  }
  return ids;
}

export const AdminNotifications: CollectionConfig = {
  slug: "admin-notifications",
  labels: {
    singular: "Notification",
    plural: "Notifications",
  },
  access: {
    read: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "editor",
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  admin: {
    group: "Site Settings & Access",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "severity", "createdAt"],
  },
  endpoints: [
    {
      path: "/feed",
      method: "get",
      handler: async (req) => {
        const user = req.user;
        if (!user || (user.role !== "admin" && user.role !== "editor")) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const result = await req.payload.find({
          collection: "admin-notifications",
          sort: "-createdAt",
          limit: 40,
          depth: 1,
          overrideAccess: true,
          req,
        });

        const userId = String(user.id);
        const userRole = user.role;

        const visible = result.docs.filter((doc) => {
          const roles = Array.isArray(doc.targetRoles) ? doc.targetRoles : [];
          return roles.length === 0 || roles.includes(userRole);
        });

        const items = visible.map((doc) => {
          const readIds = extractUserIds(doc.readBy).map(String);
          const isRead = readIds.includes(userId);
          const actorObj =
            doc.actor && typeof doc.actor === "object"
              ? (doc.actor as { name?: unknown; email?: unknown })
              : null;
          const actorName =
            typeof actorObj?.name === "string" && actorObj.name.trim()
              ? actorObj.name.trim()
              : typeof actorObj?.email === "string"
                ? actorObj.email
                : null;

          return {
            id: doc.id,
            title: doc.title,
            message: doc.message || "",
            category: doc.category || "system",
            severity: doc.severity || "info",
            actionUrl: doc.actionUrl || "",
            actorName,
            createdAt: doc.createdAt,
            isRead,
          };
        });

        const unreadCount = items.filter((item) => !item.isRead).length;
        return Response.json({ items, unreadCount });
      },
    },
    {
      path: "/read-all",
      method: "post",
      handler: async (req) => {
        const user = req.user;
        if (!user || (user.role !== "admin" && user.role !== "editor")) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const result = await req.payload.find({
          collection: "admin-notifications",
          sort: "-createdAt",
          limit: 100,
          depth: 0,
          overrideAccess: true,
          req,
        });

        const userIdStr = String(user.id);
        await Promise.all(
          result.docs.map(async (doc) => {
            const roles = Array.isArray(doc.targetRoles) ? doc.targetRoles : [];
            if (roles.length > 0 && !roles.includes(user.role)) return;
            const readIds = extractUserIds(doc.readBy);
            if (readIds.some((id) => String(id) === userIdStr)) return;
            await req.payload.update({
              collection: "admin-notifications",
              id: doc.id,
              data: {
                readBy: [...readIds, user.id],
              },
              overrideAccess: true,
              req,
            });
          }),
        );

        return Response.json({ success: true });
      },
    },
    {
      path: "/:id/read",
      method: "post",
      handler: async (req) => {
        const user = req.user;
        if (!user || (user.role !== "admin" && user.role !== "editor")) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const rawId = req.routeParams?.id;
        const id =
          typeof rawId === "number" ||
          (typeof rawId === "string" && rawId.trim() !== "")
            ? rawId
            : null;
        if (id === null) {
          return Response.json({ error: "Invalid notification ID." }, { status: 400 });
        }

        const doc = await req.payload
          .findByID({
            collection: "admin-notifications",
            id,
            depth: 0,
            overrideAccess: true,
            req,
          })
          .catch(() => null);

        if (!doc) {
          return Response.json({ error: "Notification not found." }, { status: 404 });
        }

        const readIds = extractUserIds(doc.readBy);
        if (!readIds.some((entry) => String(entry) === String(user.id))) {
          await req.payload.update({
            collection: "admin-notifications",
            id: doc.id,
            data: {
              readBy: [...readIds, user.id],
            },
            overrideAccess: true,
            req,
          });
        }

        return Response.json({ success: true });
      },
    },
  ],
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "message",
      type: "textarea",
    },
    {
      name: "category",
      type: "select",
      defaultValue: "system",
      options: [
        { label: "Media & Video", value: "media-video" },
        { label: "Content", value: "content" },
        { label: "Events", value: "events" },
        { label: "Security & Access", value: "security" },
        { label: "System", value: "system" },
      ],
    },
    {
      name: "severity",
      type: "select",
      defaultValue: "info",
      options: [
        { label: "Info", value: "info" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" },
      ],
    },
    {
      name: "actionUrl",
      type: "text",
    },
    {
      name: "actor",
      type: "relationship",
      relationTo: "users",
    },
    {
      name: "targetRoles",
      type: "select",
      hasMany: true,
      defaultValue: ["admin", "editor"],
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
    },
    {
      name: "readBy",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
    },
    {
      name: "dedupeKey",
      type: "text",
      index: true,
    },
  ],
};
