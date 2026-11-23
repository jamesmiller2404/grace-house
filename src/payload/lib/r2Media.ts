import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/** 220 MB maximum size for uploaded video files. */
export const MAX_VIDEO_BYTES = 220 * 1024 * 1024;

export function getR2VideoPrefix(): string {
  return (process.env.R2_VIDEO_PREFIX || "Videos").replace(/^\/+|\/+$/g, "");
}

export const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/3gpp",
  "video/x-m4v",
  "video/x-matroska",
] as const;

export const VIDEO_EXTENSIONS = [
  ".mp4",
  ".mov",
  ".m4v",
  ".webm",
  ".3gp",
  ".mkv",
] as const;

export function isVideoMimeType(mime?: string | null): boolean {
  return typeof mime === "string" && mime.toLowerCase().startsWith("video/");
}

export function isVideoFilename(name?: string | null): boolean {
  if (typeof name !== "string") return false;
  const lower = name.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function sanitizeDownloadFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() || "video.mp4";
  return base.replace(/["\r\n]/g, "_");
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_BUCKET &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_ENDPOINT,
  );
}

export function createR2Client(): S3Client {
  if (!isR2Configured()) {
    throw new Error("Cloudflare R2 environment variables are not configured.");
  }

  return new S3Client({
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
}

export async function getPresignedR2Url(args: {
  key: string;
  filename?: string;
  disposition: "inline" | "attachment";
  expiresInSeconds?: number;
}): Promise<string> {
  const client = createR2Client();
  const safeName = sanitizeDownloadFilename(args.filename || args.key);
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: args.key,
    ResponseContentDisposition:
      args.disposition === "attachment"
        ? `attachment; filename="${safeName}"`
        : `inline; filename="${safeName}"`,
  });

  return getSignedUrl(client, command, {
    expiresIn: args.expiresInSeconds ?? 300,
  });
}

export async function getPresignedR2UploadUrl(args: {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<string> {
  const client = createR2Client();
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: args.key,
    ContentType: args.contentType,
  });

  return getSignedUrl(client, command, {
    expiresIn: args.expiresInSeconds ?? 900,
  });
}

export type R2ObjectSummary = {
  key: string;
  size: number;
  lastModified: string | null;
};

export async function listR2VideoObjects(): Promise<R2ObjectSummary[]> {
  const client = createR2Client();
  const bucket = process.env.R2_BUCKET!;
  const videoPrefix = getR2VideoPrefix();
  const prefixes = videoPrefix ? [`${videoPrefix}/`, ""] : [""];
  const seen = new Map<string, R2ObjectSummary>();

  for (const prefix of prefixes) {
    let continuationToken: string | undefined;
    do {
      const response = await client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: prefix || undefined,
          ContinuationToken: continuationToken,
          MaxKeys: 1000,
        }),
      );

      for (const item of response.Contents ?? []) {
        if (!item.Key || !isVideoFilename(item.Key)) continue;
        if (!seen.has(item.Key)) {
          seen.set(item.Key, {
            key: item.Key,
            size: item.Size ?? 0,
            lastModified: item.LastModified ? item.LastModified.toISOString() : null,
          });
        }
      }

      continuationToken = response.IsTruncated
        ? response.NextContinuationToken
        : undefined;
    } while (continuationToken);
  }

  return Array.from(seen.values());
}

export async function deleteR2Object(key: string): Promise<void> {
  const client = createR2Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
    }),
  );
}
