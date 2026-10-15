"use client";

import { Button, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

/**
 * "Done" button for the Get Help Now edit page — registered in
 * `GetHelpNow.ts` under `admin.components.edit.beforeDocumentControls`, which
 * Payload renders inside the document controls bar, immediately to the left
 * of the Save button, so the bar reads "Cancel | Done | Save" — the same bar
 * as the Events and Hero create/edit pages.
 *
 * Clicking it takes the user back to the Get Help Now list — the page that
 * shows every Get Help Now document in the collection
 * (/admin/collections/get-help-now). Like the Cancel button it is rendered
 * with Payload's own `Button` as a link (el="link"), so the navigation runs
 * through Payload's `Link`: it shows the admin panel's route
 * transition/progress behavior and, if the form has unsaved changes,
 * Payload's "Leave without saving?" confirmation modal pops up before
 * leaving — the exact same protection the sidebar links have.
 */

const DoneToListButton: React.FC = () => {
  const { config } = useConfig();

  // The collection list view lives at routes.admin ("/admin") joined with
  // the collection's own route ("/collections/get-help-now"), combined onto
  // serverURL via formatAdminURL — the same helper Payload's own list
  // navigation builds.
  const getHelpNowListURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/get-help-now",
  });

  return (
    <Button buttonStyle="secondary" el="link" to={getHelpNowListURL}>
      Done
    </Button>
  );
};

export default DoneToListButton;
