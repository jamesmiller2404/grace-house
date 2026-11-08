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
