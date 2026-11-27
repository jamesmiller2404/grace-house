"use client";

import { FieldLabel, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";
import React, { useEffect, useState } from "react";

type DividerOption = {
  path: string;
  name: string;
};

type Align = "left" | "center" | "right";

const ALIGN_OPTIONS: { value: Align; label: string; icon: React.ReactNode }[] = [
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

const DividerImageField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path });

  const parentPath = path.includes(".")
    ? path.slice(0, path.lastIndexOf(".") + 1)
    : "";
  const alignField = useField<Align>({ path: `${parentPath}dividerAlign` });
  const currentAlign: Align =
    alignField.value === "left" || alignField.value === "right"
      ? alignField.value
      : "center";

  const [options, setOptions] = useState<DividerOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/divider-images", {
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { images?: DividerOption[] } | null) => {
        if (Array.isArray(data?.images)) {
          setOptions(data.images);
        }
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <div className="field-type text gh-divider-image-field" style={{ marginTop: "8px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <FieldLabel label={field.label || "Divider / Ending Image"} path={path} />
        <div
          role="group"
          aria-label="Divider alignment"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            padding: "3px",
            borderRadius: "7px",
            border: "1px solid var(--gh-border-subtle, #312a3d)",
            background: "var(--theme-elevation-0, #100d14)",
          }}
        >
          {ALIGN_OPTIONS.map((opt) => {
            const active = currentAlign === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                title={opt.label}
                aria-label={opt.label}
                aria-pressed={active}
                onClick={() => alignField.setValue(opt.value)}
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
                }}
              >
                {opt.icon}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="field-description">Loading divider images...</div>
      ) : options.length === 0 ? (
        <div className="field-description">
          No images found in <code>public/images/dividers/</code>.
        </div>
      ) : (
        <div
          role="radiogroup"
          aria-label="Choose a divider image"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "10px",
          }}
        >
          {options.map((opt) => {
            const active = value === opt.path;
            return (
              <button
                key={opt.path}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setValue(opt.path)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px",
                  borderRadius: "8px",
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
                <div
                  style={{
                    width: "100%",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f7f3eb",
                    borderRadius: "5px",
                    padding: "4px 8px",
                    overflow: "hidden",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={opt.path}
                    alt={opt.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "36px",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: active ? 700 : 500 }}>
                  {opt.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DividerImageField;
