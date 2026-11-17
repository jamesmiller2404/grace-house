"use client";

import { Button, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

/** Return to the Media Lists collection after completing the form. */
const MediaListsDoneButton: React.FC = () => {
  const { config } = useConfig();

  const mediaListsURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/media-lists",
  });

  return (
    <Button buttonStyle="secondary" el="link" to={mediaListsURL}>
      Done
    </Button>
  );
};

export default MediaListsDoneButton;
