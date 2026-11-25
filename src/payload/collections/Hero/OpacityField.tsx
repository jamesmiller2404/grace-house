"use client";

import { FieldDescription, FieldLabel, useField } from "@payloadcms/ui";
import type { NumberFieldClientComponent } from "payload";
import React from "react";

const OpacityField: NumberFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<number>({ path });
  const defaultVal = 55;
  const current =
    typeof value === "number" && !Number.isNaN(value)
      ? Math.max(0, Math.min(100, value))
      : defaultVal;

  return (
    <div className="field-type number gh-hero-opacity-field">
      <FieldLabel htmlFor={`field-${path}`} label={field.label} path={path} />
      <div className="gh-hero-slider-row">
        <input
          id={`field-${path}`}
          type="range"
          min={0}
          max={100}
          step={1}
          value={current}
          onChange={(e) => setValue(Number(e.target.value))}
          className="gh-hero-range"
        />
        <span className="gh-hero-slider-value">{current}%</span>
        {current !== defaultVal && (
          <button
            type="button"
            className="gh-hero-reset-btn"
            onClick={() => setValue(defaultVal)}
            title={`Reset to default (${defaultVal}%)`}
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

export default OpacityField;
