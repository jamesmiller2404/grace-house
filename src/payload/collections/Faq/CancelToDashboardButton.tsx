"use client";

import { Button, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

/**
 * "Cancel" button for the Faq (Common Questions) create/edit pages — registered in
 * `Faq.ts` under `admin.components.edit.beforeDocumentControls`, which Payload
 * renders inside the document controls bar, immediately to the left of the Save
 * button, so the bar reads "Cancel | Done | Save" — the same bar as the Events
 * and Custom Pages create/edit pages.
 *
 * Clicking it takes the user back to the Common Questions list — the page
 * that shows every question in the collection (/admin/collections/faq). The
 * button is rendered with Payload's own `Button` as a link (el="link"), so
 * the navigation runs through Payload's `Link`: it shows the admin panel's
 * route transition/progress behavior and, if the form has unsaved changes,
 * Payload's "Leave without saving?" confirmation modal pops up before
 * leaving — the exact same protection the sidebar links have. When there
 * are no unsaved changes, the navigation happens immediately with no
 * confirmation prompt.
 */

const CancelToDashboardButton: React.FC = () => {
  const { config } = useConfig();

  // The collection list view lives at routes.admin ("/admin") joined with
  // the collection's own route ("/collections/faq"), combined onto
  // serverURL via formatAdminURL — the same helper Payload's own list
  // navigation builds.
  const faqListURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/faq",
  });

  return (
    <Button buttonStyle="secondary" el="link" to={faqListURL}>
      Cancel
    </Button>
  );
};

export default CancelToDashboardButton;
