"use client";

import React, { useRef } from "react";
import { FieldError, useField } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";

const toNativeDate = (value: unknown): string => {
  if (typeof value !== "string") return "";
  const fullDate = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(\d{4})$/.exec(value);
  if (fullDate) {
    const month = Number(fullDate[1]);
    const day = Number(fullDate[2]);
    const year = Number(fullDate[3]);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return "";
    return `${year.toString().padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const monthYear = /^(0?[1-9]|1[0-2])\/(\d{4})$/.exec(value);
  if (monthYear) {
    return `${monthYear[2]}-${String(Number(monthYear[1])).padStart(2, "0")}-01`;
  }
  return "";
};

const GraduationDateField: React.FC<TextFieldClientProps> = ({
  path: pathFromProps,
  readOnly,
  field,
}) => {
  const { disabled, path, setValue, showError, value } = useField<string>({
    potentiallyStalePath: pathFromProps,
  });
  const calendarRef = useRef<HTMLInputElement>(null);
  const isDisabled = Boolean(readOnly || disabled);
  const textValue = typeof value === "string" ? value : "";

  const openCalendar = () => {
    const input = calendarRef.current;
    if (!input || isDisabled) return;
    if (typeof input.showPicker === "function") input.showPicker();
    else input.click();
  };

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
      <button
        className="gh-graduation-date__button"
        type="button"
        aria-label="Choose graduation date from calendar"
        title="Choose date"
        disabled={isDisabled}
        onClick={openCalendar}
      >
        <span aria-hidden="true">▦</span>
      </button>
      <input
        ref={calendarRef}
        className="gh-graduation-date__native"
        aria-label="Choose graduation date"
        type="date"
        value={toNativeDate(value)}
        disabled={isDisabled}
        tabIndex={-1}
        onChange={(event) => {
          const selected = event.currentTarget.value;
          if (!selected) return;
          const [year, month, day] = selected.split("-");
          setValue(`${month}/${day}/${year}`);
        }}
      />
      <FieldError path={path} showError={showError} />
    </div>
  );
};

export default GraduationDateField;
