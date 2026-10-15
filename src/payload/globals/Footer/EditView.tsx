"use client";

import { DefaultEditView } from "@payloadcms/ui";
import React from "react";

/**
 * Custom admin Edit view for the Footer global — a thin wrapper around
 * Payload's DefaultEditView that restyles the page to match the other admin
 * panels (photoshop_assets/adminPanelMockup1.png):
 *
 *  - page background #111115
 *  - a rounded #2d2d33 "frame" panel around the form fields (the document
 *    header — breadcrumb, Last Modified / Created times, Save button — stays
 *    on the page background above the frame, exactly like the mockup)
 *  - the custom phone / email / address boxes filled #101012 with #f0f0f3
 *    text, and the "Phone number" / "Email address" / "Address" pickers filled
 *    #101012 with a #222222 options menu
 *
 * Those are the DARK scheme. When the admin theme is Light (Payload's
 * Light / Dark / Auto selector in Account -> Settings) the same elements are
 * repainted from the light palette defined in the stylesheet below.
 *
 * This mirrors src/payload/collections/GetHelpNow/EditView.tsx (the other page
 * built from the Contact Info pickers), plus the dropdown rules the Home Page
 * Layout global uses for its "Section" select. Field arrangement (the pickers
 * and their conditional "custom" boxes) lives in
 * `src/payload/globals/Footer.ts`; this component only provides the paint.
 * Payload's save/validate flow is untouched.
 */

/**
 * Scoped under `.gh-footer-edit` so it never leaks into the rest of the admin
 * panel. !important is needed on the input rules to beat the inline styles
 * Payload applies to its text inputs.
 */
const css = `
/* The Footer form palette. The values on .gh-footer-edit are the DARK scheme
   (the original mockup); the html[data-theme='light'] block below repaints the
   same variables for the Light theme. */
.gh-footer-edit {
  --gh-ft-bg: #111115; /* page background */
  --gh-ft-frame: #2d2d33; /* the rounded form frame */
  --gh-ft-field: #101012; /* text field boxes and the pickers */
  --gh-ft-field-text: #f0f0f3; /* text typed into the fields */
  --gh-ft-text: #f0f0f3; /* labels, menu options, general text */
  --gh-ft-menu: #222222; /* picker options menu */
  --gh-ft-hover: #414141; /* dropdown hover / current option */
  --gh-ft-help: #9d9da4; /* field helper text */
  background: var(--gh-ft-bg);
  min-height: 100%;
  padding-bottom: 40px;
}
html[data-theme='light'] .gh-footer-edit {
  --gh-ft-bg: #bab3d2;
  --gh-ft-frame: #bbc0ff;
  --gh-ft-field: #8787a9;
  --gh-ft-field-text: #525267;
  --gh-ft-text: #000000;
  --gh-ft-menu: #bbc0ff;
  --gh-ft-hover: #8787a9;
  --gh-ft-help: #525267;
}
/* The rounded frame that holds every form field. The document meta
   (breadcrumb, Last Modified / Created, Save) renders above this wrapper,
   so it stays on the page background like the mockup. */
.gh-footer-edit .collection-edit__main-wrapper {
  background: var(--gh-ft-frame);
  border-radius: 16px;
  margin-top: 12px;
  padding: 28px;
}
.gh-footer-edit .field-label {
  color: var(--gh-ft-text);
}
/* The custom phone number / email address / address boxes. Checkboxes and
   radios keep Payload's own styling, like the checkbox fields on the other
   panels. */
.gh-footer-edit input:not([type="checkbox"]):not([type="radio"]),
.gh-footer-edit textarea {
  background: var(--gh-ft-field) !important;
  border: 1px solid var(--gh-ft-field) !important;
  border-radius: 8px !important;
  color: var(--gh-ft-field-text);
}
.gh-footer-edit input::placeholder,
.gh-footer-edit textarea::placeholder {
  color: var(--gh-ft-field-text);
  opacity: 0.33;
}
/* The Phone number / Email address / Address pickers — react-select "rs__"
   classes, like the Home Page Layout "Section" dropdown and the Events Status
   dropdown. */
.gh-footer-edit .rs__control {
  background: var(--gh-ft-field);
  border-color: var(--gh-ft-field);
  border-radius: 8px;
  color: var(--gh-ft-field-text);
}
.gh-footer-edit .rs__single-value,
.gh-footer-edit .rs__placeholder,
.gh-footer-edit .rs__indicator {
  color: var(--gh-ft-field-text);
}
.gh-footer-edit .rs__menu {
  background: var(--gh-ft-menu);
}
.gh-footer-edit .rs__option {
  color: var(--gh-ft-text);
}
.gh-footer-edit .rs__option--is-focused,
.gh-footer-edit .rs__option--is-selected {
  background: var(--gh-ft-hover);
}
/* Field helper text ("The phone number shown in the footer. Pick one
   registered in the Contact Info panel, or enter a custom one."). */
.gh-footer-edit .field-description {
  color: var(--gh-ft-help);
}
`;

type EditViewProps = Parameters<typeof DefaultEditView>[0];

function FooterEditView(props: EditViewProps) {
  return (
    <div className="gh-footer-edit">
      <style>{css}</style>
      <DefaultEditView {...props} />
    </div>
  );
}

export default FooterEditView;
