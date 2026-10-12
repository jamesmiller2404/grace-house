"use client";

import { DefaultEditView } from "@payloadcms/ui";
import React from "react";

/**
 * Custom admin Edit view for the Hero collection — a thin wrapper around
 * Payload's DefaultEditView that restyles the page to match the Events
 * create/edit page (photoshop_assets/adminPanelMockup1.png):
 *
 *  - page background #111115
 *  - a rounded #2d2d33 "frame" panel around the form fields (the document
 *    header — breadcrumb, Last Modified / Created times, Save button — stays
 *    on the page background above the frame, exactly like the mockup)
 *  - text field boxes filled #101012 with #f0f0f3 text/placeholders
 *  - the upload dropzone buttons (Upload Image / Choose from Media)
 *
 * Those are the DARK scheme. When the admin theme is Light (Payload's
 * Light / Dark / Auto selector in Account -> Settings) the same elements are
 * repainted from the light palette defined in the stylesheet below.
 *
 * This mirrors src/payload/collections/Events/EditView.tsx, minus the pieces
 * that only exist on the Events form (the Status dropdown, the image-position
 * preview, the Date / Time fields and their required markers). Field
 * arrangement (which fields hide their labels, placeholder text) lives in
 * `src/payload/collections/Hero.ts`; this component only provides the paint.
 * Payload's save/validate/versioning flow is untouched.
 */

/**
 * Scoped under `.gh-hero-edit` so it never leaks into the rest of the admin
 * panel. !important is needed on the input rules to beat the inline styles
 * Payload applies to its text inputs.
 */
const css = `
/* The Hero form palette. The values on .gh-hero-edit are the DARK scheme
   (the original mockup); the html[data-theme='light'] block below repaints
   the same variables for the Light theme. */
.gh-hero-edit {
  --gh-hero-bg: #111115; /* page background */
  --gh-hero-frame: #2d2d33; /* the rounded form frame */
  --gh-hero-field: #101012; /* text field boxes */
  --gh-hero-field-text: #f0f0f3; /* text typed into the fields */
  --gh-hero-text: #f0f0f3; /* labels, general text */
  --gh-hero-upload: #515151; /* Upload / Choose from Media buttons */
  --gh-hero-help: #9d9da4; /* field helper text */
  background: var(--gh-hero-bg);
  min-height: 100%;
  padding-bottom: 40px;
}
html[data-theme='light'] .gh-hero-edit {
  --gh-hero-bg: #bab3d2;
  --gh-hero-frame: #bbc0ff;
  --gh-hero-field: #8787a9;
  --gh-hero-field-text: #525267;
  --gh-hero-text: #000000;
  --gh-hero-upload: #717dbc;
  --gh-hero-help: #525267;
}
/* The rounded frame that holds every form field. The document meta
   (breadcrumb, Last Modified / Created, Save) renders above this wrapper,
   so it stays on the page background like the mockup. */
.gh-hero-edit .collection-edit__main-wrapper {
  background: var(--gh-hero-frame);
  border-radius: 16px;
  margin-top: 12px;
  padding: 28px;
}
.gh-hero-edit .field-label {
  color: var(--gh-hero-text);
}
/* Required-field marker (Heading). This field keeps the mockup's
   placeholder-only look (label: false in Hero.ts), so Payload's labeled-field
   asterisk never renders for it. Paint the same marker here: a red * at the
   top-right corner of the box, using Payload's own required-star color. The
   input carries the id on the input itself (input#field-heading); the
   > .field-type__wrap child hop keeps the selector from also matching the
   outer field wrappers. */
.gh-hero-edit .field-type:has(> .field-type__wrap > input#field-heading) {
  position: relative;
}
.gh-hero-edit .field-type:has(> .field-type__wrap > input#field-heading)::after {
  color: var(--theme-error-500);
  content: "*";
  font-size: calc(var(--base-body-size, 13) * 1px);
  font-weight: 700;
  line-height: 1;
  position: absolute;
  right: 6px;
  top: -6px;
}
/* Text boxes */
.gh-hero-edit input:not([type="checkbox"]):not([type="radio"]) {
  background: var(--gh-hero-field) !important;
  border: 1px solid var(--gh-hero-field) !important;
  border-radius: 8px !important;
  color: var(--gh-hero-field-text);
}
.gh-hero-edit input::placeholder {
  color: var(--gh-hero-field-text);
  opacity: 0.33;
}
/* Upload field (hero image): hide Payload's built-in "or drag and drop a
   file" hint — the mockup shows only the browse buttons. */
.gh-hero-edit .upload__dragAndDropText {
  display: none !important;
}
/* Upload field card shown after an image is chosen or changed: hide the
   "Edit" button (it opens the Media document drawer to edit the image) —
   only the "Remove" (x) button stays. Payload's upload field offers no
   config switch for this, so the button is hidden with CSS. The rule is
   intentionally NOT scoped to .gh-hero-edit: this same card also renders
   inside portal-rendered drawers (document-root modal container, outside
   the .gh-hero-edit wrapper) opened from these pages. This stylesheet only
   exists while a Hero edit page is mounted, so the rule still never reaches
   other admin pages (e.g. the Media collection list). The separate
   "Edit Image" pill inside the upload drawer is removed via the Media
   collection's upload config (crop/focalPoint) in Media.ts. */
.upload-relationship-details__edit {
  display: none !important;
}
/* Upload dropzone buttons ("Create New" / "Choose from existing"): flat
   resting background (--gh-hero-upload; hover uses a separate --hover-bg,
   untouched) and the mockup's labels. The label swap hides Payload's text at
   font-size 0 and re-shows the new wording via a pseudo-element at the same
   size, so the global i18n strings (shared with list-page "Create New"
   buttons) stay put. */
.gh-hero-edit .upload__createNewToggler,
.gh-hero-edit .upload__listToggler {
  --bg-color: var(--gh-hero-upload);
}
.gh-hero-edit .upload__createNewToggler .btn__label,
.gh-hero-edit .upload__listToggler .btn__label {
  font-size: 0;
}
.gh-hero-edit .upload__createNewToggler .btn__label::before {
  content: "Upload Image";
  /* --base-body-size is a unitless number in Payload's theme — it must be
     multiplied by 1px (Payload's own pattern) or font-size is invalid and
     the pseudo-element inherits the label's font-size: 0 (invisible text). */
  font-size: calc(var(--base-body-size, 13) * 1px);
}
.gh-hero-edit .upload__listToggler .btn__label::before {
  content: "Choose from Media";
  font-size: calc(var(--base-body-size, 13) * 1px);
}
/* Field helper text */
.gh-hero-edit .field-description {
  color: var(--gh-hero-help);
}
`;

type EditViewProps = Parameters<typeof DefaultEditView>[0];

function HeroEditView(props: EditViewProps) {
  return (
    <div className="gh-hero-edit">
      <style>{css}</style>
      <DefaultEditView {...props} />
    </div>
  );
}

export default HeroEditView;
