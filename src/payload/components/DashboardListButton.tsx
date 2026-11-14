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
        ".list-header__title-actions, .list-header__actions",
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

  return (
    <>
      <style>{`
        /* The Media collection is an image library: make its list thumbnails
           large enough to inspect without opening each document. */
        .table td:has(img) {
          min-width: 200px !important;
          vertical-align: middle;
        }

        /* Payload wraps admin thumbnails in a fixed-size Thumbnail element.
           Override both the wrapper and image dimensions, not just the row. */
        .table td:has(img) .thumbnail,
        .table td:has(img) [class*="thumbnail"] {
          width: 180px !important;
          height: 120px !important;
          min-width: 180px !important;
          min-height: 120px !important;
          max-width: 180px !important;
          max-height: 120px !important;
          overflow: hidden !important;
        }

        .table td:has(img) img {
          display: block !important;
          width: 180px !important;
          height: 120px !important;
          min-width: 180px !important;
          min-height: 120px !important;
          max-width: 180px !important;
          max-height: 120px !important;
          object-fit: cover !important;
          border-radius: 6px;
        }

        .table tr:has(td img) {
          height: 136px;
        }
      `}</style>
      {actionsElement &&
        createPortal(
          <Button
            buttonStyle="secondary"
            el="link"
            to={dashboardURL}
            className="gh-dashboard-list-button"
          >
            Dashboard
          </Button>,
          actionsElement,
        )}
    </>
  );
};

export default DashboardListButton;
