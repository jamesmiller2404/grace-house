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

/* Footer preview modal — intentionally matches the Lives Changed Profile Preview. */
.gh-footer-edit .gh-story-preview-field {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
  margin: 0 0 20px;
}
.gh-footer-edit .gh-story-preview-launch {
  border: 1px solid #000;
  border-radius: 6px;
  background: #00aeef;
  color: #000;
  padding: 9px 18px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
.gh-footer-edit .gh-story-preview-launch:hover { background: #28bdf3; }
.gh-footer-edit .gh-story-preview-hint {
  color: #bdbdc5;
  font-size: 1rem;
  line-height: 1.5;
}
.gh-footer-edit .gh-story-preview-backdrop {
  position: fixed;
  z-index: 100000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(0, 0, 0, 0.82);
}
.gh-footer-edit .gh-story-preview-dialog {
  display: flex;
  flex-direction: column;
  width: min(1500px, 100%);
  height: min(94vh, 1100px);
  min-height: 0;
  overflow: hidden;
  border: 1px solid #55555f;
  border-radius: 12px;
  background: #25252b;
  box-shadow: 0 18px 70px rgba(0, 0, 0, 0.55);
}
.gh-footer-edit .gh-story-preview-toolbar {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: #19191e;
  color: #f0f0f3;
}
.gh-footer-edit .gh-story-preview-heading { display: flex; flex-direction: column; gap: 2px; }
.gh-footer-edit .gh-story-preview-heading strong { font-size: 1rem; }
.gh-footer-edit .gh-story-preview-heading span { color: #b0b0ba; font-size: 0.78rem; }
.gh-footer-edit .gh-story-preview-actions { display: flex; align-items: center; gap: 12px; }
.gh-footer-edit .gh-story-preview-device-switch {
  display: inline-flex;
  gap: 3px;
  padding: 3px;
  border: 1px solid #55555f;
  border-radius: 7px;
}
.gh-footer-edit .gh-story-preview-device-switch button,
.gh-footer-edit .gh-story-preview-close {
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 7px 11px;
  background: transparent;
  color: #f0f0f3;
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}
.gh-footer-edit .gh-story-preview-device-switch button.is-active {
  background: #00aeef;
  color: #080808;
  font-weight: 700;
}
.gh-footer-edit .gh-story-preview-close { border-color: #6b6b75; background: #393940; }
.gh-footer-edit .gh-story-preview-close:hover { background: #4b4b54; }
.gh-footer-edit .gh-story-preview-stage {
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  min-height: 0;
  overflow: auto;
  padding: 14px;
  background: #505057;
}
.gh-footer-edit .gh-story-preview-frame {
  display: block;
  flex: 0 0 auto;
  height: 100%;
  min-height: 500px;
  max-width: 100%;
  border: 0;
  border-radius: 5px;
  background: #e7d8c3;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.28);
}
.gh-footer-edit .gh-story-preview-stage.is-mobile .gh-story-preview-frame { width: 390px; }
@media (max-width: 640px) {
  .gh-footer-edit .gh-story-preview-backdrop { padding: 0; }
  .gh-footer-edit .gh-story-preview-dialog { width: 100%; height: 100%; border: 0; border-radius: 0; }
  .gh-footer-edit .gh-story-preview-toolbar { align-items: flex-start; flex-direction: column; }
  .gh-footer-edit .gh-story-preview-actions { width: 100%; justify-content: space-between; }
  .gh-footer-edit .gh-story-preview-stage { padding: 8px; }
  .gh-footer-edit .gh-story-preview-frame { min-height: 420px; }
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
