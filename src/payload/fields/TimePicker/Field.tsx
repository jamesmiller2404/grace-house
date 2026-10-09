"use client";

import { useField } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import React, { useEffect, useRef, useState } from "react";

/**
 * Admin component for `TimeField` (src/payload/fields/TimePicker/index.ts).
 *
 * Renders a plain text input — so manual entry works exactly like before —
 * plus a small clock-icon button that opens a floating dark popup panel
 * (styled after photoshop_assets/timePanel.png) with every half-hour from
 * 6:00 am around the clock to 5:30 am. Clicking an option fills the input;
 * Escape or an outside click closes it.
 */

/**
 * All 48 half-hour increments of the day as 12-hour clock labels (lowercase
 * am/pm), starting at 6:00 am and wrapping past midnight to 5:30 am. The
 * popup grid flows column-major (6 rows), so times run down each column
 * exactly like the timePanel.png mockup.
 */
function buildTimeOptions(): string[] {
  const options: string[] = [];
  for (let hour = 6; hour < 30; hour += 1) {
    const hour24 = hour % 24;
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const period = hour24 < 12 ? "am" : "pm";
    for (const minute of [0, 30]) {
      const paddedMinute = String(minute).padStart(2, "0");
      options.push(`${hour12}:${paddedMinute} ${period}`);
    }
  }
  return options;
}

const timeOptions = buildTimeOptions();

/** Mockup colors (timePanel.png). */
const PANEL_BG = "#222222";
const BOX_BORDER = "#414141";
const BOX_TEXT = "#cfcfcf";
const HOVER_FILL = "#414141";

/**
 * Popup styling that can't be done with inline styles (hover, scrollbar,
 * current-option states). Scoped under `.time-picker-popup` so it never
 * leaks into the rest of the admin panel.
 */
const popupCss = `
.time-picker-popup .tp-option {
  background: transparent;
  border: 1px solid ${BOX_BORDER};
  border-radius: 3px;
  color: ${BOX_TEXT};
  cursor: pointer;
  font-family: var(--font-body, sans-serif);
  font-size: 12.5px;
  line-height: 1;
  padding: 8px 2px;
  text-align: center;
  transition: background 0.1s ease;
  white-space: nowrap;
}
.time-picker-popup .tp-option:hover {
  background: ${HOVER_FILL};
}
.time-picker-popup .tp-option.tp-option-current {
  background: ${HOVER_FILL};
  color: #ffffff;
  font-weight: 600;
}
.time-picker-popup::-webkit-scrollbar {
  width: 8px;
}
.time-picker-popup::-webkit-scrollbar-thumb {
  background: ${BOX_BORDER};
  border-radius: 4px;
}
`;

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
    // Chip look is handled by the .tp-option CSS classes above; keep this
    // entry as a base so grid alignment stays consistent.
    display: "block",
    width: "100%",
  },
  popup: {
    // Fixed positioning makes this float above the surrounding admin UI the
    // same way the date picker's calendar card does (no clipping by
    // scroll containers). The position values are set from the input's
    // bounding rect when the popup opens.
    background: PANEL_BG,
    border: `1px solid ${BOX_BORDER}`,
    borderRadius: 4,
    boxShadow: "0 4px 6px -2px rgba(0, 0, 0, 0.3), 0 10px 15px -3px rgba(0, 0, 0, 0.3)",
    boxSizing: "border-box",
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
    gridTemplateRows: "repeat(6, auto)",
    maxHeight: 320,
    overflowY: "auto",
    padding: 6,
    position: "fixed",
    zIndex: 100,
  },
  pickButton: {
    alignItems: "center",
    background: "var(--theme-elevation-100)",
    border: "1px solid var(--theme-elevation-150)",
    borderRadius: "var(--style-radius-m, 4px)",
    color: "var(--theme-text)",
    cursor: "pointer",
    display: "flex",
    flexShrink: 0,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  wrapper: { position: "relative" },
};

const TimePickerField: React.FC<TextFieldClientProps> = (props) => {
  const { field, path } = props;
  const { admin, label, required } = field;
  const description = admin?.description;

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{
    left: number;
    top: number;
    width: number;
  }>({ left: 0, top: 0, width: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { setValue, showError, value = "" } = useField<string>({ path });

  // Anchor the popup right below the input row, floating above everything
  // else (fixed positioning, like the date picker's calendar card).
  useEffect(() => {
    if (!popupOpen || !wrapperRef.current) return;
    const update = () => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (rect) {
        setPopupPosition({
          left: rect.left,
          top: rect.bottom + 4,
          width: Math.max(rect.width, 560),
        });
      }
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [popupOpen]);

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
      <style>{popupCss}</style>
      <label className="field-label" htmlFor={`field-${path}`}>
        {labelText}
        {required && <span className="field-required">*</span>}
      </label>
      <div style={styles.wrapper}>
        <div style={styles.inputRow}>
          <input
            id={`field-${path}`}
            onChange={(event) => setValue(event.target.value)}
            placeholder="e.g. 4:00 pm"
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
            title={popupOpen ? "Close time picker" : "Pick a time"}
            type="button"
          >
            {/* Small clock icon instead of a text button */}
            <svg
              aria-hidden="true"
              fill="none"
              height="16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="16"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
        </div>
        {popupOpen && (
          <div
            className="time-picker-popup"
            style={{
              ...styles.popup,
              left: popupPosition.left,
              top: popupPosition.top,
              width: popupPosition.width,
            }}
          >
            {timeOptions.map((option) => {
              const isCurrent = option.toLowerCase() === currentValue;
              return (
                <button
                  aria-pressed={isCurrent}
                  className={`tp-option${isCurrent ? " tp-option-current" : ""}`}
                  key={option}
                  onClick={() => {
                    setValue(option);
                    setPopupOpen(false);
                  }}
                  style={styles.option}
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
