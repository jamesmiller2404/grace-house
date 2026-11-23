"use client";

import React from "react";
import { useConfig, useDocumentInfo, useFormFields } from "@payloadcms/ui";
import { isVideoFilename, isVideoMimeType } from "@/payload/lib/r2Media";

function formatBytes(bytes: unknown): string {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes <= 0) {
    return "";
  }
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export default function MediaVideoField() {
  const { config } = useConfig();
  const { id } = useDocumentInfo();

  const filename = useFormFields(([fields]) => fields.filename?.value as string | undefined);
  const mimeType = useFormFields(([fields]) => fields.mimeType?.value as string | undefined);
  const filesize = useFormFields(([fields]) => fields.filesize?.value as number | undefined);
  const url = useFormFields(([fields]) => fields.url?.value as string | undefined);

  const isVideo = isVideoMimeType(mimeType) || isVideoFilename(filename);
  if (!id || !isVideo) return null;

  const apiRoot = config.routes.api.replace(/\/$/, "");
  const downloadHref = `${apiRoot}/media/${encodeURIComponent(String(id))}/download`;
  const streamSrc =
    url ||
    (filename
      ? `${apiRoot}/media/file/${encodeURIComponent(filename)}`
      : "");
  const sizeLabel = formatBytes(filesize);

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "16px",
        borderRadius: "10px",
        border: "1px solid var(--gh-border-subtle, #312a3d)",
        background: "var(--gh-surface-input, #100d14)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div>
          <strong style={{ display: "block", fontSize: "0.95rem" }}>
            {filename || "Uploaded Video"}
          </strong>
          <span style={{ fontSize: "0.82rem", color: "var(--theme-elevation-500)" }}>
            {[mimeType, sizeLabel].filter(Boolean).join(" • ")}
          </span>
        </div>
        <a
          href={downloadHref}
          download={filename || "video"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "38px",
            padding: "8px 16px",
            borderRadius: "7px",
            border: "1px solid var(--gh-accent, #c9a45c)",
            background: "var(--gh-accent, #c9a45c)",
            color: "var(--gh-accent-ink, #141118)",
            fontWeight: 700,
            fontSize: "0.88rem",
            textDecoration: "none",
          }}
        >
          Download Video
        </a>
      </div>
      {streamSrc && (
        <video
          controls
          playsInline
          preload="metadata"
          src={streamSrc}
          style={{
            width: "100%",
            maxHeight: "420px",
            borderRadius: "8px",
            background: "#000",
            display: "block",
          }}
        />
      )}
    </div>
  );
}
