import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { APIError, type CollectionConfig } from "payload";
import {
  deleteR2Object,
  getPresignedR2UploadUrl,
  getPresignedR2Url,
  getR2VideoPrefix,
  isR2Configured,
  isVideoFilename,
  isVideoMimeType,
  listR2VideoObjects,
  MAX_VIDEO_BYTES,
  sanitizeDownloadFilename,
  VIDEO_MIME_TYPES,
} from "@/payload/lib/r2Media";

/** Central media library (images & videos up to 220 MB) used across the site. */
export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Media Item",
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
    {
      path: "/r2-videos",
      method: "get",
      handler: async (req) => {
        if (req.user?.role !== "admin" && req.user?.role !== "editor") {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const mediaResult = await req.payload.find({
          collection: "media",
          limit: 1000,
          depth: 0,
          pagination: false,
          overrideAccess: true,
        });

        const byFilename = new Map<
          string,
          { id: string | number; mimeType?: string | null; filesize?: number | null; url?: string | null; updatedAt?: string | null }
        >();
        for (const doc of mediaResult.docs) {
          if (typeof doc.filename === "string" && doc.filename) {
            byFilename.set(doc.filename, {
              id: doc.id,
              mimeType: doc.mimeType,
              filesize: doc.filesize,
              url: doc.url,
              updatedAt: doc.updatedAt,
            });
          }
        }

        const apiRoute = req.payload.config.routes.api.replace(/\/$/, "");

        if (isR2Configured()) {
          const r2Objects = await listR2VideoObjects();
          const videos = await Promise.all(
            r2Objects.map(async (obj) => {
              const filename = obj.key.split("/").pop() || obj.key;
              const linked = byFilename.get(obj.key) ?? byFilename.get(filename);
              const playUrl = await getPresignedR2Url({
                key: obj.key,
                filename,
                disposition: "inline",
              });
              const downloadUrl = linked
                ? `${apiRoute}/media/${encodeURIComponent(String(linked.id))}/download`
                : `${apiRoute}/media/r2-videos/download?key=${encodeURIComponent(obj.key)}`;

              return {
                key: obj.key,
                filename,
                size: obj.size,
                lastModified: obj.lastModified,
                mediaId: linked?.id ?? null,
                mimeType: linked?.mimeType ?? null,
                playUrl,
                downloadUrl,
                source: "r2" as const,
              };
            }),
          );

          videos.sort((a, b) =>
            (b.lastModified || "").localeCompare(a.lastModified || ""),
          );
          return Response.json({ mode: "r2", videos });
        }

        const localVideos = mediaResult.docs
          .filter(
            (doc) =>
              isVideoMimeType(doc.mimeType) || isVideoFilename(doc.filename),
          )
          .map((doc) => {
            const filename = doc.filename || `video-${doc.id}`;
            return {
              key: filename,
              filename,
              size: typeof doc.filesize === "number" ? doc.filesize : 0,
              lastModified: doc.updatedAt ?? null,
              mediaId: doc.id,
              mimeType: doc.mimeType ?? null,
              playUrl:
                typeof doc.url === "string" && doc.url
                  ? doc.url
                  : `${apiRoute}/media/file/${encodeURIComponent(filename)}`,
              downloadUrl: `${apiRoute}/media/${encodeURIComponent(String(doc.id))}/download`,
              source: "local" as const,
            };
          });

        return Response.json({ mode: "local", videos: localVideos });
      },
    },
    {
      path: "/r2-videos/upload-url",
      method: "post",
      handler: async (req) => {
        if (req.user?.role !== "admin" && req.user?.role !== "editor") {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!isR2Configured()) {
          return Response.json(
            { error: "R2 storage is not configured in this environment." },
            { status: 400 },
          );
        }

        const body = (await req.json?.()) as
          | { filename?: unknown; contentType?: unknown; size?: unknown }
          | undefined;
        const rawName = typeof body?.filename === "string" ? body.filename.trim() : "";
        const contentType =
          typeof body?.contentType === "string" && body.contentType.trim()
            ? body.contentType.trim()
            : "video/mp4";
        const size = typeof body?.size === "number" ? body.size : 0;

        if (!rawName || (!isVideoMimeType(contentType) && !isVideoFilename(rawName))) {
          return Response.json(
            { error: "Please choose a valid smartphone video file (.mp4, .mov, .m4v, .webm, .3gp, .mkv)." },
            { status: 400 },
          );
        }

        if (size <= 0 || size > MAX_VIDEO_BYTES) {
          return Response.json(
            { error: "Video files must be 220 MB or smaller." },
            { status: 400 },
          );
        }

        const safeName = sanitizeDownloadFilename(rawName);
        const prefix = getR2VideoPrefix();
        const key = prefix ? `${prefix}/${safeName}` : safeName;
        const uploadUrl = await getPresignedR2UploadUrl({
          key,
          contentType,
        });

        return Response.json({ uploadUrl, key, filename: safeName });
      },
    },
    {
      path: "/r2-videos/download",
      method: "get",
      handler: async (req) => {
        if (req.user?.role !== "admin" && req.user?.role !== "editor") {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const keyParam = req.query?.key;
        const key = typeof keyParam === "string" ? keyParam.trim() : "";
        if (!key || key.includes("..") || !isVideoFilename(key)) {
          return Response.json({ error: "Invalid video key." }, { status: 400 });
        }

        const filename = sanitizeDownloadFilename(key);

        if (isR2Configured()) {
          const signedUrl = await getPresignedR2Url({
            key,
            filename,
            disposition: "attachment",
          });
          return Response.redirect(signedUrl, 302);
        }

        const filePath = path.resolve(process.cwd(), "media", path.basename(key));
        if (!fs.existsSync(filePath)) {
          return Response.json({ error: "Video file not found." }, { status: 404 });
        }
        const stat = fs.statSync(filePath);
        const stream = Readable.toWeb(fs.createReadStream(filePath)) as ReadableStream;
        return new Response(stream, {
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Length": String(stat.size),
          },
        });
      },
    },
    {
      path: "/r2-videos",
      method: "delete",
      handler: async (req) => {
        if (req.user?.role !== "admin" && req.user?.role !== "editor") {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = (await req.json?.()) as
          | { key?: unknown; mediaId?: unknown }
          | undefined;
        const key = typeof body?.key === "string" ? body.key.trim() : "";
        const rawMediaId = body?.mediaId;
        const mediaId =
          typeof rawMediaId === "number" ||
          (typeof rawMediaId === "string" && rawMediaId.trim() !== "")
            ? rawMediaId
            : null;

        if (!key && mediaId === null) {
          return Response.json(
            { error: "A video key or mediaId is required." },
            { status: 400 },
          );
        }

        if (mediaId !== null) {
          await req.payload.delete({
            collection: "media",
            id: mediaId,
            overrideAccess: true,
          });
          return Response.json({ deleted: true, mediaId });
        }

        if (key.includes("..") || !isVideoFilename(key)) {
          return Response.json({ error: "Invalid video key." }, { status: 400 });
        }

        if (isR2Configured()) {
          await deleteR2Object(key);
        } else {
          const filePath = path.resolve(process.cwd(), "media", path.basename(key));
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }

        return Response.json({ deleted: true, key });
      },
    },
    {
      path: "/:id/download",
      method: "get",
      handler: async (req) => {
        if (req.user?.role !== "admin" && req.user?.role !== "editor") {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const rawID = req.routeParams?.id;
        const id =
          typeof rawID === "number"
            ? rawID
            : typeof rawID === "string" && rawID.trim() !== ""
              ? rawID.trim()
              : null;
        if (id === null) {
          return Response.json({ error: "Invalid media ID." }, { status: 400 });
        }

        const doc = await req.payload.findByID({
          collection: "media",
          id,
          depth: 0,
          overrideAccess: true,
        }).catch(() => null);

        if (!doc || typeof doc.filename !== "string" || !doc.filename) {
          return Response.json({ error: "Media file not found." }, { status: 404 });
        }

        const filename = sanitizeDownloadFilename(doc.filename);

        if (isR2Configured()) {
          const prefix =
            typeof (doc as { prefix?: unknown }).prefix === "string"
              ? ((doc as { prefix?: string }).prefix || "").replace(/^\/|\/$/g, "")
              : "";
          const key = prefix ? `${prefix}/${doc.filename}` : doc.filename;
          const signedUrl = await getPresignedR2Url({
            key,
            filename,
            disposition: "attachment",
          });
          return Response.redirect(signedUrl, 302);
        }

        const filePath = path.resolve(process.cwd(), "media", doc.filename);
        if (!fs.existsSync(filePath)) {
          return Response.json({ error: "Media file not found on disk." }, { status: 404 });
        }
        const stat = fs.statSync(filePath);
        const stream = Readable.toWeb(fs.createReadStream(filePath)) as ReadableStream;
        return new Response(stream, {
          headers: {
            "Content-Type":
              typeof doc.mimeType === "string" && doc.mimeType
                ? doc.mimeType
                : "application/octet-stream",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Length": String(stat.size),
          },
        });
      },
    },
  ],
  admin: {
    group: "Community & Content",
    useAsTitle: "alt",
    defaultColumns: [
      "filename",
      "liveStatus",
      "download",
      "alt",
      "tags",
      "mimeType",
      "updatedAt",
    ],
    description:
      "The central library for website images and videos (up to 220 MB). Use tags or media type filters to organize and browse files.",
    components: {
      beforeList: [
        { path: "./src/payload/components/DashboardListButton.tsx" },
        { path: "./src/payload/collections/BulkMediaUpload.tsx" },
        { path: "./src/payload/collections/R2VideosModal.tsx" },
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
  hooks: {
    beforeValidate: [
      ({ data }) => {
        const mime = typeof data?.mimeType === "string" ? data.mimeType : "";
        const fname = typeof data?.filename === "string" ? data.filename : "";
        const size = typeof data?.filesize === "number" ? data.filesize : 0;
        if ((isVideoMimeType(mime) || isVideoFilename(fname)) && size > MAX_VIDEO_BYTES) {
          throw new APIError("Video files must be 220 MB or smaller.", 400);
        }
        return data;
      },
    ],
    beforeOperation: [
      async ({ operation, req }) => {
        if ((operation !== "create" && operation !== "update") || !req.file) {
          return;
        }
        const file = req.file;
        const lowerName = (file.name || "").toLowerCase();
        if (
          (isVideoMimeType(file.mimetype) || isVideoFilename(lowerName)) &&
          file.size > MAX_VIDEO_BYTES
        ) {
          throw new APIError("Video files must be 220 MB or smaller.", 400);
        }
        const isHeic =
          file.mimetype === "image/heic" ||
          file.mimetype === "image/heif" ||
          lowerName.endsWith(".heic") ||
          lowerName.endsWith(".heif");
        if (!isHeic || !file.data) return;

        const { default: convert } = await import("heic-convert");
        const output = await convert({
          buffer: file.data,
          format: "JPEG",
          quality: 0.9,
        });
        const jpegBuffer = Buffer.isBuffer(output) ? output : Buffer.from(output);
        file.data = jpegBuffer;
        file.size = jpegBuffer.length;
        file.mimetype = "image/jpeg";
        file.name = file.name
          ? file.name.replace(/\.(heic|heif)$/i, ".jpg")
          : "image.jpg";
      },
    ],
  },
  upload: {
    adminThumbnail: ({ doc }) => {
      const mime = typeof doc.mimeType === "string" ? doc.mimeType : "";
      const filename = typeof doc.filename === "string" ? doc.filename : "";
      if (isVideoMimeType(mime) || isVideoFilename(filename)) {
        return "";
      }
      return typeof doc.url === "string" ? doc.url : "";
    },
    mimeTypes: ["image/*", ...VIDEO_MIME_TYPES],
    crop: false,
    focalPoint: false,
  },
  fields: [
    {
      name: "videoPreview",
      type: "ui",
      admin: {
        components: {
          Field: {
            path: "./src/payload/collections/MediaVideoField.tsx",
          },
        },
      },
    },
    {
      name: "download",
      type: "ui",
      label: "Download",
      admin: {
        components: {
          Cell: {
            path: "./src/payload/collections/MediaDownloadCell.tsx",
          },
        },
      },
    },
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
