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
/* Required-field markers (Title, Date, Location). These three keep the
   mockup's placeholder-only look (label: false in Events.ts), so Payload's
   labeled-field asterisk — the red * shown next to the Status dropdown —
   never renders for them. Paint the same marker here: a red * at the
   top-right corner of each box, using Payload's own required-star color
   (var(--theme-error-500), the .required rule in Payload's FieldLabel
   styles). Text fields carry the id on the input itself (input#field-title,
   input#field-location); the date field carries it on its
   .field-type__wrap div (#field-date). The > .field-type__wrap child hop
   keeps the selector from also matching the row wrappers that contain
   these fields. */
.gh-event-edit .field-type:has(> .field-type__wrap > input#field-title),
.gh-event-edit .field-type:has(> .field-type__wrap > input#field-location),
.gh-event-edit .field-type:has(> .field-type__wrap#field-date) {
  position: relative;
}
.gh-event-edit .field-type:has(> .field-type__wrap > input#field-title)::after,
.gh-event-edit .field-type:has(> .field-type__wrap > input#field-location)::after,
.gh-event-edit .field-type:has(> .field-type__wrap#field-date)::after {
  color: var(--theme-error-500);
  content: "*";
  font-size: calc(var(--base-body-size, 13) * 1px);
  font-weight: 700;
  line-height: 1;
  position: absolute;
  right: 6px;
  top: -6px;
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
  opacity: 0.33;
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
/* Status label + dropdown on one line (desktop AND mobile). Payload lays the
   select field out as a column (label above the control) and, inside rows,
   forces display:flex + flex-direction:column on every field child — a
   rule that also survives the <=1024px row collapse, which only changes the
   row wrapper (display: block, full-width children), not the field's inner
   direction. Flip the Status field to a horizontal row here: label (default
   margin-bottom zeroed) to the left, dropdown filling the remaining space.
   These rules are unlayered, so they beat Payload's @layer payload-default
   styles at every breakpoint. */
.gh-event-edit .field-type.select {
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: calc(var(--base, 16px) * 0.5);
}
.gh-event-edit .field-type.select > .field-label {
  margin-bottom: 0;
  flex-shrink: 0;
  white-space: nowrap;
}
.gh-event-edit .field-type.select > .field-type__wrap {
  flex: 1 1 auto;
  min-width: 0;
}
/* Upload field (event image): hide Payload's built-in "or drag and drop a
   file" hint — the mockup shows only the "Choose from existing" browse text. */
.gh-event-edit .upload__dragAndDropText {
  display: none !important;
}
/* Upload field card shown after an image is chosen or changed: hide the
   "Edit" button (it opens the Media document drawer to edit the image) —
   only the "Remove" (x) button stays. Payload's upload field offers no
   config switch for this, so the button is hidden with CSS. The rule is
   intentionally NOT scoped to .gh-event-edit: this same card also renders
   inside portal-rendered drawers (document-root modal container, outside
   the .gh-event-edit wrapper) opened from these pages. This stylesheet
   only exists while an Events create/edit page is mounted, so the rule
   still never reaches other admin pages (e.g. the Media collection list).
   The separate "Edit Image" pill inside the upload drawer is removed via
   the Media collection's upload config (crop/focalPoint) in Media.ts. */
.upload-relationship-details__edit {
  display: none !important;
}
/* Upload dropzone buttons ("Create New" / "Choose from existing"): flat
   #515151 resting background (hover uses a separate --hover-bg, untouched)
   and the mockup's labels. The label swap hides Payload's text at font-size 0
   and re-shows the new wording via a pseudo-element at the same size, so the
   global i18n strings (shared with list-page "Create New" buttons) stay put. */
.gh-event-edit .upload__createNewToggler,
.gh-event-edit .upload__listToggler {
  --bg-color: #515151;
}
.gh-event-edit .upload__createNewToggler .btn__label,
.gh-event-edit .upload__listToggler .btn__label {
  font-size: 0;
}
.gh-event-edit .upload__createNewToggler .btn__label::before {
  content: "Upload Image";
  /* --base-body-size is a unitless number in Payload's theme — it must be
     multiplied by 1px (Payload's own pattern) or font-size is invalid and
     the pseudo-element inherits the label's font-size: 0 (invisible text). */
  font-size: calc(var(--base-body-size, 13) * 1px);
}
.gh-event-edit .upload__listToggler .btn__label::before {
  content: "Choose from Media";
  font-size: calc(var(--base-body-size, 13) * 1px);
}
/* iPad Mini and narrower (Payload's mid-break, max-width: 1024px): Payload
   collapses the row to display: block so every field in the row goes
   full width. The row's flex row-gap no longer applies in block layout, and
   Payload renders row children with margins: false (--spacing-field: 0) —
   so Date / Start Time / End Time stack with no vertical gap and scrunch
   together. Restore the exact rhythm the row uses on desktop
   (calc(var(--base) * 0.8), Payload's own row-gap value). Unlayered styles
   here also beat Payload's @layer payload-default rules. */
@media (max-width: 1024px) {
  .gh-event-edit .field-type.row .row__fields > * {
    margin-bottom: calc(var(--base, 16px) * 0.8);
  }
  .gh-event-edit .field-type.row .row__fields > *:last-of-type {
    margin-bottom: 0;
  }
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
