"use client";

import React from "react";
import {
  Button,
  useBulkUpload,
  useConfig,
  useDocumentInfo,
  useModal,
} from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/** Upload images directly into the currently saved Media Album. */
const MediaAlbumUploadButtons: React.FC = () => {
  const { config } = useConfig();
  const { id: albumID } = useDocumentInfo();
  const { openModal } = useModal();
  const router = useRouter();
  const saved =
    typeof albumID === "string" || typeof albumID === "number";
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

  const openAddImage = () => {
    if (!saved) return;

    // Use the Join field's own Add New control. Its drawer prepopulates the
    // Media document's "lists" relationship with this album and refreshes the
    // joined-image table itself after the Media document is saved.
    const addImageButton = document
      .getElementById("field-images")
      ?.querySelector<HTMLElement>(".relationship-table__add-new");

    if (!addImageButton) {
      toast.error("The album image controls are not available. Refresh the album and try again.");
      return;
    }

    addImageButton.click();
  };

  const openMediaUpload = () => {
    if (!saved) return;

    setCollectionSlug("media");
    setFolderID(undefined);
    setInitialFiles(undefined as unknown as FileList);
    setInitialForms([]);
    setMaxFiles(undefined as unknown as number);
    setSelectableCollections(null);
    setOnSuccess((uploadedForms) => {
      void (async () => {
        let assignmentFailed = false;
        const apiRoot = config.routes.api.replace(/\\/+$/, "");

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

  const tooltip = saved
    ? undefined
    : "Name and save the album first to upload images.";

  return (
    <>
      <div className="gh-album-upload-controls" role="group" aria-label="Album image uploads">
        <span title={tooltip} className="gh-album-upload-controls__item">
          <Button
            buttonStyle="secondary"
            disabled={!saved}
            onClick={openAddImage}
          >
            Add Image
          </Button>
        </span>
        <span title={tooltip} className="gh-album-upload-controls__item">
          <Button
            buttonStyle="secondary"
            disabled={!saved}
            onClick={openMediaUpload}
          >
            Bulk Upload
          </Button>
        </span>
      </div>
      <style>{`
        .gh-album-upload-controls {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-inline-end: 10px;
          white-space: nowrap;
        }

        .gh-album-upload-controls__item {
          display: inline-flex;
        }

        .gh-album-upload-controls button:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        @media (max-width: 767px) {
          .gh-album-upload-controls {
            gap: 6px;
            margin-inline-end: 6px;
          }
        }
      `}</style>
    </>
  );
};

export default MediaAlbumUploadButtons;
