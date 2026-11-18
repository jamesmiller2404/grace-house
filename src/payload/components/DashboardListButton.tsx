"use client";

import { Button, useConfig } from "@payloadcms/ui";
import type { BeforeListClientProps } from "payload";
import { formatAdminURL } from "payload/shared";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

type MediaList = {
  id: number | string;
  name: string;
};

const DashboardListButton: React.FC<BeforeListClientProps> = () => {
  const { config } = useConfig();
  const [actionsElement, setActionsElement] = useState<HTMLElement | null>(null);
  const pathname = usePathname();
  const isMediaCollection = pathname.endsWith("/collections/media");
  const isMediaListsCollection = pathname.endsWith("/collections/media-lists");
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
      if (!element) return false;
      setActionsElement(element);
      return true;
    };

    // Only watch briefly while Payload mounts the list header. Keeping a
    // document-wide observer alive causes needless work during admin updates.
    if (findActions()) return;
    const observer = new MutationObserver(() => {
      if (findActions()) observer.disconnect();
    });
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
    fetch("/api/media-lists/counts", { credentials: "include" })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load image counts.");
        return response.json() as Promise<{ counts?: Record<string, number> }>;
      })
      .then((data) => {
        if (active) setImageCounts(data.counts ?? {});
      })
      .catch(() => {
        if (active) setImageCounts({});
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
        let tally = link.querySelector<HTMLElement>(
          ".gh-media-list-count:not(.gh-primary-media-list-count)",
        );
        if (!tally) {
          tally = document.createElement("span");
          tally.className = "gh-media-list-count";
          link.appendChild(tally);
        }
        const countText = String(count);
        if (tally.textContent !== countText) {
          tally.textContent = countText;
        }
      });

      const primaryTally = document.querySelector<HTMLElement>(
        ".gh-primary-media-list-count",
      );
      if (
        primaryTally &&
        typeof imageCounts.primary === "number" &&
        primaryTally.textContent !== String(imageCounts.primary)
      ) {
        primaryTally.textContent = String(imageCounts.primary);
      }
    };

    const tableBody = document.querySelector<HTMLTableSectionElement>(
      ".table tbody",
    );
    if (tableBody) {
      updateListCounts();
    }

    // Payload may mount its table after this component. Watch only until the
    // tbody exists, then disconnect; ongoing table mutations do not need a
    // full-document scan or repeated count-badge updates.
    const observer = tableBody
      ? null
      : new MutationObserver(() => {
          const mountedBody = document.querySelector<HTMLTableSectionElement>(
            ".table tbody",
          );
          if (!mountedBody) return;
          updateListCounts();
          observer?.disconnect();
        });
    observer?.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
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
          /* Desktop and tablet: preserve all Media columns and let text wrap. */
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

          /* On phones, each image becomes a card with labelled metadata. */
          @media (max-width: 767px) {
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
            /* Payload adds a selection-checkbox cell before the image cell.
               Hide that utility cell on phones and target the image by content,
               not by assuming it is always the first table column. */
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
            }
            /* Clear fixed sizing on every nested Payload thumbnail wrapper.
               Wide images are naturally shorter; a fixed-height ancestor was
               leaving a blank block below them before the metadata begins. */
            .table tbody tr td:has(img),
            .table tbody tr td:has(img) :not(img) {
              height: auto !important;
              min-height: 0 !important;
              max-height: none !important;
              aspect-ratio: auto !important;
              align-self: start !important;
            }
            .table tbody tr td:has(img) {
              line-height: 0 !important;
              margin-bottom: 0 !important;
            }
            /* Let the thumbnail follow the source image's aspect ratio. */
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

            /* Standard Media rows without a selection cell. */
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
            .table tbody tr:not(:has(td:first-child input[type="checkbox"])) td:nth-child(4)::before { content: "Lists"; }
            .table tbody tr:not(:has(td:first-child input[type="checkbox"])) td:nth-child(5)::before { content: "Type"; }
            .table tbody tr:not(:has(td:first-child input[type="checkbox"])) td:nth-child(6)::before { content: "Updated"; }

            /* Primary List rows include Payload's checkbox column, shifting
               every data column one position to the right. */
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
            .table tbody tr:has(td:first-child input[type="checkbox"]) td:nth-child(5)::before { content: "Lists"; }
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
        ` : ""}

        /* Desktop/tablet thumbnails use a consistent preview size. Do not
           apply these fixed dimensions to the stacked mobile cards. */
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

          .table tr:has(td img) {
            height: 136px;
          }
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
          display: inline-flex !important;
          align-items: center;
          flex-wrap: nowrap;
          width: max-content;
          max-width: 100%;
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

            /* Stack Media Lists rows into readable cards on narrow screens. */
            @media (max-width: 767px) {
              .table-wrap,
              .collection-list__wrap,
              .collection-list__table-wrap {
                width: 100% !important;
                max-width: 100% !important;
                overflow-x: visible !important;
              }
              .table,
              .table tbody {
                display: block !important;
                width: 100% !important;
                min-width: 0 !important;
              }
              .table thead {
                display: none !important;
              }
              .table tbody tr {
                display: grid !important;
                grid-template-columns: minmax(0, 1fr);
                gap: 10px;
                width: 100% !important;
                height: auto !important;
                margin: 0 0 12px !important;
                padding: 14px !important;
                box-sizing: border-box;
                border: 1px solid var(--theme-elevation-200);
                border-radius: 8px;
                background: var(--theme-elevation-50);
              }
              .table tbody tr td {
                display: flex !important;
                align-items: flex-start;
                gap: 8px;
                width: 100% !important;
                min-width: 0 !important;
                max-width: 100% !important;
                padding: 0 !important;
                border: 0 !important;
                white-space: normal !important;
                overflow-wrap: anywhere;
                box-sizing: border-box;
              }
              .table tbody tr td:first-child {
                font-weight: 600;
              }
              .table tbody tr:not(.gh-primary-media-list-row) td:nth-child(2)::before {
                content: "Description";
              }
              .table tbody tr:not(.gh-primary-media-list-row) td:nth-child(3)::before {
                content: "Updated";
              }
              .table tbody tr:not(.gh-primary-media-list-row) td:nth-child(n+2)::before {
                flex: 0 0 76px;
                color: var(--theme-elevation-500);
                font-size: 11px;
                font-weight: 600;
                line-height: 1.5;
              }
              .gh-primary-media-list-row {
                grid-template-columns: minmax(0, 1fr) !important;
              }
              .gh-primary-media-list-row td:first-child {
                white-space: normal !important;
                flex-wrap: wrap;
                align-items: center !important;
              }
              .gh-primary-media-list-row td:nth-child(2) {
                color: var(--theme-elevation-600);
                font-weight: 400;
              }
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
                Media Albums
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
