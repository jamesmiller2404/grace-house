"use client";

import {
  useDocumentInfo,
  useFormFields,
  useFormModified,
} from "@payloadcms/ui";
import React, { useEffect } from "react";

/**
 * Subtle status indicator in the Stories edit document controls bar:
 *  - "Unsaved" when creating a brand-new story that hasn't been saved yet
 *  - "Draft" (or "Draft · Unsaved") when saved as a draft
 *  - "Published" (or "Published · Unsaved") when published
 *
 * Also disables Payload's "Save Draft" button (#action-save-draft) when the
 * story is already Published, so editors don't accidentally click Save Draft
 * on a live published story.
 */
const StatusBadge: React.FC = () => {
  const { id, initialData } = useDocumentInfo();
  const modified = useFormModified();
  const formStatus = useFormFields(([fields]) => fields._status?.value as string | undefined);

  const rawStatus =
    formStatus ??
    (typeof initialData?._status === "string" ? initialData._status : undefined);

  const isNew = !id;
  const isPublished = !isNew && rawStatus === "published";

  useEffect(() => {
    const btn = document.getElementById("action-save-draft") as HTMLButtonElement | null;
    if (!btn) return;
    if (isPublished) {
      btn.disabled = true;
      btn.setAttribute("aria-disabled", "true");
      btn.title = "Unpublish this story first to save as a draft";
    } else {
      btn.disabled = false;
      btn.removeAttribute("aria-disabled");
      btn.removeAttribute("title");
    }
  }, [isPublished]);

  let label = "Unsaved";
  let dotColor = "#9ca3af"; // subtle neutral gray
  let borderColor = "rgba(156, 163, 175, 0.35)";
  let textColor = "var(--gh-st-help, #b8afc4)";

  if (isPublished) {
    label = modified ? "Published · Unsaved" : "Published";
    dotColor = "#4ade80"; // subtle green
    borderColor = "rgba(74, 222, 128, 0.35)";
    textColor = "#bbf7d0";
  } else if (!isNew) {
    label = modified ? "Draft · Unsaved" : "Draft";
    dotColor = "#e3a857"; // subtle gold/amber
    borderColor = "rgba(227, 168, 87, 0.4)";
    textColor = "#fde68a";
  }

  return (
    <>
      {isPublished && (
        <style>{`
          .gh-stories-edit #action-save-draft {
            opacity: 0.35 !important;
            pointer-events: none !important;
            cursor: not-allowed !important;
          }
        `}</style>
      )}
      <span
        role="status"
        aria-live="polite"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          borderRadius: "9999px",
          border: `1px solid ${borderColor}`,
          fontSize: "0.78rem",
          fontWeight: 600,
          letterSpacing: "0.02em",
          color: textColor,
          background: "rgba(0, 0, 0, 0.18)",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: dotColor,
            flexShrink: 0,
          }}
        />
        {label}
      </span>
    </>
  );
};

export default StatusBadge;
