"use client";

import React, { useEffect } from "react";
import { useBulkUpload, useConfig, useDocumentInfo, useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Applies the Media library's mobile image-card layout to the joined Media
 * table on a Media Album document. When the album has no images, replaces
 * Payload's generic empty-state copy with the same upload actions available
 * on the Media collection page.
 */
const MediaListImagesMobileLayout: React.FC = () => {
  const { config } = useConfig();
  const { id: albumID } = useDocumentInfo();
  const { openModal } = useModal();
  const router = useRouter();
  const {
    drawerSlug,
    setCollectionSlug,
    setFolderID,
    setInitialFiles,
    setInitialForms,
    setMaxFiles,
    setOnSuccess,
    setSelectableCollections,
  } = useBulkUpload();

  useEffect(() => {
    const openMediaUpload = (files?: FileList) => {
      setCollectionSlug("media");
      setFolderID(undefined);
      setInitialFiles((files ?? undefined) as FileList);
      setInitialForms([]);
      setMaxFiles((files ? 1 : undefined) as number);
      setSelectableCollections(null);
      setOnSuccess((uploadedForms) => {
        void (async () => {
          let assignmentFailed = false;

          if (typeof albumID !== "string" && typeof albumID !== "number") {
            assignmentFailed = uploadedForms.length > 0;
          } else {
            const apiRoot = config.routes.api.replace(/\/+$/, "");

            await Promise.all(
              uploadedForms.map(async ({ doc }) => {
                const mediaID = doc.id;
                if (typeof mediaID !== "string" && typeof mediaID !== "number") {
                  assignmentFailed = true;
                  return;
                }

                try {
                  const response = await fetch(
                    `${apiRoot}/media/${encodeURIComponent(String(mediaID))}`,
                    {
                      method: "PATCH",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                      },
                      body: JSON.stringify({ lists: [albumID] }),
                    },
                  );

                  if (!response.ok) assignmentFailed = true;
                } catch {
                  assignmentFailed = true;
                }
              }),
            );
          }

          if (assignmentFailed) {
            toast.error(
              "Images uploaded, but some could not be added to this album. Refresh and check the image assignments.",
            );
          }

          router.refresh();
        })();
      });

      openModal(drawerSlug);
    };

    const addEmptyStateActions = () => {
      const emptyState = document.querySelector<HTMLElement>(
        "#field-images .no-results",
      );

      if (
        !emptyState ||
        emptyState.querySelector(".gh-album-empty-state")
      ) {
        return;
      }

      const replacement = document.createElement("div");
      replacement.className = "gh-album-empty-state";
      replacement.setAttribute("role", "status");

      const message = document.createElement("p");
      message.className = "gh-album-empty-state__message";
      message.textContent = "No content yet.";

      const actions = document.createElement("div");
      actions.className = "gh-album-empty-state__actions";

      const addImageButton = document.createElement("button");
      addImageButton.type = "button";
      addImageButton.className = "gh-album-empty-state__button";
      addImageButton.textContent = "Add Image";
      addImageButton.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.addEventListener("change", () => {
          const selectedFile = input.files?.[0];
          if (!selectedFile) return;

          const transfer = new DataTransfer();
          transfer.items.add(selectedFile);
          openMediaUpload(transfer.files);
        });
        input.click();
      });

      const bulkUploadButton = document.createElement("button");
      bulkUploadButton.type = "button";
      bulkUploadButton.className = "gh-album-empty-state__button";
      bulkUploadButton.textContent = "Bulk Upload";
      bulkUploadButton.addEventListener("click", () => openMediaUpload());

      actions.append(addImageButton, bulkUploadButton);
      replacement.append(message, actions);
      emptyState.appendChild(replacement);
    };

    addEmptyStateActions();

    // The join field may mount after the document controls component. Observe
    // the page so the replacement appears as soon as the empty state exists.
    const observer = new MutationObserver(addEmptyStateActions);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document
        .querySelectorAll("#field-images .gh-album-empty-state")
        .forEach((element) => element.remove());
    };
  }, [
    albumID,
    config.routes.api,
    drawerSlug,
    openModal,
    router,
    setCollectionSlug,
    setFolderID,
    setInitialFiles,
    setInitialForms,
    setMaxFiles,
    setOnSuccess,
    setSelectableCollections,
  ]);

  return (
    <style>{`
      #field-images .no-results > :not(.gh-album-empty-state) {
        display: none !important;
      }

      #field-images .gh-album-empty-state {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding-top: calc(var(--base) / 2);
      }

      #field-images .gh-album-empty-state__message {
        margin: 0;
        color: var(--theme-elevation-900);
        font-size: 0.95rem;
      }

      #field-images .gh-album-empty-state__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 1rem;
      }

      #field-images .gh-album-empty-state__button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        min-height: 42px;
        padding: 0.6rem 0.9rem;
        background: var(--theme-elevation-100);
        border: 1px solid var(--theme-elevation-300);
        border-radius: 5px;
        color: var(--theme-elevation-900);
        font: inherit;
        font-size: 0.9rem;
        font-weight: 600;
        line-height: 1.2;
        cursor: pointer;
      }

      #field-images .gh-album-empty-state__button:hover {
        background: var(--theme-elevation-200);
        border-color: var(--theme-elevation-500);
        color: var(--theme-elevation-1000);
      }

      @media (max-width: 767px) {
        #field-images .gh-album-empty-state__actions {
          width: 100%;
        }

        #field-images .gh-album-empty-state__button {
          flex: 1 1 auto;
        }
      }

      @media (max-width: 767px) {
        #field-images {
          width: 100%;
          min-width: 0;
        }

        #field-images .table-wrap,
        #field-images .collection-list__wrap,
        #field-images .collection-list__table-wrap {
          width: 100% !important;
          max-width: 100% !important;
          overflow: visible !important;
        }

        #field-images .table,
        #field-images .table tbody {
          display: block !important;
          width: 100% !important;
          min-width: 0 !important;
        }

        #field-images .table thead {
          display: none !important;
        }

        #field-images .table tbody tr {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) !important;
          gap: 12px !important;
          width: 100% !important;
          height: auto !important;
          margin: 0 0 14px !important;
          padding: 14px !important;
          box-sizing: border-box !important;
          border: 1px solid var(--theme-elevation-200) !important;
          border-radius: 8px !important;
          background: var(--theme-elevation-50) !important;
        }

        #field-images .table tbody tr td {
          display: flex !important;
          align-items: flex-start !important;
          gap: 8px !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          max-height: none !important;
          padding: 0 !important;
          border: 0 !important;
          white-space: normal !important;
          overflow-wrap: anywhere !important;
          box-sizing: border-box !important;
        }

        #field-images .table tbody tr td:has(img) {
          display: block !important;
          grid-column: 1 / -1 !important;
          width: 100% !important;
          min-width: 0 !important;
          line-height: 0 !important;
        }

        #field-images .table tbody tr td:has(img),
        #field-images .table tbody tr td:has(img) :not(img) {
          height: auto !important;
          min-height: 0 !important;
          max-height: none !important;
          aspect-ratio: auto !important;
          align-self: start !important;
        }

        #field-images .table tbody tr td:has(img) .thumbnail,
        #field-images .table tbody tr td:has(img) [class*="thumbnail"],
        #field-images .table tbody tr td:has(img) a:has(img) {
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

        #field-images .table tbody tr td:has(img) img {
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
          background: #222 !important;
          border-radius: 6px !important;
        }

        #field-images .table tbody tr td:not(:has(img))::before {
          flex: 0 0 76px;
          color: var(--theme-elevation-500);
          font-size: 11px;
          font-weight: 600;
          line-height: 1.5;
        }

        #field-images .table tbody tr td:nth-child(2)::before {
          content: "Alt text";
        }

        #field-images .table tbody tr td:nth-child(3)::before {
          content: "Updated";
        }
      }
    `}</style>
  );
};

export default MediaListImagesMobileLayout;
