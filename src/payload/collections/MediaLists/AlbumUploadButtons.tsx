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

  const openMediaUpload = (files?: FileList) => {
    if (!saved) return;

    setCollectionSlug("media");
    setFolderID(undefined);
    setInitialFiles((files ?? undefined) as FileList);
    setInitialForms([]);
    setMaxFiles((files ? 1 : undefined) as number);
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

  const chooseSingleImage = () => {
    if (!saved) return;
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
            onClick={chooseSingleImage}
          >
            Add Image
          </Button>
        </span>
        <span title={tooltip} className="gh-album-upload-controls__item">
          <Button
            buttonStyle="secondary"
            disabled={!saved}
            onClick={() => openMediaUpload()}
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
          opacity: 0.45;
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
