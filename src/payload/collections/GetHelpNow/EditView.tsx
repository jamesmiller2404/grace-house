"use client";

import { DefaultEditView } from "@payloadcms/ui";
import React from "react";

/**
 * Custom admin Edit view for the Get Help Now collection — a thin wrapper
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
 * This mirrors src/payload/collections/Hero/EditView.tsx, plus the textarea
 * rules the forms with textarea fields use (e.g. src/payload/collections/
 * CustomPages/EditView.tsx). Field arrangement (which fields hide their
 * labels, placeholder text, and the conditional assessment fields) lives in
 * `src/payload/collections/GetHelpNow.ts`; this component only provides the
 * paint. Payload's save/validate flow is untouched.
 */

/**
 * Scoped under `.gh-get-help-edit` so it never leaks into the rest of the admin
 * panel. !important is needed on the input rules to beat the inline styles
 * Payload applies to its text inputs.
 */
const css = `
/* The Get Help Now form palette. The values on .gh-get-help-edit are the DARK
   scheme (the original mockup); the html[data-theme='light'] block below
   repaints the same variables for the Light theme. */
.gh-get-help-edit {
  --gh-gh-bg: #111115; /* page background */
  --gh-gh-frame: #2d2d33; /* the rounded form frame */
  --gh-gh-field: #101012; /* text field boxes and textareas */
  --gh-gh-field-text: #f0f0f3; /* text typed into the fields */
  --gh-gh-text: #f0f0f3; /* labels, general text */
  --gh-gh-help: #9d9da4; /* field helper text */
  background: var(--gh-gh-bg);
  min-height: 100%;
  padding-bottom: 40px;
}
html[data-theme='light'] .gh-get-help-edit {
  --gh-gh-bg: #bab3d2;
  --gh-gh-frame: #bbc0ff;
  --gh-gh-field: #8787a9;
  --gh-gh-field-text: #525267;
  --gh-gh-text: #000000;
  --gh-gh-help: #525267;
}
/* The rounded frame that holds every form field. The document meta
   (breadcrumb, Last Modified / Created, Save) renders above this wrapper,
   so it stays on the page background like the mockup. */
.gh-get-help-edit .collection-edit__main-wrapper {
  background: var(--gh-gh-frame);
  border-radius: 16px;
  margin-top: 12px;
  padding: 28px;
}
.gh-get-help-edit .field-label {
  color: var(--gh-gh-text);
}
/* Required-field markers (Heading, Opening line). Both fields keep the
   mockup's placeholder-only look (label: false in GetHelpNow.ts), so
   Payload's labeled-field asterisk never renders for them. Paint the same
   marker here: a red * at the top-right corner of the box, using Payload's
   own required-star color. The > .field-type__wrap child hop keeps the
   selector from also matching the outer field wrappers. */
.gh-get-help-edit .field-type:has(> .field-type__wrap > input#field-heading),
.gh-get-help-edit .field-type:has(> .field-type__wrap > textarea#field-body) {
  position: relative;
}
.gh-get-help-edit .field-type:has(> .field-type__wrap > input#field-heading)::after,
.gh-get-help-edit .field-type:has(> .field-type__wrap > textarea#field-body)::after {
  color: var(--theme-error-500);
  content: "*";
  font-size: calc(var(--base-body-size, 13) * 1px);
  font-weight: 700;
  line-height: 1;
  position: absolute;
  right: 6px;
  top: -6px;
}
/* Text boxes and textareas. Checkboxes (the "Show assessment call-to-action"
   toggle) keep Payload's own styling, like the checkbox fields on the other
   panels. */
.gh-get-help-edit input:not([type="checkbox"]):not([type="radio"]),
.gh-get-help-edit textarea {
  background: var(--gh-gh-field) !important;
  border: 1px solid var(--gh-gh-field) !important;
  border-radius: 8px !important;
  color: var(--gh-gh-field-text);
}
.gh-get-help-edit input::placeholder,
.gh-get-help-edit textarea::placeholder {
  color: var(--gh-gh-field-text);
  opacity: 0.33;
}
/* Field helper text */
.gh-get-help-edit .field-description {
  color: var(--gh-gh-help);
}

/* Get Help Now live page preview controls and modal. */
.gh-get-help-edit .gh-story-preview-field {
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; margin: 0 0 20px;
}
.gh-get-help-edit .gh-story-preview-launch {
  border: 1px solid #000; border-radius: 6px; background: #00aeef; color: #000;
  padding: 9px 18px; font: inherit; font-weight: 700; cursor: pointer;
}
.gh-get-help-edit .gh-story-preview-launch:hover { background: #28bdf3; }
.gh-get-help-edit .gh-story-preview-hint { color: var(--gh-gh-help); font-size: 1rem; line-height: 1.5; }
.gh-get-help-edit .gh-story-preview-backdrop {
  position: fixed; z-index: 100000; inset: 0; display: flex; align-items: center;
  justify-content: center; padding: 18px; background: rgba(0,0,0,.82);
}
.gh-get-help-edit .gh-story-preview-dialog {
  display: flex; flex-direction: column; width: min(1500px,100%); height: min(94vh,1100px);
  min-height: 0; overflow: hidden; border: 1px solid #55555f; border-radius: 12px;
  background: #25252b; box-shadow: 0 18px 70px rgba(0,0,0,.55);
}
.gh-get-help-edit .gh-story-preview-toolbar {
  display: flex; flex: 0 0 auto; align-items: center; justify-content: space-between;
  gap: 12px; padding: 12px 16px; background: #19191e; color: #f0f0f3;
}
.gh-get-help-edit .gh-story-preview-heading,
.gh-get-help-edit .gh-story-preview-actions { display: flex; align-items: center; gap: 12px; }
.gh-get-help-edit .gh-story-preview-heading { flex-direction: column; align-items: flex-start; gap: 2px; }
.gh-get-help-edit .gh-story-preview-heading strong { font-size: 1rem; }
.gh-get-help-edit .gh-story-preview-heading span { color: #b0b0ba; font-size: .78rem; }
.gh-get-help-edit .gh-story-preview-device-switch {
  display: inline-flex; gap: 3px; padding: 3px; border: 1px solid #55555f; border-radius: 7px;
}
.gh-get-help-edit .gh-story-preview-device-switch button,
.gh-get-help-edit .gh-story-preview-close {
  border: 1px solid transparent; border-radius: 5px; padding: 7px 11px;
  background: transparent; color: #f0f0f3; font: inherit; font-size: .85rem; cursor: pointer;
}
.gh-get-help-edit .gh-story-preview-device-switch button.is-active { background: #00aeef; color: #080808; font-weight: 700; }
.gh-get-help-edit .gh-story-preview-close { border-color: #6b6b75; background: #393940; }
.gh-get-help-edit .gh-story-preview-stage {
  display: flex; flex: 1 1 auto; justify-content: center; min-height: 0; overflow: auto;
  padding: 14px; background: #505057;
}
.gh-get-help-edit .gh-story-preview-frame {
  display: block; flex: 0 0 auto; height: 100%; min-height: 500px; max-width: 100%;
  border: 0; border-radius: 5px; background: #e7d8c3; box-shadow: 0 2px 16px rgba(0,0,0,.28);
}
.gh-get-help-edit .gh-story-preview-stage.is-mobile .gh-story-preview-frame { width: 390px; }
@media (max-width: 640px) {
  .gh-get-help-edit .gh-story-preview-backdrop { padding: 0; }
  .gh-get-help-edit .gh-story-preview-dialog { width: 100%; height: 100%; border: 0; border-radius: 0; }
  .gh-get-help-edit .gh-story-preview-toolbar { align-items: flex-start; flex-direction: column; }
  .gh-get-help-edit .gh-story-preview-actions { width: 100%; justify-content: space-between; }
  .gh-get-help-edit .gh-story-preview-stage { padding: 8px; }
  .gh-get-help-edit .gh-story-preview-frame { min-height: 420px; }
}
`;

type EditViewProps = Parameters<typeof DefaultEditView>[0];

function GetHelpNowEditView(props: EditViewProps) {
  return (
    <div className="gh-get-help-edit">
      <style>{css}</style>
      <DefaultEditView {...props} />
    </div>
  );
}

export default GetHelpNowEditView;
