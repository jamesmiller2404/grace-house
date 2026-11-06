"use client";

import { DefaultEditView } from "@payloadcms/ui";
import React from "react";

/**
 * Custom admin Edit view for the Media collection — a thin wrapper around
 * Payload's DefaultEditView that restyles the page to match the Create New
 * Event admin panel mockup:
 *
 *  - page background #111115
 *  - a rounded #2d2d33 "frame" panel around the form fields (the document
 *    header — breadcrumb, Save button — stays on the page background above
 *    the frame, exactly like the mockup)
 *  - text field boxes filled #101012 with #f0f0f3 text/placeholders
 *
 * Those are the DARK scheme. When the admin theme is Light (Payload's
 * Light / Dark / Auto selector in Account -> Settings) the same elements are
 * repainted from the light palette defined in the stylesheet below.
 *
 * All field arrangement lives in `src/payload/collections/Media.ts`; this
 * component only provides the paint. Payload's save/validate/versioning flow
 * is untouched.
 */

/**
 * Scoped under `.gh-media-edit` so it never leaks into the rest of the admin
 * panel.
 */
const css = `
/* The Media form palette. The values on .gh-media-edit are the DARK scheme
   (the original mockup); the html[data-theme='light'] block below repaints
   the same variables for the Light theme. */
.gh-media-edit {
  --gh-ev-bg: #111115; /* page background */
  --gh-ev-frame: #2d2d33; /* the rounded form frame */
  --gh-ev-field: #101012; /* text field boxes */
  --gh-ev-field-text: #f0f0f3; /* text typed into the fields */
  --gh-ev-text: #f0f0f3; /* labels, general text */
  --gh-ev-help: #9d9da4; /* field helper text */
  background: var(--gh-ev-bg);
  min-height: 100%;
  padding-bottom: 40px;
}

html[data-theme='light'] .gh-media-edit {
  --gh-ev-bg: #bab3d2;
  --gh-ev-frame: #bbc0ff;
  --gh-ev-field: #8787a9;
  --gh-ev-field-text: #525267;
  --gh-ev-text: #000000;
  --gh-ev-help: #525267;
}

/* The rounded frame that holds every form field. The document meta
   (breadcrumb, Save) renders above this wrapper, so it stays on the page
   background like the mockup. */
.gh-media-edit .collection-edit__main-wrapper {
  background: var(--gh-ev-frame);
  border-radius: 16px;
  margin-top: 12px;
  padding: 28px;
}

.gh-media-edit .field-label {
  color: var(--gh-ev-text);
}

/* Field helper text */
.gh-media-edit .field-description {
  color: var(--gh-ev-help);
}
`;

type EditViewProps = Parameters<typeof DefaultEditView>[0];

function MediaEditView(props: EditViewProps) {
  return (
    <div className="gh-media-edit">
      <style>{css}</style>
      <DefaultEditView {...props} />
    </div>
  );
}

export default MediaEditView;
