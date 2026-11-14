"use client";

import React from "react";
import { useFormFields } from "@payloadcms/ui";

type MediaValue = {
  url?: unknown;
  filename?: unknown;
  alt?: unknown;
  mimeType?: unknown;
  sizes?: Record<string, { url?: unknown } | undefined>;
};

function asRecord(value: unknown): MediaValue | null {
  return value && typeof value === "object" ? value as MediaValue : null;
}

export default function MemorialPhotoPreview() {
  const photo = useFormFields(([fields]) => fields.memorialPhoto?.value);
  const media = asRecord(photo);
  const mimeType = typeof media?.mimeType === "string" ? media.mimeType : "";
  const url = typeof media?.url === "string"
    ? media.url
    : typeof media?.sizes?.thumbnail?.url === "string"
      ? media.sizes.thumbnail.url
      : "";
  const filename = typeof media?.filename === "string" ? media.filename : "";
  const alt = typeof media?.alt === "string" ? media.alt : "Selected memorial photo";

  return (
    <div style={{ margin: "0 0 24px", padding: "16px", border: "1px solid var(--theme-elevation-300)", borderRadius: "8px" }}>
      <div style={{ fontWeight: 600, marginBottom: "10px" }}>Currently selected memorial photo</div>
      {url && mimeType.startsWith("image/") ? (
        <img
          src={url}
          alt={alt}
          style={{ display: "block", width: "100%", maxWidth: "420px", maxHeight: "280px", objectFit: "contain", objectPosition: "left center", borderRadius: "4px" }}
        />
      ) : (
        <div style={{ color: "var(--theme-elevation-600)", padding: "12px 0" }}>
          {photo ? "The selected media item does not appear to be an image." : "No memorial photo selected. The website will use its default memorial image."}
        </div>
      )}
      {filename && <div style={{ marginTop: "8px", fontSize: "0.875rem", color: "var(--theme-elevation-600)" }}>{filename}</div>}
    </div>
  );
}
