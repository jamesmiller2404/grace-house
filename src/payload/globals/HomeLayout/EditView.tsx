"use client";

import { DefaultEditView } from "@payloadcms/ui";
import React from "react";

/**
 * Custom admin Edit view for the Home Page Layout global — a thin wrapper
 * around Payload's DefaultEditView that restyles the page to match
 * `photoshop_assets/adminPanelMockup1_homePageLayout.png`:
 *
 *  - page background #111115
 *  - each row of the "sections" array is a rounded #2d2d33 card with a
 *    #414141 header strip (the drag handle, the "1. Hero" name and the row's
 *    "..." / collapse controls)
 *  - the "Section" dropdown boxes are filled #101012 with a #222222 options
 *    menu
 *
 * Those are the DARK scheme, taken from the Events and Hero create/edit pages
 * (src/payload/collections/Events/EditView.tsx and
 * src/payload/collections/Hero/EditView.tsx). When the admin theme is Light
 * (Payload's Light / Dark / Auto selector in Account -> Settings) the same
 * elements are repainted from the light palette below.
 *
 * Field arrangement (the Section dropdown, the "Show on home page" checkbox,
 * their helper text and the row labels) lives in
 * `src/payload/globals/HomeLayout.ts`; this component only provides the paint.
 * Payload's drag-to-reorder, Move Up / Move Down and save flow are untouched.
 */

/**
 * Scoped under `.gh-home-layout-edit` so it never leaks into the rest of the
 * admin panel.
 */
const css = `
/* The Home Page Layout palette. The values on .gh-home-layout-edit are the
   DARK scheme (the original mockup); the html[data-theme='light'] block below
   repaints the same variables for the Light theme. */
.gh-home-layout-edit {
  --gh-hl-bg: #141118; /* page background */
  --gh-hl-card: #1d1825; /* each section row card */
  --gh-hl-card-header: #261e32; /* the card's header strip */
  --gh-hl-field: #100d14; /* the Section dropdown box */
  --gh-hl-field-text: #f6f3eb; /* text inside the dropdown */
  --gh-hl-text: #f6f3eb; /* row labels, menu options */
  --gh-hl-menu: #241f2d; /* dropdown options menu */
  --gh-hl-hover: #32243f; /* dropdown hover / current option */
  --gh-hl-help: #b8afc4; /* field helper text */
  background: var(--gh-hl-bg);
  min-height: 100%;
  padding-bottom: 40px;
}
html[data-theme='light'] .gh-home-layout-edit {
  --gh-hl-bg: #bab3d2;
  --gh-hl-card: #bbc0ff;
  --gh-hl-card-header: #8787a9;
  --gh-hl-field: #8787a9;
  --gh-hl-field-text: #525267;
  --gh-hl-text: #000000;
  --gh-hl-menu: #bbc0ff;
  --gh-hl-hover: #8787a9;
  --gh-hl-help: #525267;
}
/* The mockup shows no "Sections" heading above the list — only the
   Collapse All / Show All controls on the right of the header. */
.gh-home-layout-edit .array-field__title {
  display: none;
}
/* Each section row is a rounded card. The array row IS the Collapsible, so
   .array-field__row and .collapsible land on the same element. */
.gh-home-layout-edit .array-field__draggable-rows {
  gap: 24px;
}
.gh-home-layout-edit .array-field__row.collapsible {
  background: var(--gh-hl-card);
  border: 1px solid var(--gh-border-subtle, #312a3d);
  box-shadow: 0 4px 16px rgba(6, 4, 10, 0.25);
  border-radius: 14px;
  /* Deliberately NO overflow: hidden here — the "Section" select renders its
     options menu inline (react-select, no portal), so clipping the card cuts
     the dropdown off after the first few options. The rounded corners are
     painted on the header and body below instead (14px card radius minus its
     1px border). */
}
/* Header strip (drag handle, the "1. Hero" label, the row's "..." menu and
   the collapse chevron). */
.gh-home-layout-edit .array-field__row .collapsible__toggle-wrap {
  background: var(--gh-hl-card-header);
  border-bottom: 1px solid var(--gh-border-subtle, #312a3d);
  border-top-left-radius: 13px;
  border-top-right-radius: 13px;
}
.gh-home-layout-edit .array-field__row .collapsible__toggle-wrap:not(.toggle-disabled):hover {
  background: var(--gh-hl-hover);
}
/* A collapsed row shows only its header, so that needs the bottom corners too. */
.gh-home-layout-edit .array-field__row.collapsible--collapsed .collapsible__toggle-wrap {
  border-bottom: none;
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
}
/* Row body (the Section dropdown + the "Show on home page" checkbox). The
   content sits inside an AnimateHeight wrapper, so it is a descendant rather
   than a direct child of the row. */
.gh-home-layout-edit .array-field__row .collapsible__content {
  background: var(--gh-hl-card);
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
}
.gh-home-layout-edit .array-field__row .row-label,
.gh-home-layout-edit .field-label {
  color: var(--gh-hl-text);
}
/* The Section dropdown — react-select "rs__" classes, like the Events Status
   dropdown and the Intro color dropdowns. */
.gh-home-layout-edit .rs__control {
  background: var(--gh-hl-field);
  border: 1px solid var(--gh-border-subtle, #312a3d);
  border-radius: 8px;
  color: var(--gh-hl-field-text);
}
.gh-home-layout-edit .rs__control:hover,
.gh-home-layout-edit .rs__control--is-focused {
  border-color: var(--gh-accent, #c9a45c) !important;
  box-shadow: 0 0 0 1px var(--gh-accent, #c9a45c) !important;
}
.gh-home-layout-edit .rs__single-value,
.gh-home-layout-edit .rs__placeholder,
.gh-home-layout-edit .rs__indicator {
  color: var(--gh-hl-field-text);
}
.gh-home-layout-edit .rs__menu {
  background: var(--gh-hl-menu);
  border: 1px solid var(--gh-border-subtle, #312a3d);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(6, 4, 10, 0.4);
}
.gh-home-layout-edit .rs__option {
  color: var(--gh-hl-text);
}
.gh-home-layout-edit .rs__option--is-focused,
.gh-home-layout-edit .rs__option--is-selected {
  background: var(--gh-hl-hover);
  color: #c9a45c;
}
/* "Add Section" button below the cards. */
.gh-home-layout-edit .array-field__add-row.btn {
  --btn-color: var(--gh-accent, #c9a45c);
  border-color: var(--gh-border-subtle, #312a3d);
}
.gh-home-layout-edit .array-field__add-row.btn:hover {
  border-color: var(--gh-accent, #c9a45c);
}
/* Field helper text ("Which home page section this row controls." / "Untick to
   hide this section without removing it from the order."). */
.gh-home-layout-edit .field-description {
  color: var(--gh-hl-help);
}
`;

type EditViewProps = Parameters<typeof DefaultEditView>[0];

function HomeLayoutEditView(props: EditViewProps) {
  return (
    <div className="gh-home-layout-edit">
      <style>{css}</style>
      <DefaultEditView {...props} />
    </div>
  );
}

export default HomeLayoutEditView;
