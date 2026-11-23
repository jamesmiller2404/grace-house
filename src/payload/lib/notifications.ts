import type { Payload, PayloadRequest } from "payload";

export type NotificationCategory =
  | "media-video"
  | "content"
  | "events"
  | "security"
  | "system";

export type NotificationSeverity = "info" | "success" | "warning" | "error";

export type NotificationRole = "admin" | "editor";

export type CreateNotificationInput = {
  title: string;
  message?: string;
  category?: NotificationCategory;
  severity?: NotificationSeverity;
  actionUrl?: string;
  actorId?: string | number | null;
  targetRoles?: NotificationRole[];
  dedupeKey?: string;
  req?: PayloadRequest;
};

export function formatActorName(user: unknown): string {
  if (!user || typeof user !== "object") return "System";
  const record = user as { name?: unknown; email?: unknown };
  if (typeof record.name === "string" && record.name.trim()) {
    return record.name.trim();
  }
  if (typeof record.email === "string" && record.email.trim()) {
    return record.email.trim();
  }
  return "An admin user";
}

export async function createAdminNotification(
  payload: Payload,
  input: CreateNotificationInput,
): Promise<void> {
  try {
    if (input.dedupeKey) {
      const existing = await payload.find({
        collection: "admin-notifications",
        where: { dedupeKey: { equals: input.dedupeKey } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
        req: input.req,
      });
      if (existing.docs.length > 0) return;
    }

    await payload.create({
      collection: "admin-notifications",
      data: {
        title: input.title,
        message: input.message || "",
        category: input.category ?? "system",
        severity: input.severity ?? "info",
        actionUrl: input.actionUrl || "",
        actor:
          typeof input.actorId === "number" && Number.isFinite(input.actorId)
            ? input.actorId
            : typeof input.actorId === "string" && /^\d+$/.test(input.actorId)
              ? Number(input.actorId)
              : undefined,
        targetRoles:
          input.targetRoles && input.targetRoles.length > 0
            ? input.targetRoles
            : ["admin", "editor"],
        dedupeKey: input.dedupeKey || undefined,
      },
      overrideAccess: true,
      req: input.req,
    });
  } catch (error) {
    payload.logger.warn({ error }, "Failed to create admin notification.");
  }
}
