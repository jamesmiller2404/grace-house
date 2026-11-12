"use client";

import { Button, useConfig } from "@payloadcms/ui";
import type { BeforeListClientProps } from "payload";
import { formatAdminURL } from "payload/shared";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Render a Dashboard link beside Payload's Create New action on collection
 * list pages. The two controls share the title-actions container.
 */
const DashboardListButton: React.FC<BeforeListClientProps> = () => {
  const { config } = useConfig();
  const [actionsElement, setActionsElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const findActions = () => {
      const element = document.querySelector<HTMLElement>(
        ".list-header__title-actions",
      );
      if (element) setActionsElement(element);
    };

    findActions();
    const observer = new MutationObserver(findActions);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const dashboardURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "",
  });

  if (!actionsElement) return null;

  return createPortal(
    <Button
      buttonStyle="secondary"
      el="link"
      to={dashboardURL}
      className="gh-dashboard-list-button"
    >
      Dashboard
    </Button>,
    actionsElement,
  );
};

export default DashboardListButton;
