"use client";

import { DefaultEditView } from "@payloadcms/ui";
import React from "react";

/**
 * Custom admin Edit view for the Custom Pages collection — a thin wrapper
 * around Payload's DefaultEditView that restyles the page to match the Events
 * and Hero create/edit pages (photoshop_assets/adminPanelMockup1.png):
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
 * This mirrors src/payload/collections/Donate/EditView.tsx, minus the
 * pieces that only exist on that form (the required marker for the intro
 * textarea — Custom Pages has no required body field; blocks are optional).
 * Field arrangement (which fields hide their labels, placeholder text,
 * which fields hide for a Photo block) lives in
 * `src/payload/collections/CustomPages.ts`; this component only provides
 * the paint. Payload's save/validate/versioning flow is untouched.
 */

/**
 * Scoped under `.gh-custom-pages-edit` so it never leaks into the rest of
 * the admin panel. !important is needed on the input rules to beat the
 * inline styles Payload applies to its text inputs.
 */
const css = `
/* The Custom Pages form palette. The values on .gh-custom-pages-edit are the
   DARK scheme (the original mockup); the html[data-theme='light'] block
   below repaints the same variables for the Light theme. */
.gh-custom-pages-edit {
  --gh-custom-pages-bg: #111115; /* page background */
  --gh-custom-pages-frame: #2d2d33; /* the rounded form frame */
  --gh-custom-pages-field: #101012; /* text field boxes */
  --gh-custom-pages-field-text: #f0f0f3; /* text typed into the fields */
  --gh-custom-pages-text: #f0f0f3; /* labels, general text */
  --gh-custom-pages-help: #9d9da4; /* field helper text */
  background: var(--gh-custom-pages-bg);
  min-height: 100%;
  padding-bottom: 40px;
}
html[data-theme='light'] .gh-custom-pages-edit {
  --gh-custom-pages-bg: #bab3d2;
  --gh-custom-pages-frame: #bbc0ff;
  --gh-custom-pages-field: #8787a9;
  --gh-custom-pages-field-text: #525267;
  --gh-custom-pages-text: #000000;
  --gh-custom-pages-help: #525267;
}
/* The rounded frame that holds every form field. The document meta
   (breadcrumb, Last Modified / Created, Save) renders above this wrapper,
   so it stays on the page background like the mockup. */
.gh-custom-pages-edit .collection-edit__main-wrapper {
  background: var(--gh-custom-pages-frame);
  border-radius: 16px;
  margin-top: 12px;
  padding: 28px;
}
.gh-custom-pages-edit .field-label {
  color: var(--gh-custom-pages-text);
}
/* Required-field marker (Page name). It keeps the mockup's placeholder-only
   look (label: false in CustomPages.ts), so Payload's labeled-field asterisk
   never renders for it. Paint the same marker here: a red * at the top-right
   corner of the box, using Payload's own required-star color. The text input
   carries the id on the input itself (input#field-title). */
.gh-custom-pages-edit .field-type:has(> .field-type__wrap > input#field-title) {
  position: relative;
}
.gh-custom-pages-edit .field-type:has(> .field-type__wrap > input#field-title)::after {
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
.gh-custom-pages-edit input:not([type="checkbox"]):not([type="radio"]),
.gh-custom-pages-edit textarea {
  background: var(--gh-custom-pages-field) !important;
  border: 1px solid var(--gh-custom-pages-field) !important;
  border-radius: 8px !important;
  color: var(--gh-custom-pages-field-text);
}
.gh-custom-pages-edit input::placeholder,
.gh-custom-pages-edit textarea::placeholder {
  color: var(--gh-custom-pages-field-text);
  opacity: 0.33;
}
/* Field helper text */
.gh-custom-pages-edit .field-description {
  color: var(--gh-custom-pages-help);
}
`;

type EditViewProps = Parameters<typeof DefaultEditView>[0];

function CustomPagesEditView(props: EditViewProps) {
  return (
    <div className="gh-custom-pages-edit">
      <style>{css}</style>
      <DefaultEditView {...props} />
    </div>
  );
}

export default CustomPagesEditView;
