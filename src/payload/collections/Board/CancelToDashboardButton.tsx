
"use client";

import { Button, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

const CancelToDashboardButton: React.FC = () => {
  const { config } = useConfig();

  const boardListURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/board",
  });

  return (
    <Button buttonStyle="secondary" el="link" to={boardListURL}>
      Cancel
    </Button>
  );
};

export default CancelToDashboardButton;
