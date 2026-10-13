"use client";

import { Button, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

/**
 * "Cancel" button for the Stories create/edit page — registered in `Stories.ts`
 * under `admin.components.edit.beforeDocumentControls`, which Payload renders
 * inside the document controls bar, immediately to the left of the Save
 * button, so the bar reads "Cancel | Done | Save" — the same bar as the Events
 * and Intro create/edit pages.
 *
 * Clicking it navigates to the admin dashboard (/admin). The button is
 * rendered with Payload's own `Button` as a link (el="link"), so the
 * navigation runs through Payload's `Link`: it shows the admin panel's
 * route transition/progress behavior and, if the form has unsaved
 * changes, Payload's "Leave without saving?" confirmation modal pops up
 * before leaving — the exact same protection the sidebar links have.
 */

const CancelToDashboardButton: React.FC = () => {
  const { config } = useConfig();

  // Same URL Payload's own "back to dashboard" navigation builds:
  // routes.admin ("/admin") joined onto serverURL via formatAdminURL.
  const dashboardURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "",
  });

  return (
    <Button buttonStyle="secondary" el="link" to={dashboardURL}>
      Cancel
    </Button>
  );
};

export default CancelToDashboardButton;
