
"use client";

import { Button, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

const DoneToListButton: React.FC = () => {
  const { config } = useConfig();

  const boardListURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/board",
  });

  return (
    <Button buttonStyle="secondary" el="link" to={boardListURL}>
      Done
    </Button>
  );
};

export default DoneToListButton;
