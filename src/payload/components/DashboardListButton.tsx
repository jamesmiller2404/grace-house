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
  const [imageCounts, setImageCounts] = useState<Record<string, number>>({});

  const mediaListURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/media",
  });
  const mediaListsURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/media-lists",
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
    if (!isMediaCollection && !isMediaListsCollection) return;

    let active = true;
    const getCount = async (url: string): Promise<number> => {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Could not load image count.");
      const data = (await response.json()) as { totalDocs?: number };
      return typeof data.totalDocs === "number" ? data.totalDocs : 0;
    };

    const primaryURL = "/api/media?limit=1&depth=0";
    const requests = [
      getCount(primaryURL).then((count) => ["primary", count] as const),
      ...lists.map((list) => {
        const params = new URLSearchParams({
          limit: "1",
          depth: "0",
          "where[lists][in]": String(list.id),
        });
        return getCount(`/api/media?${params.toString()}`).then(
          (count) => [String(list.id), count] as const,
        );
      }),
    ];

    Promise.all(requests)
      .then((entries) => {
        if (active) setImageCounts(Object.fromEntries(entries));
      })
      .catch(() => {
        if (active) setImageCounts({});
      });

    return () => {
      active = false;
    };
  }, [isMediaCollection, isMediaListsCollection, lists]);

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
      link.className = "gh-primary-media-list-button";
      link.textContent = "Primary List";
      nameCell.appendChild(link);

      const primaryCount = document.createElement("span");
      primaryCount.className = "gh-media-list-count gh-primary-media-list-count";
      primaryCount.textContent = String(imageCounts.primary ?? "—");
      nameCell.appendChild(primaryCount);

      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = "All images in the Media library";
      row.append(nameCell, descriptionCell);
      tableBody.prepend(row);
    };

    const updateListCounts = () => {
      insertPrimaryListRow();
      document.querySelectorAll<HTMLAnchorElement>(
        '.table tbody a[href*="/collections/media-lists/"]',
      ).forEach((link) => {
        const match = link.pathname.match(/\/collections\/media-lists\/([^/]+)/);
        if (!match) return;
        const count = imageCounts[match[1]];
        if (typeof count !== "number") return;
        let tally = link.parentElement?.querySelector<HTMLElement>(
          ".gh-media-list-count:not(.gh-primary-media-list-count)",
        );
        if (!tally) {
          tally = document.createElement("span");
          tally.className = "gh-media-list-count";
          link.insertAdjacentElement("afterend", tally);
        }
        tally.textContent = String(count);
      });

      const primaryTally = document.querySelector<HTMLElement>(
        ".gh-primary-media-list-count",
      );
      if (primaryTally && typeof imageCounts.primary === "number") {
        primaryTally.textContent = String(imageCounts.primary);
      }
    };

    updateListCounts();
    const observer = new MutationObserver(updateListCounts);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      document.querySelectorAll(".gh-primary-media-list-row").forEach((row) => row.remove());
    };
  }, [isMediaListsCollection, mediaListURL, imageCounts]);



  return (
    <>
      <style>{`
        ${isMediaCollection ? `
          /* Rename Payload's native create-document action on the Media page. */
          .list-create-new-doc__create-new-button {
            position: relative !important;
            color: transparent !important;
            font-size: 0 !important;
          }
          .list-create-new-doc__create-new-button * {
            visibility: hidden !important;
          }
          .list-create-new-doc__create-new-button::after {
            content: "Add Image";
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
          /* Keep Add Image, Bulk Upload, and Media Lists on one row. */
          .list-header__title-actions,
          .list-header__actions {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            align-items: center !important;
            gap: 8px !important;
          }
        ` : ""}

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
          display: inline-flex;
          align-items: center;
          flex-wrap: nowrap;
          white-space: nowrap;
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

        .gh-media-list-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          margin-left: 8px;
          padding: 2px 6px;
          border: 1px solid var(--theme-elevation-200);
          border-radius: 10px;
          color: var(--theme-elevation-500);
          font-size: 11px;
          font-weight: 500;
          line-height: 1.2;
          vertical-align: middle;
        }

        .gh-primary-media-list-count {
          margin-left: 9px;
          border-color: var(--theme-elevation-300);
          color: var(--theme-elevation-600);
        }

        .gh-primary-media-list-row {
          background: var(--theme-elevation-100);
          font-weight: 600;
        }
        .gh-primary-media-list-row td {
          border-bottom: 1px solid var(--theme-elevation-200);
          padding-top: 14px;
          padding-bottom: 14px;
          vertical-align: middle;
        }
        .gh-primary-media-list-row td:first-child {
          white-space: nowrap;
        }
        .table tbody tr td:first-child:has(.gh-media-list-count),
        .table tbody tr td:first-child:has(.gh-media-list-count) a {
          white-space: nowrap;
        }
        .table tbody tr td:first-child:has(.gh-media-list-count) a {
          display: inline-flex;
          align-items: center;
          vertical-align: middle;
        }
        .gh-primary-media-list-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          min-height: 42px;
          padding: 0.6rem 0.9rem;
          background: var(--theme-elevation-100);
          border: 1px solid var(--theme-elevation-300);
          border-radius: 5px;
          color: #b7a2ff !important;
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.2;
          text-decoration: none;
        }
        .gh-primary-media-list-button:hover {
          background: var(--theme-elevation-200);
          border-color: var(--theme-elevation-500);
          color: #b7a2ff !important;
        }

      `}</style>

        {isMediaListsCollection && (
          <style>{`
            /* Rename Payload native create action on the Media Lists page. */
            .list-create-new-doc__create-new-button {
              position: relative !important;
              color: transparent !important;
              font-size: 0 !important;
            }
            .list-create-new-doc__create-new-button * { visibility: hidden !important; }
            .list-create-new-doc__create-new-button::after {
              content: "Create New List";
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
            .list-create-new-doc__create-new-button {
              box-sizing: border-box !important;
              width: max-content !important;
              min-width: 150px !important;
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }
          `}</style>
        )}

      {isMediaCollection && (
        <nav
          className="gh-media-list-navigation"
          aria-label="Media image lists"
        >
          <a className="gh-primary-list-link" href={mediaListURL}>
            Primary List
            <span className="gh-media-list-count">
              {typeof imageCounts.primary === "number" ? imageCounts.primary : "—"}
            </span>
          </a>
          {isMediaCollection &&
            lists.map((list) => (
              <a
                key={String(list.id)}
                href={`${mediaListURL}?where[lists][in]=${encodeURIComponent(String(list.id))}`}
              >
                {list.name}
                <span className="gh-media-list-count">
                  {typeof imageCounts[String(list.id)] === "number"
                    ? imageCounts[String(list.id)]
                    : "—"}
                </span>
              </a>
            ))}
        </nav>
      )}

      {actionsElement &&
        createPortal(
          <>
            {isMediaCollection ? (
              <Button
                buttonStyle="secondary"
                el="link"
                to={mediaListsURL}
                className="gh-media-lists-button"
              >
                Media Lists
              </Button>
            ) : (
              <Button
                buttonStyle="secondary"
                el="link"
                to={dashboardURL}
                className="gh-dashboard-list-button"
              >
                Dashboard
              </Button>
            )}
          </>,
          actionsElement,
        )}
    </>
  );
};

export default DashboardListButton;
