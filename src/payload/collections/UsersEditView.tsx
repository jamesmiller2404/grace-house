"use client";

import { DefaultEditView } from "@payloadcms/ui";
import React from "react";

/**
 * Custom admin Edit view for the Users collection — a thin wrapper around
 * Payload's DefaultEditView that restyles the page to match the Create New
 * Event admin panel mockup:
 *
 *  - page background #111115
 *  - a rounded #2d2d33 "frame" panel around the form fields (the document
 *    header — breadcrumb, Save button — stays on the page background above
 *    the frame, exactly like the mockup)
 *  - text field boxes filled #101012 with #f0f0f3 text/placeholders
 *  - select dropdowns (Role) filled #101012 with a #222222 options menu
 *
 * Those are the DARK scheme. When the admin theme is Light (Payload's
 * Light / Dark / Auto selector in Account -> Settings) the same elements are
 * repainted from the light palette defined in the stylesheet below.
 *
 * All field arrangement (which fields share a row, placeholder text, hidden
 * labels) lives in `src/payload/collections/Users.ts`; this component only
 * provides the paint. Payload's save/validate/versioning flow is untouched.
 */

/**
 * Scoped under `.gh-user-edit` so it never leaks into the rest of the admin
 * panel.
 */
const css = `
/* The Users form palette. The values on .gh-user-edit are the DARK scheme
   (the original mockup); the html[data-theme='light'] block below repaints
   the same variables for the Light theme. */
.gh-user-edit {
  --gh-ev-bg: #141118; /* page background */
  --gh-ev-frame: #1d1825; /* the rounded form frame */
  --gh-ev-field: #100d14; /* text field boxes */
  --gh-ev-field-text: #f6f3eb; /* text typed into the fields */
  --gh-ev-text: #f6f3eb; /* labels, menu options, general text */
  --gh-ev-menu: #241f2d; /* Role dropdown options menu */
  --gh-ev-hover: #32243f; /* dropdown hover / current option */
  --gh-ev-upload: #261e32; /* buttons */
  --gh-ev-help: #b8afc4; /* field helper text */
  background: var(--gh-ev-bg);
  min-height: 100%;
  padding-bottom: 40px;
}

html[data-theme='light'] .gh-user-edit {
  --gh-ev-bg: #bab3d2;
  --gh-ev-frame: #bbc0ff;
  --gh-ev-field: #8787a9;
  --gh-ev-field-text: #525267;
  --gh-ev-text: #000000;
  --gh-ev-menu: #bbc0ff;
  --gh-ev-hover: #8787a9;
  --gh-ev-upload: #717dbc;
  --gh-ev-help: #525267;
}

/* The rounded frame that holds every form field. The document meta
   (breadcrumb, Save) renders above this wrapper, so it stays on the page
   background like the mockup. */
.gh-user-edit .collection-edit__main-wrapper {
  background: var(--gh-ev-frame);
  border: 1px solid var(--gh-border-subtle, #312a3d);
  box-shadow: 0 8px 30px rgba(6, 4, 10, 0.4);
  border-radius: 16px;
  margin-top: 12px;
  padding: 28px;
}

.gh-user-edit .field-label {
  color: var(--gh-ev-text);
}

/* Select dropdown (Role) layout: label to the left, dropdown filling the
   remaining space. Unlayered styles beat Payload's @layer payload-default. */
.gh-user-edit .field-type.select {
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: calc(var(--base, 16px) * 0.5);
}

.gh-user-edit .field-type.select > .field-label {
  margin-bottom: 0;
  flex-shrink: 0;
  white-space: nowrap;
}

.gh-user-edit .field-type.select > .field-type__wrap {
  flex: 1 1 auto;
  min-width: 0;
}

/* Field helper text */
.gh-user-edit .field-description {
  color: var(--gh-ev-help);
}
`;

type EditViewProps = Parameters<typeof DefaultEditView>[0];

function UsersEditView(props: EditViewProps) {
  return (
    <div className="gh-user-edit">
      <style>{css}</style>
      <DefaultEditView {...props} />
    </div>
  );
}

export default UsersEditView;
