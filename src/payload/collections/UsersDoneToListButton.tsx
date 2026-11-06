"use client";

import { Button, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

/**
 * "Done" button for the Users create/edit pages — registered in
 * `Users.ts` under `admin.components.edit.beforeDocumentControls`, which
 * Payload renders inside the document controls bar, immediately to the
 * left of the Save button.
 *
 * Clicking it takes the user back to the Users list — the page that
 * shows every user in the collection (/admin/collections/users). Like
 * the Cancel button it is rendered with Payload's own `Button` as a link
 * (el="link"), so the navigation runs through Payload's `Link`: it shows
 * the admin panel's route transition/progress behavior and, if the form
 * has unsaved changes, Payload's "Leave without saving?" confirmation
 * modal pops up before leaving — the exact same protection the sidebar
 * links have.
 */
const UsersDoneToListButton: React.FC = () => {
  const { config } = useConfig();

  // The collection list view lives at routes.admin ("/admin") joined with
  // the collection's own route ("/collections/users"), combined onto
  // serverURL via formatAdminURL — the same helper Payload's own list
  // navigation builds.
  const usersListURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/users",
  });

  return (
    <Button buttonStyle="secondary" el="link" to={usersListURL}>
      Done
    </Button>
  );
};

export default UsersDoneToListButton;
