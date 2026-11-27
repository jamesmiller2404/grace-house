"use client";

import { FieldLabel, useField } from "@payloadcms/ui";
import type { SelectFieldClientComponent } from "payload";
import React from "react";

type ColCount = "1" | "2" | "3";

const OPTIONS: {
  value: ColCount;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "1",
    title: "1 Column",
    subtitle: "Standard single-column reading layout",
    icon: (
      <svg width="34" height="24" viewBox="0 0 34 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="30" height="20" rx="3" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.18" />
      </svg>
    ),
  },
  {
    value: "2",
    title: "2 Columns",
    subtitle: "Side-by-side layout for text & photos",
    icon: (
      <svg width="34" height="24" viewBox="0 0 34 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="13.5" height="20" rx="3" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.18" />
        <rect x="18.5" y="2" width="13.5" height="20" rx="3" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.18" />
      </svg>
    ),
  },
  {
    value: "3",
    title: "3 Columns",
    subtitle: "Gallery-style grid for many photos",
    icon: (
      <svg width="34" height="24" viewBox="0 0 34 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="8.5" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.18" />
        <rect x="12.75" y="2" width="8.5" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.18" />
        <rect x="23.5" y="2" width="8.5" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.18" />
      </svg>
    ),
  },
];

const ColumnsField: SelectFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<ColCount>({ path });
  const current: ColCount = value === "2" || value === "3" ? value : "1";

  return (
    <div className="field-type select gh-cp-columns-field" style={{ marginBottom: "18px" }}>
      <FieldLabel label={field.label || "Page Layout Columns"} path={path} />
      <div
        role="radiogroup"
        aria-label="Page layout columns"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
          gap: "10px",
          marginTop: "6px",
        }}
      >
        {OPTIONS.map((opt) => {
          const active = current === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setValue(opt.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "10px",
                textAlign: "left",
                border: active
                  ? "1.5px solid var(--gh-accent, #c9a45c)"
                  : "1px solid var(--gh-border-subtle, #312a3d)",
                background: active
                  ? "rgba(201, 164, 92, 0.14)"
                  : "var(--theme-elevation-0, #100d14)",
                color: "var(--gh-text-primary, #f6f3eb)",
                cursor: "pointer",
                transition: "all 140ms ease",
              }}
            >
              <span
                style={{
                  color: active
                    ? "var(--gh-accent, #c9a45c)"
                    : "var(--gh-text-muted, #b8afc4)",
                  flexShrink: 0,
                  display: "inline-flex",
                }}
              >
                {opt.icon}
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <strong style={{ fontSize: "0.9rem", fontWeight: 700, lineHeight: 1.2 }}>
                  {opt.title}
                </strong>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--gh-text-muted, #b8afc4)",
                    lineHeight: 1.25,
                  }}
                >
                  {opt.subtitle}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="field-description" style={{ marginTop: "6px" }}>
        Headings span the full width; photos, videos, and paragraphs flow across the selected columns on desktop.
      </div>
    </div>
  );
};

export default ColumnsField;
