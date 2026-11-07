"use client";

import { FieldError, useField } from "@payloadcms/ui";
import type { SelectFieldClientProps } from "payload";
import React from "react";

type Choice = { label: string; value: string };

const BlockTypeButtons: React.FC<SelectFieldClientProps> = ({
  path: pathFromProps,
  readOnly,
  onChange,
  field,
}) => {
  const { disabled, path, setValue, showError, value } = useField<string>({
    potentiallyStalePath: pathFromProps,
  });

  // Read the configured select options so this component supports both the
  // two-button text selector and the three-button Header/Paragraph/Photo one.
  const choices: Choice[] = (field.options as Array<string | { label: string; value: string }>).map((option) =>
    typeof option === "string"
      ? { label: option === "Heading" ? "Header" : option, value: option }
      : { label: option.value === "Heading" ? "Header" : option.label, value: option.value },
  );
  const isDisabled = Boolean(readOnly || disabled);

  return (
    <div
      className="field-type"
      id={`field-${path.replace(/\./g, "__")}`}
      style={{ flex: "1 1 auto" }}
    >
      <div
        role="group"
        aria-label="Content block type"
        style={{ display: "grid", gridTemplateColumns: `repeat(${choices.length}, minmax(0, 1fr))`, gap: 8 }}
      >
        {choices.map((choice) => {
          const selected = value === choice.value;
          return (
            <button
              key={choice.value}
              type="button"
              aria-pressed={selected}
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) {
                  setValue(choice.value);
                  onChange?.(choice.value);
                }
              }}
              style={{
                minHeight: 44,
                padding: "10px 16px",
                border: `1px solid ${selected ? "var(--theme-elevation-800)" : "var(--theme-elevation-400)"}`,
                borderRadius: 14,
                background: selected ? "var(--theme-elevation-1000)" : "var(--theme-elevation-450)",
                color: selected ? "var(--theme-elevation-0)" : "var(--theme-elevation-800)",
                font: "inherit",
                fontWeight: selected ? 700 : 500,
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.6 : 1,
              }}
            >
              {choice.label}
            </button>
          );
        })}
      </div>
      <FieldError path={path} showError={showError} />
    </div>
  );
};

export default BlockTypeButtons;
