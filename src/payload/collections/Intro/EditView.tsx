"use client";

import { DefaultEditView } from "@payloadcms/ui";
import React from "react";

/**
 * Custom admin Edit view for the Intro collection — a thin wrapper around
 * Payload's DefaultEditView that restyles the page to match the Events and
 * Hero create/edit pages (photoshop_assets/adminPanelMockup1.png):
 *
 *  - page background #111115
 *  - a rounded #2d2d33 "frame" panel around the form fields (the document
 *    header — breadcrumb, Last Modified / Created times, Save button — stays
 *    on the page background above the frame, exactly like the mockup)
 *  - text field boxes and textareas filled #101012 with #f0f0f3
 *    text/placeholders
 *  - select dropdowns (the four color fields) filled #101012 with a #222222
 *    options menu
 *
 * Those are the DARK scheme. When the admin theme is Light (Payload's
 * Light / Dark / Auto selector in Account -> Settings) the same elements are
 * repainted from the light palette defined in the stylesheet below.
 *
 * This mirrors src/payload/collections/Events/EditView.tsx and
 * src/payload/collections/Hero/EditView.tsx. Field arrangement (which fields
 * hide their labels, placeholder text) lives in
 * `src/payload/collections/Intro.ts`; this component only provides the paint.
 * Payload's save/validate/versioning flow is untouched.
 */

/**
 * Scoped under `.gh-intro-edit` so it never leaks into the rest of the admin
 * panel. !important is needed on the input rules to beat the inline styles
 * Payload applies to its text inputs.
 */
const css = `
/* The Intro form palette. The values on .gh-intro-edit are the DARK scheme
   (the original mockup); the html[data-theme='light'] block below repaints
   the same variables for the Light theme. */
.gh-intro-edit {
  --gh-intro-bg: #111115; /* page background */
  --gh-intro-frame: #2d2d33; /* the rounded form frame */
  --gh-intro-field: #101012; /* text field boxes */
  --gh-intro-field-text: #f0f0f3; /* text typed into the fields */
  --gh-intro-text: #f0f0f3; /* labels, menu options, general text */
  --gh-intro-menu: #222222; /* color dropdown options menu */
  --gh-intro-hover: #414141; /* dropdown hover / current option */
  --gh-intro-help: #9d9da4; /* field helper text */
  background: var(--gh-intro-bg);
  min-height: 100%;
  padding-bottom: 40px;
}
html[data-theme='light'] .gh-intro-edit {
  --gh-intro-bg: #bab3d2;
  --gh-intro-frame: #bbc0ff;
  --gh-intro-field: #8787a9;
  --gh-intro-field-text: #525267;
  --gh-intro-text: #000000;
  --gh-intro-menu: #bbc0ff;
  --gh-intro-hover: #8787a9;
  --gh-intro-help: #525267;
}
/* The rounded frame that holds every form field. The document meta
   (breadcrumb, Last Modified / Created, Save) renders above this wrapper,
   so it stays on the page background like the mockup. */
.gh-intro-edit .collection-edit__main-wrapper {
  background: var(--gh-intro-frame);
  border-radius: 16px;
  margin-top: 12px;
  padding: 28px;
}
.gh-intro-edit .field-label {
  color: var(--gh-intro-text);
}
/* Required-field markers (Heading, Body). These two keep the mockup's
   placeholder-only look (label: false in Intro.ts), so Payload's labeled-field
   asterisk never renders for them. Paint the same marker here: a red * at the
   top-right corner of each box, using Payload's own required-star color. The
   text input carries the id on the input itself (input#field-heading); the
   textarea sits inside a .textarea-outer wrapper (textarea#field-body). The
   > .field-type__wrap child hop keeps the selector from also matching the
   outer field wrappers. */
.gh-intro-edit .field-type:has(> .field-type__wrap > input#field-heading),
.gh-intro-edit .field-type:has(> .field-type__wrap > .textarea-outer > textarea#field-body) {
  position: relative;
}
.gh-intro-edit .field-type:has(> .field-type__wrap > input#field-heading)::after,
.gh-intro-edit .field-type:has(> .field-type__wrap > .textarea-outer > textarea#field-body)::after {
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
.gh-intro-edit input:not([type="checkbox"]):not([type="radio"]),
.gh-intro-edit textarea {
  background: var(--gh-intro-field) !important;
  border: 1px solid var(--gh-intro-field) !important;
  border-radius: 8px !important;
  color: var(--gh-intro-field-text);
}
.gh-intro-edit input::placeholder,
.gh-intro-edit textarea::placeholder {
  color: var(--gh-intro-field-text);
  opacity: 0.33;
}
/* Select dropdowns (the four color fields) — react-select "rs__" classes */
.gh-intro-edit .rs__control {
  background: var(--gh-intro-field);
  border-color: var(--gh-intro-field);
  border-radius: 8px;
  color: var(--gh-intro-field-text);
}
.gh-intro-edit .rs__single-value,
.gh-intro-edit .rs__placeholder,
.gh-intro-edit .rs__indicator {
  color: var(--gh-intro-field-text);
}
.gh-intro-edit .rs__menu {
  background: var(--gh-intro-menu);
}
.gh-intro-edit .rs__option {
  color: var(--gh-intro-text);
}
.gh-intro-edit .rs__option--is-focused,
.gh-intro-edit .rs__option--is-selected {
  background: var(--gh-intro-hover);
}
/* Field helper text */
.gh-intro-edit .field-description {
  color: var(--gh-intro-help);
}
`;

type EditViewProps = Parameters<typeof DefaultEditView>[0];

function IntroEditView(props: EditViewProps) {
  return (
    <div className="gh-intro-edit">
      <style>{css}</style>
      <DefaultEditView {...props} />
    </div>
  );
}

export default IntroEditView;
