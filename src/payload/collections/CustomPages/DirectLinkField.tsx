"use client";

import React, { useState } from "react";
import { useConfig, useDocumentInfo, useFormFields } from "@payloadcms/ui";
import { customPageSlug } from "@/content/customPages";

export default function DirectLinkField() {
  const { id } = useDocumentInfo();
  const { config } = useConfig();
  const savedTitle = useFormFields(
    ([fields]) => (fields.title?.initialValue as string | undefined) ?? "",
  );
  const [copied, setCopied] = useState(false);

  const slug = id && savedTitle.trim() ? customPageSlug(savedTitle) : "";
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : (config.serverURL || "").replace(/\/$/, "");
  const directUrl = slug ? `${origin}/pages/${slug}` : "";

  const handleCopy = async () => {
    if (!directUrl) return;
    try {
      await navigator.clipboard.writeText(directUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for restricted clipboard contexts.
    }
  };

  return (
    <div className="field-type text" style={{ marginBottom: "20px" }}>
      <label className="field-label" htmlFor="gh-custom-page-direct-link">
        Direct Link
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "6px",
        }}
      >
        <div className="field-type__wrap" style={{ flex: "1 1 auto", minWidth: 0 }}>
          <input
            id="gh-custom-page-direct-link"
            type="text"
            readOnly
            value={directUrl}
            placeholder="Direct link..."
            onFocus={(event) => {
              if (directUrl) event.currentTarget.select();
            }}
          />
        </div>
        <button
          type="button"
          disabled={!directUrl}
          onClick={() => void handleCopy()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "40px",
            padding: "0 16px",
            borderRadius: "6px",
            border: "1px solid var(--gh-accent-border, rgba(201, 164, 92, 0.45))",
            background: copied
              ? "var(--gh-accent, #c9a45c)"
              : "var(--gh-aubergine-soft, #261e32)",
            color: copied
              ? "var(--gh-accent-ink, #141118)"
              : "var(--theme-elevation-900, #f5f1ea)",
            font: "inherit",
            fontSize: "0.88rem",
            fontWeight: 600,
            cursor: directUrl ? "pointer" : "not-allowed",
            opacity: directUrl ? 1 : 0.5,
            whiteSpace: "nowrap",
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="field-description" style={{ marginTop: "6px" }}>
        Use this direct link to link to this page from another page without showing it in the header &quot;More&quot; menu. Available after naming and saving the page.
      </div>
    </div>
  );
}
