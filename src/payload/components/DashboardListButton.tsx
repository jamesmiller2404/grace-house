"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import type { BeforeListClientProps } from "payload";

/**
 * Keeps the central Media Library list readable across desktop, tablet, and
 * mobile. Payload's native create action is relabeled "Add Images".
 */
const DashboardListButton: React.FC<BeforeListClientProps> = () => {
  const pathname = usePathname();
  const { config } = useConfig();
  const [actionsContainer, setActionsContainer] = useState<HTMLElement | null>(null);
  const isMediaCollection = pathname.endsWith("/collections/media");

  const dashboardURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/",
  });

  useEffect(() => {
    if (!isMediaCollection) return;

    let frame = 0;
    const findActionsContainer = () => {
      const container = document.querySelector<HTMLElement>(
        ".list-header__title-actions",
      );

      if (!container) return false;

      setActionsContainer(container);
      observer.disconnect();
      return true;
    };

    // The list header can be rendered after this beforeList component.
    const observer = new MutationObserver(() => {
      if (findActionsContainer()) cancelAnimationFrame(frame);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Defer the initial DOM lookup so state is updated from an async callback,
    // not synchronously inside the effect body.
    frame = requestAnimationFrame(() => {
      findActionsContainer();
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [isMediaCollection, pathname]);

  if (!isMediaCollection) return null;

  return (
    <>
      <style>{`
        .list-header__title-and-actions {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 16px !important;
          flex-wrap: nowrap !important;
        }
        .list-header__title-and-actions > .list-header__title {
          margin: 0 !important;
          align-self: center !important;
          flex: 0 0 auto !important;
        }
        .list-header__title-actions {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          flex-wrap: nowrap !important;
          gap: 8px !important;
          margin: 0 !important;
        }
        .list-create-new-doc__create-new-button {
          position: relative !important;
          color: transparent !important;
          font-size: 0 !important;
        }
        .list-create-new-doc__create-new-button * {
          visibility: hidden !important;
        }
        .list-create-new-doc__create-new-button::after {
          content: "Add Images";
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--theme-elevation-900);
          font-size: 0.9rem;
          visibility: visible;
          white-space: nowrap;
        }

        .table-wrap,
        .collection-list__wrap,
        .collection-list__table-wrap {
          max-width: 100% !important;
          overflow-x: visible !important;
        }
        .table {
          width: 100% !important;
          min-width: 0 !important;
          table-layout: auto !important;
        }
        .table tbody td {
          vertical-align: middle !important;
        }
        .table tbody td:nth-child(3),
        .table tbody td:nth-child(4) {
          white-space: normal !important;
          overflow-wrap: anywhere;
        }
        .table tbody td:nth-child(6),
        .table thead th:nth-child(6) {
          white-space: nowrap !important;
        }

        @media (max-width: 767px) {
          .list-header__title-and-actions {
            align-items: flex-start !important;
            flex-wrap: wrap !important;
          }
          .list-header__title-actions {
            flex-wrap: wrap !important;
            justify-content: flex-start !important;
          }
          .table-wrap,
          .collection-list__wrap,
          .collection-list__table-wrap {
            overflow: visible !important;
            max-width: 100% !important;
          }
          .table,
          .table tbody {
            display: block !important;
            width: 100% !important;
            min-width: 0 !important;
          }
          .table thead { display: none !important; }
          .table tbody tr {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: 10px 14px;
            width: 100% !important;
            height: auto !important;
            margin: 0 0 14px !important;
            padding: 14px !important;
            border: 1px solid var(--theme-elevation-200);
            border-radius: 8px;
            background: var(--theme-elevation-50);
            box-sizing: border-box;
          }
          .table tbody tr td {
            display: flex !important;
            align-items: flex-start;
            gap: 8px;
            width: auto !important;
            min-width: 0 !important;
            max-width: 100% !important;
            padding: 0 !important;
            border: 0 !important;
            white-space: normal !important;
            overflow-wrap: anywhere;
            box-sizing: border-box;
          }
          .table tbody tr td:first-child:has(input[type="checkbox"]) {
            display: none !important;
          }
          .table tbody tr td:has(img) {
            display: block !important;
            grid-column: 1 / -1 !important;
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
            min-height: 0 !important;
            line-height: 0 !important;
            margin-bottom: 0 !important;
          }
          .table tbody tr td:has(img),
          .table tbody tr td:has(img) :not(img) {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            aspect-ratio: auto !important;
            align-self: start !important;
          }
          .table tbody tr td:has(img) .thumbnail,
          .table tbody tr td:has(img) [class*="thumbnail"],
          .table tbody tr td:has(img) a:has(img) {
            display: block !important;
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            aspect-ratio: auto !important;
            overflow: visible !important;
            position: static !important;
          }
          .table tbody tr td:has(img) img {
            display: block !important;
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: 360px !important;
            aspect-ratio: auto !important;
            object-fit: contain !important;
            object-position: center !important;
            background: #222;
            border-radius: 6px;
          }

          /* Without Payload's selection checkbox. */
          .table tbody tr:not(:has(td:first-child input[type="checkbox"])) td:nth-child(2),
          .table tbody tr:not(:has(td:first-child input[type="checkbox"])) td:nth-child(5) {
            grid-column: auto;
          }
          .table tbody tr:not(:has(td:first-child input[type="checkbox"])) td:nth-child(3),
          .table tbody tr:not(:has(td:first-child input[type="checkbox"])) td:nth-child(4),
          .table tbody tr:not(:has(td:first-child input[type="checkbox"])) td:nth-child(6) {
            grid-column: 1 / -1;
          }
          .table tbody tr:not(:has(td:first-child input[type="checkbox"])) td:nth-child(2)::before { content: "Website"; }
          .table tbody tr:not(:has(td:first-child input[type="checkbox"])) td:nth-child(3)::before { content: "Alt text"; }
          .table tbody tr:not(:has(td:first-child input[type="checkbox"])) td:nth-child(4)::before { content: "Tags"; }
          .table tbody tr:not(:has(td:first-child input[type="checkbox"])) td:nth-child(5)::before { content: "Type"; }
          .table tbody tr:not(:has(td:first-child input[type="checkbox"])) td:nth-child(6)::before { content: "Updated"; }

          /* With Payload's selection checkbox, data columns shift right. */
          .table tbody tr:has(td:first-child input[type="checkbox"]) td:nth-child(3),
          .table tbody tr:has(td:first-child input[type="checkbox"]) td:nth-child(6) {
            grid-column: auto;
          }
          .table tbody tr:has(td:first-child input[type="checkbox"]) td:nth-child(4),
          .table tbody tr:has(td:first-child input[type="checkbox"]) td:nth-child(5),
          .table tbody tr:has(td:first-child input[type="checkbox"]) td:nth-child(7) {
            grid-column: 1 / -1;
          }
          .table tbody tr:has(td:first-child input[type="checkbox"]) td:nth-child(3)::before { content: "Website"; }
          .table tbody tr:has(td:first-child input[type="checkbox"]) td:nth-child(4)::before { content: "Alt text"; }
          .table tbody tr:has(td:first-child input[type="checkbox"]) td:nth-child(5)::before { content: "Tags"; }
          .table tbody tr:has(td:first-child input[type="checkbox"]) td:nth-child(6)::before { content: "Type"; }
          .table tbody tr:has(td:first-child input[type="checkbox"]) td:nth-child(7)::before { content: "Updated"; }

          .table tbody tr td:not(:has(img))::before {
            flex: 0 0 76px;
            color: var(--theme-elevation-500);
            font-size: 11px;
            font-weight: 600;
            line-height: 1.5;
          }
        }

        @media (min-width: 768px) {
          .table td:has(img) {
            min-width: 200px !important;
            vertical-align: middle;
          }
          .table td:has(img) .thumbnail,
          .table td:has(img) [class*="thumbnail"] {
            display: block !important;
            width: 180px !important;
            height: 120px !important;
            min-width: 180px !important;
            min-height: 120px !important;
            max-width: 180px !important;
            max-height: 120px !important;
            overflow: hidden !important;
            position: relative !important;
          }
          .table td:has(img) img {
            display: block !important;
            width: 180px !important;
            height: 120px !important;
            min-width: 180px !important;
            min-height: 120px !important;
            max-width: 180px !important;
            max-height: 120px !important;
            object-fit: contain !important;
            background: #222;
            border-radius: 6px;
          }
          .table tr:has(td img) { height: 136px; }
        }
      `}</style>
      {actionsContainer &&
        createPortal(
          <button
            type="button"
            aria-label="Dashboard"
            title="Dashboard"
            className="btn gh-dashboard-list-button btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
            onClick={() => {
              window.location.href = dashboardURL;
            }}
          >
            <span className="btn__content">
              <span className="btn__label">Dashboard</span>
            </span>
          </button>,
          actionsContainer,
        )}
    </>
  );
};

export default DashboardListButton;
