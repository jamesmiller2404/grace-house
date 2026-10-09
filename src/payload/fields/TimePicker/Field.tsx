"use client";

import { useField } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import React, { useEffect, useRef, useState } from "react";

/**
 * Admin component for `TimeField` (src/payload/fields/TimePicker/index.ts).
 *
 * Renders a plain text input — so manual entry works exactly like before —
 * plus a "Pick a time" button that opens a popup listing every half-hour of
 * the day (12:00 AM through 11:30 PM, 48 options) like the date picker's
 * popup. Clicking an option fills the input; Escape or an outside click
 * closes it.
 */

/** All 30-minute increments of the day as 12-hour clock labels. */
function buildTimeOptions(): string[] {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const period = hour < 12 ? "AM" : "PM";
    for (const minute of [0, 30]) {
      const paddedMinute = String(minute).padStart(2, "0");
      options.push(`${hour12}:${paddedMinute} ${period}`);
    }
  }
  return options;
}

const timeOptions = buildTimeOptions();

const styles: Record<string, React.CSSProperties> = {
  input: {
    background: "var(--theme-input-bg, var(--theme-elevation-0))",
    border: "1px solid var(--theme-elevation-150)",
    borderRadius: "var(--style-radius-m, 4px)",
    color: "var(--theme-text)",
    fontSize: "var(--base, 16px)",
    lineHeight: "var(--lh-base, 24px)",
    padding: "6px 10px",
    width: "100%",
  },
  inputRow: { alignItems: "center", display: "flex", gap: 8 },
  option: {
    background: "none",
    border: "1px solid transparent",
    borderRadius: 4,
    color: "var(--theme-text)",
    cursor: "pointer",
    fontSize: "var(--base, 16px)",
    lineHeight: "var(--lh-base, 24px)",
    padding: "4px 8px",
    textAlign: "left",
    width: "100%",
  },
  optionCurrent: {
    background: "var(--theme-elevation-100)",
    border: "1px solid var(--theme-elevation-200)",
    fontWeight: "bold",
  },
  popup: {
    background: "var(--theme-bg, var(--theme-elevation-0))",
    border: "1px solid var(--theme-elevation-150)",
    borderRadius: "var(--style-radius-m, 4px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    left: 0,
    maxHeight: 260,
    overflowY: "auto",
    padding: 8,
    position: "absolute",
    right: 0,
    top: "calc(100% + 4px)",
    width: "100%",
    zIndex: 50,
  },
  pickButton: {
    background: "var(--theme-elevation-100)",
    border: "1px solid var(--theme-elevation-150)",
    borderRadius: "var(--style-radius-m, 4px)",
    color: "var(--theme-text)",
    cursor: "pointer",
    flexShrink: 0,
    fontSize: "var(--base, 16px)",
    lineHeight: "var(--lh-base, 24px)",
    padding: "6px 12px",
    whiteSpace: "nowrap",
  },
  wrapper: { position: "relative" },
};

const TimePickerField: React.FC<TextFieldClientProps> = (props) => {
  const { field, path } = props;
  const { admin, label, required } = field;
  const description = admin?.description;

  const [popupOpen, setPopupOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { setValue, showError, value = "" } = useField<string>({ path });

  // Close the popup on Escape or when clicking outside of it.
  useEffect(() => {
    if (!popupOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPopupOpen(false);
    };
    const onMouseDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [popupOpen]);

  // Highlight the option currently stored in the field (case-insensitive).
  const currentValue =
    typeof value === "string" ? value.trim().toLowerCase() : "";

  // Payload labels/descriptions can be a string or an i18n Record —
  // fall back to the first translation when given a Record.
  const labelText =
    typeof label === "string"
      ? label
      : Object.values(label ?? {})[0] ?? "This field";
  const descriptionText =
    typeof description === "string"
      ? description
      : Object.values(description ?? {})[0];

  return (
    <div
      className="field-type text"
      data-error={showError ? "true" : "false"}
      ref={wrapperRef}
    >
      <label className="field-label" htmlFor={`field-${path}`}>
        {labelText}
        {required && <span className="field-required">*</span>}
      </label>
      <div style={styles.wrapper}>
        <div style={styles.inputRow}>
          <input
            id={`field-${path}`}
            onChange={(event) => setValue(event.target.value)}
            placeholder="e.g. 4:00 PM"
            style={styles.input}
            type="text"
            value={value}
          />
          <button
            aria-expanded={popupOpen}
            aria-haspopup="grid"
            aria-label={`Pick a time for ${labelText}`}
            onClick={() => setPopupOpen((open) => !open)}
            style={styles.pickButton}
            type="button"
          >
            {popupOpen ? "Close" : "Pick a time"}
          </button>
        </div>
        {popupOpen && (
          <div className="time-picker-popup" style={styles.popup}>
            {timeOptions.map((option) => {
              const isCurrent = option.toLowerCase() === currentValue;
              return (
                <button
                  aria-pressed={isCurrent}
                  key={option}
                  onClick={() => {
                    setValue(option);
                    setPopupOpen(false);
                  }}
                  style={{
                    ...styles.option,
                    ...(isCurrent ? styles.optionCurrent : null),
                  }}
                  type="button"
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {descriptionText && (
        <div className="field-description">{descriptionText}</div>
      )}
      {showError && <div className="field-error">{labelText} is required.</div>}
    </div>
  );
};

export default TimePickerField;
