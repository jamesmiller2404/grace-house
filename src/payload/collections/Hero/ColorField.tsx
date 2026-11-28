"use client";

import { FieldDescription, FieldLabel, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";
import React from "react";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function normalizeHex(value: unknown, fallback: string): string {
  if (typeof value === "string" && HEX_RE.test(value.trim())) {
    return value.trim();
  }
  return fallback;
}

const DEFAULT_COLORS: Record<string, string> = {
  cardColor: "#0f172a",
  headingColor: "#ffffff",
  eyebrowColor: "#c9a45c",
  subtextColor: "#f7f3eb",
  "textShadow.color": "#000000",
  "primaryCta.bgColor": "#9e5640",
  "primaryCta.textColor": "#ffffff",
  "secondaryCta.bgColor": "#ffffff",
  "secondaryCta.textColor": "#242725",
  "topBar.backgroundColor": "#624e92",
  "topBar.textColor": "#110d17",
};

const ColorField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path });
  const defaultHex = DEFAULT_COLORS[path] ?? "#0f172a";
  const current = typeof value === "string" ? value : defaultHex;
  const pickerColor = normalizeHex(current, defaultHex);

  return (
    <div className="field-type text gh-hero-color-field">
      <FieldLabel htmlFor={`field-${path}`} label={field.label} path={path} />
      <div className="gh-hero-color-row">
        <input
          type="color"
          aria-label={typeof field.label === "string" ? `${field.label} picker` : "Color picker"}
          value={pickerColor}
          onChange={(e) => setValue(e.target.value)}
          className="gh-hero-color-swatch"
        />
        <input
          id={`field-${path}`}
          type="text"
          value={current}
          placeholder={defaultHex}
          onChange={(e) => setValue(e.target.value)}
          className="gh-hero-color-hex"
        />
        {current.toLowerCase() !== defaultHex.toLowerCase() && (
          <button
            type="button"
            className="gh-hero-reset-btn"
            onClick={() => setValue(defaultHex)}
            title={`Reset to default (${defaultHex})`}
          >
            Reset
          </button>
        )}
      </div>
      {field.admin?.description && (
        <FieldDescription description={field.admin.description} path={path} />
      )}
    </div>
  );
};

export default ColorField;
