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
 * Those are the DARK scheme. When the admin theme is Light (Payload's
 * Light / Dark / Auto selector in Account -> Settings) the same elements are
 * repainted from the light palette defined in the stylesheet below.
 *
 * All field arrangement (which fields share a row, placeholder text, hidden
 * labels) lives in `src/payload/collections/Events.ts`; this component only
 * provides the paint. Payload's save/validate/versioning flow is untouched.
 */

/**
 * Scoped under `.gh-event-edit` so it never leaks into the rest of the admin
 * panel. !important is needed on the input rules to beat the inline styles
 * used by the custom TimePicker/ImagePosition field components.
 */
const css = `
/* The Events form palette. The values on .gh-event-edit are the DARK scheme
   (the original mockup); the html[data-theme='light'] block below repaints
   the same variables for the Light theme. The custom field components
   (TimePicker popup, ImagePosition preview) read these variables too. */
.gh-event-edit {
  --gh-ev-bg: #111115; /* page background */
  --gh-ev-frame: #2d2d33; /* the rounded form frame */
  --gh-ev-field: #101012; /* text field boxes */
  --gh-ev-field-text: #f0f0f3; /* text typed into the fields */
  --gh-ev-text: #f0f0f3; /* labels, menu options, general text */
  --gh-ev-menu: #222222; /* Status dropdown options menu */
  --gh-ev-hover: #414141; /* dropdown hover / current option */
  --gh-ev-upload: #515151; /* Upload / Choose from Media buttons */
  --gh-ev-help: #9d9da4; /* field helper text */
  --gh-ev-placeholder: linear-gradient(126deg, #535353, #202020); /* image preview */
  background: var(--gh-ev-bg);
  min-height: 100%;
  padding-bottom: 40px;
}
html[data-theme='light'] .gh-event-edit {
  --gh-ev-bg: #bab3d2;
  --gh-ev-frame: #bbc0ff;
  --gh-ev-field: #8787a9;
  --gh-ev-field-text: #525267;
  --gh-ev-text: #000000;
  --gh-ev-menu: #bbc0ff;
  --gh-ev-hover: #8787a9;
  --gh-ev-upload: #717dbc;
  --gh-ev-help: #525267;
  --gh-ev-placeholder: linear-gradient(126deg, #c4bedd, #8787a9);
}
/* The rounded frame that holds every form field. The document meta
   (breadcrumb, Last Modified / Created, Save) renders above this wrapper,
   so it stays on the page background like the mockup. */
.gh-event-edit .collection-edit__main-wrapper {
  background: var(--gh-ev-frame);
  border-radius: 16px;
  margin-top: 12px;
  padding: 28px;
}
.gh-event-edit .field-label {
  color: var(--gh-ev-text);
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
  background: var(--gh-ev-field) !important;
  border: 1px solid var(--gh-ev-field) !important;
  border-radius: 8px !important;
  color: var(--gh-ev-field-text);
}
.gh-event-edit input::placeholder,
.gh-event-edit textarea::placeholder {
  color: var(--gh-ev-field-text);
  opacity: 0.33;
}
/* Select dropdowns (Status) — react-select "rs__" classes */
.gh-event-edit .rs__control {
  background: var(--gh-ev-field);
  border-color: var(--gh-ev-field);
  border-radius: 8px;
  color: var(--gh-ev-field-text);
}
.gh-event-edit .rs__single-value,
.gh-event-edit .rs__placeholder,
.gh-event-edit .rs__indicator {
  color: var(--gh-ev-field-text);
}
.gh-event-edit .rs__menu {
  background: var(--gh-ev-menu);
}
.gh-event-edit .rs__option {
  color: var(--gh-ev-text);
}
.gh-event-edit .rs__option--is-focused,
.gh-event-edit .rs__option--is-selected {
  background: var(--gh-ev-hover);
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
   resting background (--gh-ev-upload; hover uses a separate --hover-bg,
   untouched) and the mockup's labels. The label swap hides Payload's text at
   font-size 0 and re-shows the new wording via a pseudo-element at the same
   size, so the global i18n strings (shared with list-page "Create New"
   buttons) stay put. */
.gh-event-edit .upload__createNewToggler,
.gh-event-edit .upload__listToggler {
  --bg-color: var(--gh-ev-upload);
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
  color: var(--gh-ev-help);
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
