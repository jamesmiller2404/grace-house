"use client";

import { DefaultEditView } from "@payloadcms/ui";
import React from "react";

/**
 * Custom admin Edit view for the Contact Info global — a thin wrapper around
 * Payload's DefaultEditView that restyles the page with the same palette the
 * other admin panels use (photoshop_assets/adminPanelMockup1.png and
 * adminPanelMockup1_homePageLayout.png):
 *
 *  - page background #111115
 *  - each contact row of the "Phone Numbers" / "Emails" / "Addresses" lists is
 *    a rounded #2d2d33 card with a #414141 header strip (the drag handle, the
 *    "1. Office — (916) 470-0408" name and the row's "..." / collapse
 *    controls), exactly like a row of the Home Page Layout panel
 *  - the Label / Phone Number / Email Address / Address boxes are filled
 *    #101012
 *
 * Those are the DARK scheme, taken from the Home Page Layout global
 * (src/payload/globals/HomeLayout/EditView.tsx) and the collection
 * create/edit pages (e.g. src/payload/collections/GetHelpNow/EditView.tsx),
 * so this page matches the rest of the panel. When the admin theme is Light
 * (Payload's Light / Dark / Auto selector in Account -> Settings) the same
 * elements are repainted from the light palette below.
 *
 * Contact Info is a page of lists, so it takes the Home Page Layout treatment
 * (rows as cards on the page background) rather than the rounded form frame
 * the field-based pages use. Field arrangement (the three lists, their row
 * labels and helper text) lives in `src/payload/globals/ContactInfo.ts`; this
 * component only provides the paint. Payload's drag-to-reorder, Move Up /
 * Move Down and save flow are untouched.
 */

/**
 * Scoped under `.gh-contact-info-edit` so it never leaks into the rest of the
 * admin panel. !important is needed on the input rules to beat the inline
 * styles Payload applies to its text inputs.
 */
const css = `
/* The Contact Info palette. The values on .gh-contact-info-edit are the DARK
   scheme (the original mockup); the html[data-theme='light'] block below
   repaints the same variables for the Light theme. */
.gh-contact-info-edit {
  --gh-ci-bg: #111115; /* page background */
  --gh-ci-card: #2d2d33; /* each contact row card */
  --gh-ci-card-header: #414141; /* the card's header strip */
  --gh-ci-field: #101012; /* the Label / value boxes */
  --gh-ci-field-text: #f0f0f3; /* text typed into the boxes */
  --gh-ci-text: #f0f0f3; /* list titles, field labels, menu options */
  --gh-ci-hover: #414141; /* the card header's hover fill */
  --gh-ci-help: #9d9da4; /* field helper text, "Add ..." buttons */
  background: var(--gh-ci-bg);
  min-height: 100%;
  padding-bottom: 40px;
}
html[data-theme='light'] .gh-contact-info-edit {
  --gh-ci-bg: #bab3d2;
  --gh-ci-card: #bbc0ff;
  --gh-ci-card-header: #8787a9;
  --gh-ci-field: #8787a9;
  --gh-ci-field-text: #525267;
  --gh-ci-text: #000000;
  --gh-ci-hover: #8787a9;
  --gh-ci-help: #525267;
}
/* The list titles ("Phone Numbers", "Emails", "Addresses") — kept, since they
   are what tells the three lists apart on this page. */
.gh-contact-info-edit .array-field__title {
  color: var(--gh-ci-text);
}
/* Each contact row is a rounded card. The array row IS the Collapsible, so
   .array-field__row and .collapsible land on the same element. */
.gh-contact-info-edit .array-field__draggable-rows {
  gap: 24px;
}
.gh-contact-info-edit .array-field__row.collapsible {
  background: var(--gh-ci-card);
  /* The mockup outlines each card with a 1px edge in the card's own body
     colour, so the #414141 header strip is inset by a single pixel. Using the
     card colour (rather than removing the border) also overrides the default
     .collapsible--style-default border and its hover border. */
  border: 1px solid var(--gh-ci-card);
  border-radius: 14px;
}
/* Header strip (drag handle, the "1. Office — (916) 470-0408" label, the
   row's "..." menu and the collapse chevron). */
.gh-contact-info-edit .array-field__row .collapsible__toggle-wrap {
  background: var(--gh-ci-card-header);
  border-top-left-radius: 13px;
  border-top-right-radius: 13px;
}
.gh-contact-info-edit .array-field__row .collapsible__toggle-wrap:not(.toggle-disabled):hover {
  background: var(--gh-ci-hover);
}
/* A collapsed row shows only its header, so that needs the bottom corners too. */
.gh-contact-info-edit .array-field__row.collapsible--collapsed .collapsible__toggle-wrap {
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
}
/* Row body (the Label box and the phone number / email / address box). The
   content sits inside an AnimateHeight wrapper, so it is a descendant rather
   than a direct child of the row. */
.gh-contact-info-edit .array-field__row .collapsible__content {
  background: var(--gh-ci-card);
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
}
.gh-contact-info-edit .array-field__row .row-label,
.gh-contact-info-edit .field-label {
  color: var(--gh-ci-text);
}
/* The Label / value boxes. Checkboxes and radios keep Payload's own styling,
   like the checkbox fields on the other panels. */
.gh-contact-info-edit input:not([type="checkbox"]):not([type="radio"]),
.gh-contact-info-edit textarea {
  background: var(--gh-ci-field) !important;
  border: 1px solid var(--gh-ci-field) !important;
  border-radius: 8px !important;
  color: var(--gh-ci-field-text);
}
.gh-contact-info-edit input::placeholder,
.gh-contact-info-edit textarea::placeholder {
  color: var(--gh-ci-field-text);
  opacity: 0.33;
}
/* "Add Phone Number" / "Add Email" / "Add Address" buttons below each list. */
.gh-contact-info-edit .array-field__add-row.btn {
  --btn-color: var(--gh-ci-help);
}
/* Field helper text ("What this number is for — e.g. ..."). */
.gh-contact-info-edit .field-description {
  color: var(--gh-ci-help);
}
`;

type EditViewProps = Parameters<typeof DefaultEditView>[0];

function ContactInfoEditView(props: EditViewProps) {
  return (
    <div className="gh-contact-info-edit">
      <style>{css}</style>
      <DefaultEditView {...props} />
    </div>
  );
}

export default ContactInfoEditView;
