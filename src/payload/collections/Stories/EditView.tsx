"use client";

import { DefaultEditView } from "@payloadcms/ui";
import React from "react";

/**
 * Custom admin Edit view for the Stories collection — a thin wrapper around
 * Payload's DefaultEditView that restyles the page to match the Events and
 * Intro create/edit pages (photoshop_assets/adminPanelMockup1.png):
 *
 *  - page background #111115
 *  - a rounded #2d2d33 "frame" panel around the form fields (the document
 *    header — breadcrumb, Last Modified / Created times, Save button — stays
 *    on the page background above the frame, exactly like the mockup)
 *  - text field boxes and textareas filled #101012 with #f0f0f3
 *    text/placeholders
 *  - select dropdowns (Role, the body block type, Pillar) filled #101012 with
 *    a #222222 options menu
 *  - the upload dropzone buttons (Upload Image / Choose from Media)
 *
 * Those are the DARK scheme. When the admin theme is Light (Payload's
 * Light / Dark / Auto selector in Account -> Settings) the same elements are
 * repainted from the light palette defined in the stylesheet below.
 *
 * This mirrors src/payload/collections/Events/EditView.tsx and
 * src/payload/collections/Intro/EditView.tsx. Field arrangement (which fields
 * hide their labels, placeholder text) lives in
 * `src/payload/collections/Stories.ts`; this component only provides the paint.
 * Payload's save/validate/versioning flow is untouched.
 */

/**
 * Scoped under `.gh-stories-edit` so it never leaks into the rest of the admin
 * panel. !important is needed on the input rules to beat the inline styles
 * used by the custom ImagePosition field component.
 */
const css = `
/* The Stories form palette. The values on .gh-stories-edit are the DARK scheme
   (the original mockup); the html[data-theme='light'] block below repaints
   the same variables for the Light theme. --gh-ev-placeholder is the variable
   the shared ImagePosition field component reads for its preview gradient. */
.gh-stories-edit {
  --gh-st-bg: #111115; /* page background */
  --gh-st-frame: #2d2d33; /* the rounded form frame */
  --gh-st-field: #101012; /* text field boxes */
  --gh-st-field-text: #f0f0f3; /* text typed into the fields */
  --gh-st-text: #f0f0f3; /* labels, menu options, general text */
  --gh-st-menu: #222222; /* select dropdown options menu */
  --gh-st-hover: #414141; /* dropdown hover / current option */
  --gh-st-upload: #515151; /* Upload / Choose from Media buttons */
  --gh-st-help: #9d9da4; /* field helper text */
  --gh-ev-placeholder: linear-gradient(126deg, #535353, #202020); /* image preview */
  background: var(--gh-st-bg);
  min-height: 100%;
  padding-bottom: 40px;
}
html[data-theme='light'] .gh-stories-edit {
  --gh-st-bg: #bab3d2;
  --gh-st-frame: #bbc0ff;
  --gh-st-field: #8787a9;
  --gh-st-field-text: #525267;
  --gh-st-text: #000000;
  --gh-st-menu: #bbc0ff;
  --gh-st-hover: #8787a9;
  --gh-st-upload: #717dbc;
  --gh-st-help: #525267;
  --gh-ev-placeholder: linear-gradient(126deg, #c4bedd, #8787a9);
}
/* The rounded frame that holds every form field. The document meta
   (breadcrumb, Last Modified / Created, Save) renders above this wrapper,
   so it stays on the page background like the mockup. */
.gh-stories-edit .collection-edit__main-wrapper {
  background: var(--gh-st-frame);
  border-radius: 16px;
  margin-top: 12px;
  padding: 28px;
}
.gh-stories-edit .field-label {
  color: var(--gh-st-text);
}
/* Required-field marker (Name). This field keeps the mockup's placeholder-only
   look (label: false in Stories.ts), so Payload's labeled-field asterisk never
   renders for it. Paint the same marker here: a red * at the top-right corner
   of the box, using Payload's own required-star color. The text input carries
   the id on the input itself (input#field-name); the > .field-type__wrap child
   hop keeps the selector from also matching the outer row wrapper. */
.gh-stories-edit .field-type:has(> .field-type__wrap > input#field-name) {
  position: relative;
}
.gh-stories-edit .field-type:has(> .field-type__wrap > input#field-name)::after {
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
.gh-stories-edit input:not([type="checkbox"]):not([type="radio"]),
.gh-stories-edit textarea {
  background: var(--gh-st-field) !important;
  border: 1px solid var(--gh-st-field) !important;
  border-radius: 8px !important;
  color: var(--gh-st-field-text);
}
.gh-stories-edit input::placeholder,
.gh-stories-edit textarea::placeholder {
  color: var(--gh-st-field-text);
  opacity: 0.33;
}
/* Select dropdowns (Role, body block type, Pillar) — react-select "rs__"
   classes, like the Events Status dropdown. */
.gh-stories-edit .rs__control {
  background: var(--gh-st-field);
  border-color: var(--gh-st-field);
  border-radius: 8px;
  color: var(--gh-st-field-text);
}
.gh-stories-edit .rs__single-value,
.gh-stories-edit .rs__placeholder,
.gh-stories-edit .rs__indicator {
  color: var(--gh-st-field-text);
}
.gh-stories-edit .rs__menu {
  background: var(--gh-st-menu);
}
.gh-stories-edit .rs__option {
  color: var(--gh-st-text);
}
.gh-stories-edit .rs__option--is-focused,
.gh-stories-edit .rs__option--is-selected {
  background: var(--gh-st-hover);
}
/* Select label + dropdown on one line (desktop AND mobile), like the Events
   Status field: Payload lays the select field out as a column (label above
   the control); flip it to a horizontal row here so the label sits to the
   left of the dropdown. These rules are unlayered, so they beat Payload's
   @layer payload-default styles at every breakpoint. */
.gh-stories-edit .field-type.select {
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: calc(var(--base, 16px) * 0.5);
}
.gh-stories-edit .field-type.select > .field-label {
  margin-bottom: 0;
  flex-shrink: 0;
  white-space: nowrap;
}
.gh-stories-edit .field-type.select > .field-type__wrap {
  flex: 1 1 auto;
  min-width: 0;
}
/* Upload fields (portrait photo, memories photos): hide Payload's built-in
   "or drag and drop a file" hint — the mockup shows only the browse buttons. */
.gh-stories-edit .upload__dragAndDropText {
  display: none !important;
}
/* Upload field card shown after an image is chosen or changed: hide the
   "Edit" button (it opens the Media document drawer to edit the image) —
   only the "Remove" (x) button stays. Payload's upload field offers no
   config switch for this, so the button is hidden with CSS. The rule is
   intentionally NOT scoped to .gh-stories-edit: this same card also renders
   inside portal-rendered drawers (document-root modal container, outside
   the .gh-stories-edit wrapper) opened from these pages. This stylesheet
   only exists while a Stories create/edit page is mounted, so the rule
   still never reaches other admin pages (e.g. the Media collection list).
   The separate "Edit Image" pill inside the upload drawer is removed via
   the Media collection's upload config (crop/focalPoint) in Media.ts. */
.upload-relationship-details__edit {
  display: none !important;
}
/* Upload dropzone buttons ("Create New" / "Choose from existing"): flat
   resting background (--gh-st-upload; hover uses a separate --hover-bg,
   untouched) and the mockup's labels. The label swap hides Payload's text at
   font-size 0 and re-shows the new wording via a pseudo-element at the same
   size, so the global i18n strings (shared with list-page "Create New"
   buttons) stay put. */
.gh-stories-edit .upload__createNewToggler,
.gh-stories-edit .upload__listToggler {
  --bg-color: var(--gh-st-upload);
}
.gh-stories-edit .upload__createNewToggler .btn__label,
.gh-stories-edit .upload__listToggler .btn__label {
  font-size: 0;
}
.gh-stories-edit .upload__createNewToggler .btn__label::before {
  content: "Upload Image";
  /* --base-body-size is a unitless number in Payload's theme — it must be
     multiplied by 1px (Payload's own pattern) or font-size is invalid and
     the pseudo-element inherits the label's font-size: 0 (invisible text). */
  font-size: calc(var(--base-body-size, 13) * 1px);
}
.gh-stories-edit .upload__listToggler .btn__label::before {
  content: "Choose from Media";
  font-size: calc(var(--base-body-size, 13) * 1px);
}
/* iPad Mini and narrower (Payload's mid-break, max-width: 1024px): Payload
   collapses the Name / Role row to display: block so every field in the row
   goes full width. The row's flex row-gap no longer applies in block layout,
   and Payload renders row children with margins: false (--spacing-field: 0) —
   so the fields stack with no vertical gap and scrunch together. Restore the
   exact rhythm the row uses on desktop (calc(var(--base) * 0.8), Payload's
   own row-gap value). Unlayered styles here also beat Payload's
   @layer payload-default rules. */
@media (max-width: 1024px) {
  .gh-stories-edit .field-type.row .row__fields > * {
    margin-bottom: calc(var(--base, 16px) * 0.8);
  }
  .gh-stories-edit .field-type.row .row__fields > *:last-of-type {
    margin-bottom: 0;
  }
}
/* Field helper text */
.gh-stories-edit .field-description {
  color: var(--gh-st-help);
}
`;

type EditViewProps = Parameters<typeof DefaultEditView>[0];

function StoriesEditView(props: EditViewProps) {
  return (
    <div className="gh-stories-edit">
      <style>{css}</style>
      <DefaultEditView {...props} />
    </div>
  );
}

export default StoriesEditView;
