"use client";

import { DefaultEditView } from "@payloadcms/ui";
import React from "react";

/**
 * Custom admin Edit view for the Donate collection — a thin wrapper around
 * Payload's DefaultEditView that restyles the page to match the Events and
 * Hero create/edit pages (photoshop_assets/adminPanelMockup1.png):
 *
 *  - page background #111115
 *  - a rounded #2d2d33 "frame" panel around the form fields (the document
 *    header — breadcrumb, Last Modified / Created times, Save button — stays
 *    on the page background above the frame, exactly like the mockup)
 *  - text field boxes and textareas filled #101012 with #f0f0f3
 *    text/placeholders
 *
 * Those are the DARK scheme. When the admin theme is Light (Payload's
 * Light / Dark / Auto selector in Account -> Settings) the same elements are
 * repainted from the light palette defined in the stylesheet below.
 *
 * This mirrors src/payload/collections/Intro/EditView.tsx and
 * src/payload/collections/Hero/EditView.tsx, minus the pieces that only exist
 * on those forms (the Status dropdown, the image-position preview, the
 * Date / Time fields and the color dropdowns). Field arrangement (which
 * fields hide their labels, placeholder text) lives in
 * `src/payload/collections/Donate.ts`; this component only provides the paint.
 * Payload's save/validate/versioning flow is untouched.
 */

/**
 * Scoped under `.gh-donate-edit` so it never leaks into the rest of the admin
 * panel. !important is needed on the input rules to beat the inline styles
 * Payload applies to its text inputs.
 */
const css = `
/* The Donate form palette. The values on .gh-donate-edit are the DARK scheme
   (the original mockup); the html[data-theme='light'] block below repaints
   the same variables for the Light theme. */
.gh-donate-edit {
  --gh-donate-bg: #111115; /* page background */
  --gh-donate-frame: #2d2d33; /* the rounded form frame */
  --gh-donate-field: #101012; /* text field boxes */
  --gh-donate-field-text: #f0f0f3; /* text typed into the fields */
  --gh-donate-text: #f0f0f3; /* labels, general text */
  --gh-donate-help: #9d9da4; /* field helper text */
  background: var(--gh-donate-bg);
  min-height: 100%;
  padding-bottom: 40px;
}
html[data-theme='light'] .gh-donate-edit {
  --gh-donate-bg: #bab3d2;
  --gh-donate-frame: #bbc0ff;
  --gh-donate-field: #8787a9;
  --gh-donate-field-text: #525267;
  --gh-donate-text: #000000;
  --gh-donate-help: #525267;
}
/* The rounded frame that holds every form field. The document meta
   (breadcrumb, Last Modified / Created, Save) renders above this wrapper,
   so it stays on the page background like the mockup. */
.gh-donate-edit .collection-edit__main-wrapper {
  background: var(--gh-donate-frame);
  border-radius: 16px;
  margin-top: 12px;
  padding: 28px;
}
.gh-donate-edit .field-label {
  color: var(--gh-donate-text);
}
/* Required-field markers (Title, Intro). These two keep the mockup's
   placeholder-only look (label: false in Donate.ts), so Payload's
   labeled-field asterisk never renders for them. Paint the same marker here:
   a red * at the top-right corner of each box, using Payload's own
   required-star color. The text input carries the id on the input itself
   (input#field-title); the textarea sits inside a .textarea-outer wrapper
   (textarea#field-intro). The > .field-type__wrap child hop keeps the
   selector from also matching the outer field wrappers. */
.gh-donate-edit .field-type:has(> .field-type__wrap > input#field-title),
.gh-donate-edit .field-type:has(> .field-type__wrap > .textarea-outer > textarea#field-intro) {
  position: relative;
}
.gh-donate-edit .field-type:has(> .field-type__wrap > input#field-title)::after,
.gh-donate-edit .field-type:has(> .field-type__wrap > .textarea-outer > textarea#field-intro)::after {
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
.gh-donate-edit input:not([type="checkbox"]):not([type="radio"]),
.gh-donate-edit textarea {
  background: var(--gh-donate-field) !important;
  border: 1px solid var(--gh-donate-field) !important;
  border-radius: 8px !important;
  color: var(--gh-donate-field-text);
}
.gh-donate-edit input::placeholder,
.gh-donate-edit textarea::placeholder {
  color: var(--gh-donate-field-text);
  opacity: 0.33;
}
/* Field helper text */
.gh-donate-edit .field-description {
  color: var(--gh-donate-help);
}
`;

type EditViewProps = Parameters<typeof DefaultEditView>[0];

function DonateEditView(props: EditViewProps) {
  return (
    <div className="gh-donate-edit">
      <style>{css}</style>
      <DefaultEditView {...props} />
    </div>
  );
}

export default DonateEditView;