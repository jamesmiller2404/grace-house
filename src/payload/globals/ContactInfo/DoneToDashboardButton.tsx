"use client";

import { Button, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

/**
 * "Done" button for the Contact Info page — registered in `ContactInfo.ts`
 * under `admin.components.elements.beforeDocumentControls`, which Payload
 * renders inside the document controls bar, immediately to the left of the
 * Save button, so the bar reads "Cancel | Done | Save" — the same bar as the
 * Home Page Layout global and the Events and Hero create/edit pages.
 *
 * A global has no list view to return to (unlike the Events / Hero "Done"
 * buttons), so this one finishes on the admin dashboard (/admin), the page
 * that lists the Contact Info global alongside the collections. Like the
 * Cancel button it is rendered with Payload's own `Button` as a link
 * (el="link"), so the navigation runs through Payload's `Link`: it shows the
 * admin panel's route transition/progress behavior and, if the form has
 * unsaved changes, Payload's "Leave without saving?" confirmation modal pops
 * up before leaving — the exact same protection the sidebar links have.
 */

const DoneToDashboardButton: React.FC = () => {
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
      Done
    </Button>
  );
};

export default DoneToDashboardButton;
