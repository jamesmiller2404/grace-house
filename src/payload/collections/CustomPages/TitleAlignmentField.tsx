"use client";

import { useField } from "@payloadcms/ui";
import type { SelectFieldClientComponent } from "payload";
import React from "react";

type Alignment = "left" | "center" | "right";

const OPTIONS: { value: Alignment; label: string; icon: React.ReactNode }[] = [
  {
    value: "left",
    label: "Align Left",
    icon: (
      <svg width="13" height="13" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="14" height="2" rx="1" fill="currentColor" />
        <rect x="2" y="8" width="9" height="2" rx="1" fill="currentColor" />
        <rect x="2" y="13" width="12" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: "center",
    label: "Align Center",
    icon: (
      <svg width="13" height="13" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="14" height="2" rx="1" fill="currentColor" />
        <rect x="4.5" y="8" width="9" height="2" rx="1" fill="currentColor" />
        <rect x="3" y="13" width="12" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: "right",
    label: "Align Right",
    icon: (
      <svg width="13" height="13" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="14" height="2" rx="1" fill="currentColor" />
        <rect x="7" y="8" width="9" height="2" rx="1" fill="currentColor" />
        <rect x="4" y="13" width="12" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
];

const TitleAlignmentField: SelectFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField<Alignment>({ path });
  const current: Alignment =
    value === "center" || value === "right" ? value : "left";

  return (
    <div
      className="field-type select gh-cp-align-field"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <div
        role="group"
        aria-label="Page heading alignment"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "3px",
          padding: "3px",
          borderRadius: "7px",
          border: "1px solid var(--gh-border-subtle, #312a3d)",
          background: "var(--theme-elevation-0, #100d14)",
          width: "fit-content",
          height: "34px",
        }}
      >
        {OPTIONS.map((opt) => {
          const active = current === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              title={opt.label}
              aria-label={opt.label}
              aria-pressed={active}
              onClick={() => setValue(opt.value)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "26px",
                height: "26px",
                borderRadius: "5px",
                border: active
                  ? "1px solid var(--gh-accent, #c9a45c)"
                  : "1px solid transparent",
                background: active
                  ? "var(--gh-accent, #c9a45c)"
                  : "transparent",
                color: active
                  ? "var(--gh-accent-ink, #141118)"
                  : "var(--gh-text-primary, #f6f3eb)",
                cursor: "pointer",
                transition: "all 140ms ease",
              }}
            >
              {opt.icon}
            </button>
          );
        })}
      </div>
      <div
        className="field-description"
        style={{ marginTop: "6px", fontSize: "0.78rem" }}
      >
        Heading alignment
      </div>
    </div>
  );
};

export default TitleAlignmentField;
