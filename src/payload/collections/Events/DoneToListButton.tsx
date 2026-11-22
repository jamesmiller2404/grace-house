"use client";

import { useSearchParams } from "next/navigation";
import { Button, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

/**
 * "Done" button for the Events create/edit pages — registered in
 * `Events.ts` under `admin.components.edit.beforeDocumentControls`, which
 * Payload renders inside the document controls bar, immediately to the
 * left of the Save button (the same bar on both the "Create New Event"
 * and the edit page, since both use the default Edit view).
 *
 * Clicking it takes the user back to the Events list — the page that
 * shows every event in the collection (/admin/collections/events). Like
 * the Cancel button it is rendered with Payload's own `Button` as a link
 * (el="link"), so the navigation runs through Payload's `Link`: it shows
 * the admin panel's route transition/progress behavior and, if the form
 * has unsaved changes, Payload's "Leave without saving?" confirmation
 * modal pops up before leaving — the exact same protection the sidebar
 * links have.
 */

const DoneToListButton: React.FC = () => {
  const { config } = useConfig();
  const searchParams = useSearchParams();
  const fromDashboard = searchParams.get("from") === "dashboard";

  const targetURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: fromDashboard ? "/" : "/collections/events",
  });

  return (
    <Button buttonStyle="secondary" el="link" to={targetURL}>
      Done
    </Button>
  );
};

export default DoneToListButton;
