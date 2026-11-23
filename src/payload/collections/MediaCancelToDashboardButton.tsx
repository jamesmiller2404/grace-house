"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  useConfig,
  useDocumentDrawerContext,
  useFormModified,
  useModal,
} from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

/**
 * "Cancel" button for the Media create/edit pages — registered in
 * `Media.ts` under `admin.components.edit.beforeDocumentControls`, which
 * Payload renders inside the document controls bar, immediately to the
 * left of the Save button.
 *
 * Clicking it takes the user back to the Media list — the page that shows
 * every uploaded file in the collection (/admin/collections/media). The
 * button is rendered with Payload's own `Button` as a link (el="link"), so
 * the navigation runs through Payload's `Link`: it shows the admin panel's
 * route transition/progress behavior and, if the form has unsaved changes,
 * Payload's "Leave without saving?" confirmation modal pops up before
 * leaving — the exact same protection the sidebar links have. When there
 * are no unsaved changes, the navigation happens immediately with no
 * confirmation prompt.
 */
const MediaCancelToDashboardButton: React.FC = () => {
  const { config } = useConfig();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { drawerSlug } = useDocumentDrawerContext();
  const { closeModal } = useModal();
  const modified = useFormModified();
  const fromDashboard = searchParams.get("from") === "dashboard";

  const confirmLeaveIfModified = () => {
    if (!modified) return true;
    return window.confirm(
      "You have unsaved changes. Are you sure you want to leave without saving?",
    );
  };

  if (drawerSlug) {
    return (
      <Button
        buttonStyle="secondary"
        onClick={() => {
          if (confirmLeaveIfModified()) closeModal(drawerSlug);
        }}
      >
        Cancel
      </Button>
    );
  }

  const targetURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: fromDashboard ? "/" : "/collections/media",
  });

  const handleBack = () => {
    if (!confirmLeaveIfModified()) return;
    if (
      !fromDashboard &&
      typeof window !== "undefined" &&
      document.referrer.startsWith(window.location.origin) &&
      document.referrer.includes("/admin/")
    ) {
      router.back();
      return;
    }
    router.push(targetURL);
  };

  return (
    <Button buttonStyle="secondary" onClick={handleBack}>
      Cancel
    </Button>
  );
};

export default MediaCancelToDashboardButton;
