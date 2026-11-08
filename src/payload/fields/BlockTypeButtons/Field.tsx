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

  const choices: Choice[] = (field.options as Array<string | { label: string; value: string }>).map((option) =>
    typeof option === "string"
      ? { label: option === "Heading" ? "Heading" : option, value: option }
      : { label: option.value === "Heading" ? "Heading" : option.label, value: option.value },
  );
  const isDisabled = Boolean(readOnly || disabled);

  return (
    <div className="gh-block-type-field" id={`field-${path.replace(/\./g, "__")}`}>
      <span className="gh-block-type-field__label">Type</span>
      <div className="gh-block-type-field__choices" role="group" aria-label="Content block type">
        {choices.map((choice) => {
          const selected = value === choice.value;
          return (
            <button
              key={choice.value}
              className={`gh-block-type-field__button${selected ? " is-selected" : ""}`}
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
                margin: "10px 1px 10px 4px",
                border: `1px solid ${selected ? "var(--theme-elevation-800)" : "var(--theme-elevation-400)"}`,
                borderRadius: "18px",
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
