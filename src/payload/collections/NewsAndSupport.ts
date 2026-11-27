import { revalidatePath } from "next/cache";
import type { CollectionConfig } from "payload";
import {
  createAdminNotification,
  formatActorName,
} from "@/payload/lib/notifications";

function safeRevalidate() {
  try {
    revalidatePath("/news-and-support");
    revalidatePath("/");
  } catch {
    // Ignore when invoked outside a Next.js request context (e.g. CLI/migrations).
  }
}

function isPublishing(data: unknown): boolean {
  return (data as { _status?: string } | undefined)?._status === "published";
}

/**
 * News & Support — external news articles (links) and letters of support (PDFs)
 * displayed at /news-and-support. Uses Payload drafts & versions so editors can
 * save partial drafts and only enforce conditional publish requirements when
 * publishing.
 */
export const NewsAndSupport: CollectionConfig = {
  slug: "news-and-support",
  labels: {
    singular: "News & Support Item",
    plural: "News & Support",
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === "admin" || req.user?.role === "editor") return true;
      return { _status: { equals: "published" } };
    },
    create: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "editor",
    update: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "editor",
    delete: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "editor",
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        const isPublished = doc._status === "published";
        const wasPublished = previousDoc?._status === "published";
        if (isPublished || wasPublished) {
          safeRevalidate();
        }

        if (!req.user) return doc;
        const title =
          typeof doc.title === "string" && doc.title.trim()
            ? doc.title
            : "News & Support item";
        const actorName = formatActorName(req.user);
        const isDraft = doc._status === "draft";

        await createAdminNotification(req.payload, {
          title: isDraft
            ? operation === "create"
              ? "News & Support draft saved"
              : "News & Support draft updated"
            : operation === "create"
              ? "News & Support item published"
              : "News & Support item updated",
          message: `"${title}" was ${isDraft ? "saved as a draft" : operation === "create" ? "published" : "updated"} by ${actorName}.`,
          category: "content",
          severity: "info",
          actionUrl: `/admin/collections/news-and-support/${doc.id}`,
          actorId: req.user.id,
          req,
        });

        return doc;
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        safeRevalidate();
        return doc;
      },
    ],
  },
  admin: {
    group: "Community & Content",
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "type", "source", "date"],
    description:
      "External news articles and PDF letters of support displayed on /news-and-support. Save Draft to work in progress, or Publish when ready.",
    components: {
      beforeList: [
        { path: "./src/payload/components/DashboardListButton.tsx" },
      ],
    },
  },
  defaultSort: "-date",
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      required: true,
      admin: {
        placeholder: "Headline or letter title...",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "type",
          type: "select",
          label: "Type",
          required: true,
          defaultValue: "news",
          options: [
            { label: "In the News (Article Link)", value: "news" },
            { label: "Letter of Support (PDF)", value: "letter" },
          ],
          admin: {
            width: "50%",
          },
        },
        {
          name: "date",
          type: "date",
          label: "Date",
          required: true,
          admin: {
            width: "50%",
            date: {
              pickerAppearance: "dayOnly",
              displayFormat: "MMM d, yyyy",
            },
          },
        },
      ],
    },
    {
      name: "source",
      type: "text",
      label: "Source / Author",
      required: true,
      admin: {
        placeholder: "News outlet name (for news) or author name (for letters)...",
      },
    },
    {
      name: "summary",
      type: "textarea",
      label: "Summary / Pull Quote (optional)",
      admin: {
        placeholder: "One-line summary or pull quote...",
      },
    },
    {
      name: "externalUrl",
      type: "text",
      label: "External Article URL",
      admin: {
        placeholder: "https://example.com/article",
        description: "Full URL to the external news article (must start with https:// or http://).",
        condition: (data) => data?.type === "news",
      },
      validate: (value: unknown, { data }: { data?: unknown }) => {
        if (!isPublishing(data)) return true;
        if ((data as { type?: string } | undefined)?.type !== "news") return true;
        if (typeof value !== "string" || !value.trim()) {
          return "An external article URL is required to publish a news item.";
        }
        try {
          const parsed = new URL(value.trim());
          if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return "URL must start with http:// or https://.";
          }
          return true;
        } catch {
          return "Please enter a valid URL (e.g. https://example.com/article).";
        }
      },
    },
    {
      name: "file",
      type: "upload",
      relationTo: "media",
      label: "Letter PDF",
      filterOptions: {
        mimeType: { equals: "application/pdf" },
      },
      admin: {
        description: "Upload or choose a PDF file from Media.",
        condition: (data) => data?.type === "letter",
      },
      validate: (value: unknown, { data }: { data?: unknown }) => {
        if (!isPublishing(data)) return true;
        if ((data as { type?: string } | undefined)?.type !== "letter") return true;
        if (!value) {
          return "A PDF file is required to publish a letter of support.";
        }
        return true;
      },
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      label: "Thumbnail Image (optional)",
      filterOptions: {
        mimeType: { contains: "image/" },
      },
      admin: {
        description: "Optional image thumbnail shown on the card.",
      },
    },
    {
      name: "permissionConfirmed",
      type: "checkbox",
      label: "Author consent & privacy redaction confirmed",
      defaultValue: false,
      admin: {
        description:
          "Confirm the author consents to public display and that personal contact details and private participant info are redacted.",
        condition: (data) => data?.type === "letter",
      },
      validate: (value: unknown, { data }: { data?: unknown }) => {
        if (!isPublishing(data)) return true;
        if ((data as { type?: string } | undefined)?.type !== "letter") return true;
        if (value !== true) {
          return "You must confirm author consent and redaction before publishing a letter.";
        }
        return true;
      },
    },
  ],
};
