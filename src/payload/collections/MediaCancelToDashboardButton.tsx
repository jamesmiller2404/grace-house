"use client";

import { Button } from "@payloadcms/ui";
import React from "react";

/**
 * "Cancel" button for the Media create/edit pages — registered in
 * `Media.ts` under `admin.components.edit.beforeDocumentControls`, which
 * Payload renders inside the document controls bar, immediately to the
 * left of the Save button.
 *
 * Clicking it shows a confirmation dialog, then uses the browser's back
 * navigation to return the user to the screen they came from (typically the
 * Media collection list view), rather than always jumping to the admin
 * dashboard.
 */
const MediaCancelToDashboardButton: React.FC = () => {
  const handleClick = () => {
    if (
      !window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page?",
      )
    ) {
      return;
    }
    window.history.back();
  };

  return (
    <Button buttonStyle="secondary" onClick={handleClick}>
      Cancel
    </Button>
  );
};

export default MediaCancelToDashboardButton;
