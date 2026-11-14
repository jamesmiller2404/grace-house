"use client";

import React, { useEffect, useState } from "react";
import { useFormFields } from "@payloadcms/ui";

type MediaValue = {
  id?: unknown;
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
  const selectedValue = useFormFields(([fields]) => fields.memorialPhoto?.value);
  const selectedMedia = asRecord(selectedValue);
  const selectedId = typeof selectedValue === "string" || typeof selectedValue === "number"
    ? String(selectedValue)
    : selectedMedia?.id != null ? String(selectedMedia.id) : "";
  const [fetchedMedia, setFetchedMedia] = useState<MediaValue | null>(null);

  useEffect(() => {
    if (!selectedId || selectedMedia?.url) {
      setFetchedMedia(null);
      return;
    }
    const controller = new AbortController();
    void fetch(`/api/media/${encodeURIComponent(selectedId)}?depth=0`, {
      credentials: "same-origin",
      signal: controller.signal,
    }).then((response) => response.ok ? response.json() : null)
      .then((payload: unknown) => {
        if (payload && typeof payload === "object") setFetchedMedia(payload as MediaValue);
        else setFetchedMedia(null);
      }).catch(() => setFetchedMedia(null));
    return () => controller.abort();
  }, [selectedId, selectedMedia?.url]);

  const media = selectedMedia?.url ? selectedMedia : fetchedMedia ?? selectedMedia;
  const mimeType = typeof media?.mimeType === "string" ? media.mimeType : "";
  const url = typeof media?.url === "string"
    ? media.url
    : typeof media?.sizes?.thumbnail?.url === "string"
      ? media.sizes.thumbnail.url
      : "";
  const filename = typeof media?.filename === "string" ? media.filename : "";
  const alt = typeof media?.alt === "string" ? media.alt : "Selected memorial photo";
  const hasSelection = selectedValue !== null && selectedValue !== undefined && selectedValue !== "";

  return (
    <div style={{ margin: "0 0 24px", padding: "16px", border: "1px solid var(--theme-elevation-300)", borderRadius: "8px" }}>
      <div style={{ fontWeight: 600, marginBottom: "10px" }}>Currently selected memorial photo</div>
      {url && (!mimeType || mimeType.startsWith("image/")) ? (
        <img
          src={url}
          alt={alt}
          style={{ display: "block", width: "100%", maxWidth: "420px", maxHeight: "280px", objectFit: "contain", objectPosition: "left center", borderRadius: "4px" }}
        />
      ) : (
        <div style={{ color: "var(--theme-elevation-600)", padding: "12px 0" }}>
          {hasSelection
            ? "Loading the selected photo, or its preview is unavailable."
            : "No memorial photo selected. The website will use its default memorial image."}
        </div>
      )}
      {filename && <div style={{ marginTop: "8px", fontSize: "0.875rem", color: "var(--theme-elevation-600)" }}>{filename}</div>}
    </div>
  );
}
