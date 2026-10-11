"use client";

import { DefaultEditView } from "@payloadcms/ui";
import React from "react";

/**
 * Custom admin Edit view for the Events collection — a thin wrapper around
 * Payload's DefaultEditView that restyles the page to match
 * `photoshop_assets/adminPanelMockup1.png`:
 *
 *  - page background #111115
 *  - a rounded #2d2d33 "frame" panel around the form fields (the document
 *    header — breadcrumb, Last Modified / Created times, Save button — stays
 *    on the page background above the frame, exactly like the mockup)
 *  - text field boxes filled #101012 with #f0f0f3 text/placeholders
 *  - select dropdowns (Status) filled #101012 with a #222222 options menu
 *
 * All field arrangement (which fields share a row, placeholder text, hidden
 * labels) lives in `src/payload/collections/Events.ts`; this component only
 * provides the paint. Payload's save/validate/versioning flow is untouched.
 */

const BG = "#111115";
const FRAME = "#2d2d33";
const FIELD = "#101012";
const TEXT = "#f0f0f3";
const MENU_BG = "#222222";
const HOVER = "#414141";

/**
 * Scoped under `.gh-event-edit` so it never leaks into the rest of the admin
 * panel. !important is needed on the input rules to beat the inline styles
 * used by the custom TimePicker/ImagePosition field components.
 */
const css = `
.gh-event-edit {
  background: ${BG};
  min-height: 100%;
  padding-bottom: 40px;
}
/* The rounded frame that holds every form field. The document meta
   (breadcrumb, Last Modified / Created, Save) renders above this wrapper,
   so it stays on the page background like the mockup. */
.gh-event-edit .collection-edit__main-wrapper {
  background: ${FRAME};
  border-radius: 16px;
  margin-top: 12px;
  padding: 28px;
}
.gh-event-edit .field-label {
  color: ${TEXT};
}
/* Text boxes and textareas */
.gh-event-edit input:not([type="checkbox"]):not([type="radio"]),
.gh-event-edit textarea {
  background: ${FIELD} !important;
  border: 1px solid ${FIELD} !important;
  border-radius: 8px !important;
  color: ${TEXT};
}
.gh-event-edit input::placeholder,
.gh-event-edit textarea::placeholder {
  color: ${TEXT};
  opacity: 0.9;
}
/* Select dropdowns (Status) — react-select "rs__" classes */
.gh-event-edit .rs__control {
  background: ${FIELD};
  border-color: ${FIELD};
  border-radius: 8px;
  color: ${TEXT};
}
.gh-event-edit .rs__single-value,
.gh-event-edit .rs__placeholder,
.gh-event-edit .rs__indicator {
  color: ${TEXT};
}
.gh-event-edit .rs__menu {
  background: ${MENU_BG};
}
.gh-event-edit .rs__option {
  color: ${TEXT};
}
.gh-event-edit .rs__option--is-focused,
.gh-event-edit .rs__option--is-selected {
  background: ${HOVER};
}
/* Field helper text */
.gh-event-edit .field-description {
  color: #9d9da4;
}
`;

type EditViewProps = Parameters<typeof DefaultEditView>[0];

function EventsEditView(props: EditViewProps) {
  return (
    <div className="gh-event-edit">
      <style>{css}</style>
      <DefaultEditView {...props} />
    </div>
  );
}

export default EventsEditView;
