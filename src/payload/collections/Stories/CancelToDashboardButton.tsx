"use client";

import { Button, useConfig } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import React from "react";

const CancelToDashboardButton: React.FC = () => {
  const { config } = useConfig();
  const router = useRouter();

  // Always return to the Lives Changed collection list.
  const storiesListURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/stories",
  });

  const handleClick = () => {
    const shouldLeave = window.confirm(
      "You have unsaved changes. Are you sure you want to leave this page?",
    );

    if (shouldLeave) {
      router.push(storiesListURL);
    }
  };

  return (
    <Button buttonStyle="secondary" onClick={handleClick}>
      Cancel
    </Button>
  );
};

export default CancelToDashboardButton;