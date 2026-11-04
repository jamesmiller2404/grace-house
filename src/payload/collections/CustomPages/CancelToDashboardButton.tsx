"use client";

import { Button } from "@payloadcms/ui";
import React from "react";

/**
 * "Cancel" button for the Custom Pages create/edit page — registered in
 * `CustomPages.ts` under `admin.components.edit.beforeDocumentControls`,
 * which Payload renders inside the document controls bar, immediately to the
 * left of the Save button, so the bar reads "Cancel | Done | Save" — the
 * same bar as the Events and Hero create/edit pages.
 *
 * Clicking it shows a confirmation dialog, then uses the browser's back
 * navigation to return the user to the screen they came from (typically the
 * collection list view), rather than always jumping to the admin dashboard.
 * This matches user expectations for a "Cancel" button: go back to where you
 * were, not to the dashboard.
 *
 * If the user confirms, navigation proceeds via window.history.back(). If they
 * cancel, they stay on the current edit page. The confirmation dialog always
 * appears on click to protect against accidental data loss.
 */

const CancelToDashboardButton: React.FC = () => {
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

export default CancelToDashboardButton;
