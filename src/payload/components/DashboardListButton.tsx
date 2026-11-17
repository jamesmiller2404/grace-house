"use client";

import { Button, useConfig } from "@payloadcms/ui";
import type { BeforeListClientProps } from "payload";
import { formatAdminURL } from "payload/shared";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type MediaList = {
  id: number | string;
  name: string;
};

const DashboardListButton: React.FC<BeforeListClientProps> = () => {
  const { config } = useConfig();
  const [actionsElement, setActionsElement] = useState<HTMLElement | null>(null);
  const [isMediaCollection, setIsMediaCollection] = useState(false);
  const [isMediaListsCollection, setIsMediaListsCollection] = useState(false);
  const [lists, setLists] = useState<MediaList[]>([]);

  const mediaListURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/media",
  });
  const createListURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/media-lists/create",
  });
  const dashboardURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "",
  });

  useEffect(() => {
    const findActions = () => {
      const element = document.querySelector<HTMLElement>(
        ".list-header__title-actions, .list-header__actions",
      );
      if (element) setActionsElement(element);
    };

    setIsMediaCollection(
      window.location.pathname.endsWith("/collections/media"),
    );
    setIsMediaListsCollection(
      window.location.pathname.endsWith("/collections/media-lists"),
    );
    findActions();
    const observer = new MutationObserver(findActions);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMediaCollection && !isMediaListsCollection) return;

    let active = true;
    fetch("/api/media-lists?limit=100&sort=name&depth=0", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load image lists.");
        return response.json();
      })
      .then((data: { docs?: MediaList[] }) => {
        if (active) setLists(Array.isArray(data.docs) ? data.docs : []);
      })
      .catch(() => {
        if (active) setLists([]);
      });

    return () => {
      active = false;
    };
  }, [isMediaCollection, isMediaListsCollection]);


  useEffect(() => {
    if (!isMediaListsCollection) return;

    const insertPrimaryListRow = () => {
      const tableBody = document.querySelector<HTMLTableSectionElement>(".table tbody");
      if (!tableBody || tableBody.querySelector(".gh-primary-media-list-row")) return;

      const row = document.createElement("tr");
      row.className = "gh-primary-media-list-row";
      const nameCell = document.createElement("td");
      const link = document.createElement("a");
      link.href = mediaListURL;
      link.className = "gh-primary-media-list-link";
      link.textContent = "Primary List";
      nameCell.appendChild(link);

      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = "All images in the Media library";
      const updatedCell = document.createElement("td");
      updatedCell.textContent = "—";
      row.append(nameCell, descriptionCell, updatedCell);
      tableBody.prepend(row);
    };

    insertPrimaryListRow();
    const observer = new MutationObserver(insertPrimaryListRow);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      document.querySelectorAll(".gh-primary-media-list-row").forEach((row) => row.remove());
    };
  }, [isMediaListsCollection, mediaListURL]);



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
          object-fit: cover !important;
          border-radius: 6px;
        }

        .table tr:has(td img) {
          height: 136px;
        }

        .gh-media-list-navigation {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px 18px;
          margin: 0 0 22px;
          padding: 14px 16px;
          border: 1px solid var(--theme-elevation-150);
          border-radius: 10px;
          background: var(--theme-elevation-50);
        }

        .gh-media-list-navigation a {
          color: var(--theme-text);
          text-decoration: none;
          font-size: 13px;
        }

        .gh-media-list-navigation a:hover {
          text-decoration: underline;
        }

        .gh-media-list-navigation a.gh-primary-list-link {
          color: #b7a2ff;
          font-weight: 700;
        }

        .gh-primary-media-list-row {
          background: var(--theme-elevation-100);
          font-weight: 600;
        }
        .gh-primary-media-list-row td {
          border-bottom: 1px solid var(--theme-elevation-200);
          padding-top: 14px;
          padding-bottom: 14px;
        }
        .gh-primary-media-list-link {
          color: #b7a2ff !important;
          font-weight: 700;
          text-decoration: none;
        }
        .gh-primary-media-list-link:hover { text-decoration: underline; }

      `}</style>

      {isMediaCollection && (
        <nav
          className="gh-media-list-navigation"
          aria-label="Media image lists"
        >
          <a className="gh-primary-list-link" href={mediaListURL}>
            Primary List
          </a>
          {isMediaCollection &&
            lists.map((list) => (
              <a
                key={String(list.id)}
                href={`${mediaListURL}?where[lists][in]=${encodeURIComponent(String(list.id))}`}
              >
                {list.name}
              </a>
            ))}
        </nav>
      )}

      {actionsElement &&
        createPortal(
          <>
            {isMediaCollection && (
              <Button
                buttonStyle="primary"
                el="link"
                to={createListURL}
                className="gh-create-media-list-button"
              >
                Create New List
              </Button>
            )}
            <Button
              buttonStyle="secondary"
              el="link"
              to={dashboardURL}
              className="gh-dashboard-list-button"
            >
              Dashboard
            </Button>
          </>,
          actionsElement,
        )}
    </>
  );
};

export default DashboardListButton;
