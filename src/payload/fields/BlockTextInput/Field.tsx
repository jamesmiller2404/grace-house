"use client";

import React from "react";
import { FieldError, useField } from "@payloadcms/ui";
import type { TextareaFieldClientProps } from "payload";

const BlockTextInput: React.FC<TextareaFieldClientProps> = ({
  path: pathFromProps,
  readOnly,
  field,
}) => {
  const { disabled, path, setValue, showError, value } = useField<string>({
    potentiallyStalePath: pathFromProps,
  });

  // The block type is stored beside the text field in the same array row.
  const typePath = pathFromProps.replace(/\.text$/, ".type");
  const { value: blockType } = useField<string>({
    potentiallyStalePath: typePath,
  });

  const isDisabled = Boolean(readOnly || disabled);
  const placeholder =
    blockType === "Heading"
      ? "The Heading Text"
      : blockType === "Paragraph"
        ? "The Paragraph Text"
        : String(field.admin?.placeholder ?? "Text...");

  return (
    <div className="gh-block-text-input" id={`field-${path.replace(/\./g, "__")}`}>
      <div className="gh-block-text-input__control">
        <textarea
          className="gh-block-text-input__textarea"
          value={typeof value === "string" ? value : ""}
          placeholder={placeholder}
          disabled={isDisabled}
          readOnly={readOnly}
          rows={2}
          style={{ width: "95%" }}
          onChange={(event) => {
            const nextValue = event.currentTarget.value;
            setValue(nextValue);
          }}
        />
        <button
          className="gh-block-text-input__clear"
          type="button"
          aria-label="Clear text"
          title="Clear text"
          disabled={isDisabled || !value}
          onClick={() => {
            setValue("");
          }}
        >
          ×
        </button>
      </div>
      {blockType === "Paragraph" && (
        <p className="gh-block-text-input__hint">
          Press Enter for a line break. Leave a blank line to start a new paragraph.
        </p>
      )}
      <FieldError path={path} showError={showError} />
    </div>
  );
};

export default BlockTextInput;
