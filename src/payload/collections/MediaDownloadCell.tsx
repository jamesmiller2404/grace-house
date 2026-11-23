"use client";

import React from "react";
import type { DefaultCellComponentProps } from "payload";
import { useConfig } from "@payloadcms/ui";

const MediaDownloadCell: React.FC<DefaultCellComponentProps> = ({ rowData }) => {
  const { config } = useConfig();
  const id = rowData?.id;
  const filename = typeof rowData?.filename === "string" ? rowData.filename : "";

  if (!id || !filename) {
    return <span style={{ color: "var(--theme-elevation-450)" }}>—</span>;
  }

  const apiRoot = config.routes.api.replace(/\/$/, "");
  const href = `${apiRoot}/media/${encodeURIComponent(String(id))}/download`;

  return (
    <a
      href={href}
      download={filename}
      onClick={(event) => event.stopPropagation()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 10px",
        borderRadius: "6px",
        border: "1px solid var(--gh-accent-border, rgba(201, 164, 92, 0.45))",
        background: "var(--gh-aubergine-soft, #261e32)",
        color: "var(--theme-elevation-900, #f5f1ea)",
        fontSize: "0.8rem",
        fontWeight: 600,
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      Download
    </a>
  );
};

export default MediaDownloadCell;
