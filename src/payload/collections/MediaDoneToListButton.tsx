"use client";

import { Button, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

/**
 * "Done" button for the Media create/edit pages — registered in
 * `Media.ts` under `admin.components.edit.beforeDocumentControls`, which
 * Payload renders inside the document controls bar, immediately to the
 * left of the Save button.
 *
 * Clicking it takes the user back to the Media list — the page that
 * shows every media item in the collection (/admin/collections/media).
 */
const MediaDoneToListButton: React.FC = () => {
  const { config } = useConfig();

  const mediaListURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/media",
  });

  return (
    <Button buttonStyle="secondary" el="link" to={mediaListURL}>
      Done
    </Button>
  );
};

export default MediaDoneToListButton;
