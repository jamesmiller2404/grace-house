"use client";

import { Button, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

const CancelToDashboardButton: React.FC = () => {
  const { config } = useConfig();

  const mediaTagsListURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/media-tags",
  });

  return (
    <Button buttonStyle="secondary" el="link" to={mediaTagsListURL}>
      Cancel
    </Button>
  );
};

export default CancelToDashboardButton;
