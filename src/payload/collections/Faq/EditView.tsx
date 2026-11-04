"use client";

import { DefaultEditView } from "@payloadcms/ui";
import React from "react";

/**
 * Custom admin Edit view for the Faq (Common Questions) collection — a thin
 * wrapper around Payload's DefaultEditView that restyles the page to match
 * `photoshop_assets/adminPanelMockup1.png`:
 *
 *  - page background #111115
 *  - a rounded #2d2d33 "frame" panel around the form fields (the document
 *    header — breadcrumb, Last Modified / Created times, Save button — stays
 *    on the page background above the frame, exactly like the mockup)
 *  - text field boxes and textareas filled #101012 with #f0f0f3 text /
 *    placeholders
 *  - placeholder-only look for required fields (label: false in Faq.ts), so no
 *    red asterisk renders next to the boxes
 *
 * Those are the DARK scheme. When the admin theme is Light (Payload's Light /
 * Dark / Auto selector in Account -> Settings) the same elements are repainted
 * from the light palette defined in the stylesheet below.
 *
 * This mirrors src/payload/collections/Events/EditView.tsx, minus the pieces
 * that only exist on the Events form (Status dropdown, upload image field,
 * required-field red markers). Field arrangement (which fields hide their
 * labels, placeholder text) lives in `src/payload/collections/Faq.ts`; this
 * component only provides the paint. Payload's save/validate/versioning flow
 * is untouched.
 */

/**
 * Scoped under `.gh-faq-edit` so it never leaks into the rest of the admin
 * panel. !important is needed on the input rules to beat the inline styles
 * Payload applies to its text inputs and textareas.
 */
const css = `
/* The Faq form palette. The values on .gh-faq-edit are the DARK scheme
   (the original mockup); the html[data-theme='light'] block below repaints
   the same variables for the Light theme. */
.gh-faq-edit {
  --gh-faq-bg: #111115; /* page background */
  --gh-faq-frame: #2d2d33; /* the rounded form frame */
  --gh-faq-field: #101012; /* text field boxes / textareas */
  --gh-faq-field-text: #f0f0f3; /* text typed into the fields */
  --gh-faq-text: #f0f0f3; /* labels, general text */
  --gh-faq-help: #9d9da4; /* field helper text */
  background: var(--gh-faq-bg);
  min-height: 100%;
  padding-bottom: 40px;
}
html[data-theme='light'] .gh-faq-edit {
  --gh-faq-bg: #bab3d2;
  --gh-faq-frame: #bbc0ff;
  --gh-faq-field: #8787a9;
  --gh-faq-field-text: #525267;
  --gh-faq-text: #000000;
  --gh-faq-help: #525267;
}
/* The rounded frame that holds every form field. The document meta
   (breadcrumb, Last Modified / Created, Save) renders above this wrapper,
   so it stays on the page background like the mockup. */
.gh-faq-edit .collection-edit__main-wrapper {
  background: var(--gh-faq-frame);
  border-radius: 16px;
  margin-top: 12px;
  padding: 28px;
}
.gh-faq-edit .field-label {
  color: var(--gh-faq-text);
}
/* Text boxes and textareas */
.gh-faq-edit input:not([type="checkbox"]):not([type="radio"]),
.gh-faq-edit textarea {
  background: var(--gh-faq-field) !important;
  border: 1px solid var(--gh-faq-field) !important;
  border-radius: 8px !important;
  color: var(--gh-faq-field-text);
}
.gh-faq-edit input::placeholder,
.gh-faq-edit textarea::placeholder {
  color: var(--gh-faq-field-text);
  opacity: 0.33;
}
/* Rich text editor (Lexical) — paint the editor area and its wrapping frame
   to match the input boxes, so the "Answer" field clearly looks like a
   text box the user can type into, with rich text formatting controls
   (bold, italic, lists, links, etc.) available via the floating toolbar.

   Payload's Lexical editor DOM:
     .rich-text-lexical__wrap   — outer wrapper of the whole field
     .editor-container          — the editor frame container
     .editor-scroller           — inner scroller
     .editor                    — the editor itself
     .ContentEditable__root     — the actual contenteditable typing area
     .LexicalEditorTheme__placeholder — the "Start typing" placeholder
     .fixed-toolbar             — floating formatting toolbar
     .inline-toolbar-popup      — inline popup toolbar (appears on selection)
*/
.gh-faq-edit .rich-text-lexical__wrap {
  /* Give the rich text field a visible box like the text inputs above it. */
  background: var(--gh-faq-field) !important;
  border: 1px solid var(--gh-faq-field) !important;
  border-radius: 8px !important;
  padding: 8px !important;
  box-sizing: border-box;
}
.gh-faq-edit .editor-container,
.gh-faq-edit .editor-scroller,
.gh-faq-edit .editor {
  background: transparent !important;
  border: none !important;
}
/* The actual typing area — filled like a text box. */
.gh-faq-edit .ContentEditable__root {
  background: var(--gh-faq-field) !important;
  border: none !important;
  border-radius: 6px !important;
  color: var(--gh-faq-field-text);
  min-height: 200px;
  padding: 12px !important;
  outline: none !important;
}
.gh-faq-edit .LexicalEditorTheme__placeholder {
  color: var(--gh-faq-field-text);
  opacity: 0.33;
}
/* Floating rich-text formatting toolbar (bold, italic, lists, link, etc.) —
   repaint for the dark theme so the controls are visible and usable. */
.gh-faq-edit .fixed-toolbar {
  background: var(--gh-faq-field) !important;
  border: 1px solid var(--gh-faq-field) !important;
  border-radius: 6px !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3) !important;
}
.gh-faq-edit .fixed-toolbar button,
.gh-faq-edit .fixed-toolbar [role="button"] {
  color: var(--gh-faq-field-text) !important;
}
.gh-faq-edit .fixed-toolbar button:hover,
.gh-faq-edit .fixed-toolbar [role="button"]:hover {
  background: var(--gh-elevation-300, #414141) !important;
}
.gh-faq-edit .fixed-toolbar button.active,
.gh-faq-edit .fixed-toolbar [role="button"].active {
  background: var(--gh-elevation-200, #343434) !important;
}
/* Inline popup toolbar that appears when text is selected. */
.gh-faq-edit .inline-toolbar-popup {
  background: var(--gh-faq-field) !important;
  border: 1px solid var(--gh-faq-field) !important;
  border-radius: 6px !important;
  box-shadow: 0 1px 2px 1px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.1) !important;
}
.gh-faq-edit .inline-toolbar-popup button,
.gh-faq-edit .inline-toolbar-popup [role="button"] {
  color: var(--gh-faq-field-text) !important;
}
/* Field helper text */
.gh-faq-edit .field-description {
  color: var(--gh-faq-help);
}
`;

type EditViewProps = Parameters<typeof DefaultEditView>[0];

function FaqEditView(props: EditViewProps) {
  return (
    <div className="gh-faq-edit">
      <style>{css}</style>
      <DefaultEditView {...props} />
    </div>
  );
}

export default FaqEditView;
