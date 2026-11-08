"use client";

import React from "react";
import { FieldError, useField } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";

const toNativeDate = (value: unknown): string => {
  if (typeof value !== "string") return "";
  const match = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(\d{4})$/.exec(value);
  if (!match) return "";
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return "";
  return `${year.toString().padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const GraduationDateField: React.FC<TextFieldClientProps> = ({
  path: pathFromProps,
  readOnly,
  field,
}) => {
  const { disabled, path, setValue, showError, value } = useField<string>({
    potentiallyStalePath: pathFromProps,
  });
  const isDisabled = Boolean(readOnly || disabled);
  const textValue = typeof value === "string" ? value : "";

  return (
    <div className="gh-graduation-date" id={`field-${path}`}>
      <input
        className="gh-graduation-date__text"
        type="text"
        value={textValue}
        placeholder={String(field.admin?.placeholder ?? "Graduation date...")}
        disabled={isDisabled}
        readOnly={readOnly}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <div className="gh-graduation-date__calendar">
        <input
          aria-label="Choose graduation date from calendar"
          type="date"
          value={toNativeDate(value)}
          disabled={isDisabled}
          onChange={(event) => {
            const selected = event.currentTarget.value;
            if (!selected) return;
            const [year, month, day] = selected.split("-");
            setValue(`${month}/${day}/${year}`);
          }}
        />
      </div>
      <FieldError path={path} showError={showError} />
    </div>
  );
};

export default GraduationDateField;
