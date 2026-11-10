"use client";

import { Button, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

/**
 * "Cancel" button for the Media create/edit pages — registered in
 * `Media.ts` under `admin.components.edit.beforeDocumentControls`, which
 * Payload renders inside the document controls bar, immediately to the
 * left of the Save button.
 *
 * Clicking it takes the user back to the Media list — the page that shows
 * every uploaded file in the collection (/admin/collections/media). The
 * button is rendered with Payload's own `Button` as a link (el="link"), so
 * the navigation runs through Payload's `Link`: it shows the admin panel's
 * route transition/progress behavior and, if the form has unsaved changes,
 * Payload's "Leave without saving?" confirmation modal pops up before
 * leaving — the exact same protection the sidebar links have. When there
 * are no unsaved changes, the navigation happens immediately with no
 * confirmation prompt.
 */
const MediaCancelToDashboardButton: React.FC = () => {
  const { config } = useConfig();

  // The collection list view lives at routes.admin ("/admin") joined with
  // the collection's own route ("/collections/media"), combined onto
  // serverURL via formatAdminURL — the same helper Payload's own list
  // navigation builds.
  const mediaListURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/media",
  });

  return (
    <Button buttonStyle="secondary" el="link" to={mediaListURL}>
      Cancel
    </Button>
  );
};

export default MediaCancelToDashboardButton;
