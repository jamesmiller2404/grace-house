"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useConfig } from "@payloadcms/ui";
import type { BeforeListClientProps } from "payload";

type PendingImage = {
  id: string;
  file: File;
  alt: string;
  previewUrl: string;
};

const BulkMediaUpload: React.FC<BeforeListClientProps> = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { config } = useConfig();
  const isMediaCollection = pathname.endsWith("/collections/media");
  const shouldAutoOpen = isMediaCollection && searchParams.get("bulkUpload") === "1";
  const [actionsContainer, setActionsContainer] = useState<HTMLElement | null>(null);
  const [images, setImages] = useState<PendingImage[]>([]);
  const imagesRef = useRef<PendingImage[]>(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      for (const image of imagesRef.current) {
        if (image.previewUrl) URL.revokeObjectURL(image.previewUrl);
      }
    };
  }, []);
  const [isOpen, setIsOpen] = useState(shouldAutoOpen);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shouldAutoOpen) return;
    router.replace(pathname);
  }, [pathname, router, shouldAutoOpen]);

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

  useEffect(() => {
    if (!actionsContainer) return;

    // Keep Payload's native Bulk Upload button and styling, but route its click
    // to the custom uploader instead of opening Payload's sequential uploader.
    const handleBulkUploadClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest<HTMLElement>("button, a");
      if (!button || !actionsContainer.contains(button)) return;

      const label = (button.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      if (label !== "bulk upload") return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setError("");
      setProgress("");
      setIsOpen(true);
    };

    actionsContainer.addEventListener("click", handleBulkUploadClick, true);
    return () => {
      actionsContainer.removeEventListener("click", handleBulkUploadClick, true);
    };
  }, [actionsContainer]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isUploading) setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isUploading]);

  if (!isMediaCollection) return null;

  const isHeicFile = (file: File) =>
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file.name);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const selected = Array.from(fileList).filter(
      (file) => file.type.startsWith("image/") || isHeicFile(file),
    );
    const newItems: PendingImage[] = selected.map((file) => ({
      id: crypto.randomUUID(),
      file,
      alt: "",
      previewUrl: isHeicFile(file) ? "" : URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...newItems]);
    setError("");

    for (const item of newItems) {
      if (!isHeicFile(item.file)) continue;
      void import("heic2any")
        .then(({ default: heic2any }) =>
          heic2any({ blob: item.file, toType: "image/jpeg", quality: 0.7 }),
        )
        .then((result) => {
          const blob = Array.isArray(result) ? result[0] : result;
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const stillQueued = imagesRef.current.some((entry) => entry.id === item.id);
          if (!stillQueued) {
            URL.revokeObjectURL(url);
            return;
          }
          setImages((current) =>
            current.map((entry) =>
              entry.id === item.id ? { ...entry, previewUrl: url } : entry,
            ),
          );
        })
        .catch(() => {
          // Keep placeholder if client-side HEIC preview conversion fails.
        });
    }
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  };

  const updateAlt = (id: string, alt: string) => {
    setImages((current) =>
      current.map((image) => (image.id === id ? { ...image, alt } : image)),
    );
  };

  const uploadImages = async () => {
    if (images.length === 0 || isUploading) return;

    setIsUploading(true);
    setError("");
    let uploaded = 0;
    const apiRoot = config.routes.api.replace(/\/$/, "");

    for (const image of images) {
      setProgress(`Uploading ${uploaded + 1} of ${images.length}: ${image.file.name}`);
      const formData = new FormData();
      formData.append("file", image.file);
      formData.append("_payload", JSON.stringify({ alt: image.alt }));

      try {
        const response = await fetch(`${apiRoot}/media`, {
          method: "POST",
          credentials: "include",
          headers: { Accept: "application/json" },
          body: formData,
        });

        if (!response.ok) {
          const responseBody = await response.json().catch(() => null) as
            | { errors?: Array<{ message?: string }>; message?: string }
            | null;
          const message =
            responseBody?.errors?.map((item) => item.message).filter(Boolean).join("; ") ||
            responseBody?.message ||
            `Server returned ${response.status}`;
          throw new Error(message);
        }

        uploaded += 1;
        URL.revokeObjectURL(image.previewUrl);
        setImages((current) => current.filter((item) => item.id !== image.id));
      } catch (uploadError) {
        const message =
          uploadError instanceof Error ? uploadError.message : "Unknown upload error.";
        setError(`Stopped after ${uploaded} of ${images.length} images. ${image.file.name}: ${message}`);
        setProgress("");
        setIsUploading(false);
        if (uploaded > 0) router.refresh();
        return;
      }
    }

    setProgress(`Successfully uploaded ${uploaded} image${uploaded === 1 ? "" : "s"}.`);
    setIsUploading(false);
    router.refresh();
  };

  return (
    <>
      {isOpen &&
        createPortal(
          <div className="gh-bulk-upload-overlay" role="presentation">
            <section
              className="gh-bulk-upload-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gh-bulk-upload-title"
            >
              <header className="gh-bulk-upload-header">
                <div>
                  <h2 id="gh-bulk-upload-title">Bulk Upload Images</h2>
                  <p>Select multiple images, then enter Alt Text separately for each one.</p>
                </div>
                <button
                  type="button"
                  className="gh-bulk-upload-close"
                  aria-label="Close"
                  disabled={isUploading}
                  onClick={() => setIsOpen(false)}
                >
                  ×
                </button>
              </header>

              <div className="gh-bulk-upload-body">
                <label className="gh-bulk-upload-picker">
                  <span>Select Images</span>
                  <input
                    type="file"
                    accept="image/*,.heic,.heif"
                    multiple
                    disabled={isUploading}
                    onChange={(event) => {
                      addFiles(event.currentTarget.files);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>

                <p className="gh-bulk-upload-note">
                  Alt Text is optional. Leave it blank for decorative images. Do not use the filename as a substitute.
                </p>

                {images.length > 0 && (
                  <div className="gh-bulk-upload-list">
                    {images.map((image) => (
                      <div className="gh-bulk-upload-item" key={image.id}>
                        {image.previewUrl ? (
                          <img
                            className="gh-bulk-upload-thumb"
                            src={image.previewUrl}
                            alt=""
                          />
                        ) : (
                          <div className="gh-bulk-upload-thumb gh-bulk-upload-thumb--placeholder">
                            HEIC
                          </div>
                        )}
                        <div className="gh-bulk-upload-file">
                          <strong>{image.file.name}</strong>
                          <span>{(image.file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                        <label className="gh-bulk-upload-alt">
                          <span>Alt Text</span>
                          <input
                            type="text"
                            value={image.alt}
                            disabled={isUploading}
                            placeholder="Describe the image (optional)"
                            onChange={(event) => updateAlt(image.id, event.currentTarget.value)}
                          />
                        </label>
                        <button
                          type="button"
                          className="gh-bulk-upload-remove"
                          disabled={isUploading}
                          onClick={() => removeImage(image.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {progress && <p className="gh-bulk-upload-progress" role="status">{progress}</p>}
                {error && <p className="gh-bulk-upload-error" role="alert">{error}</p>}
              </div>

              <footer className="gh-bulk-upload-footer">
                <span>{images.length} image{images.length === 1 ? "" : "s"} queued</span>
                <div>
                  <button
                    type="button"
                    className="gh-bulk-upload-cancel"
                    disabled={isUploading}
                    onClick={() => setIsOpen(false)}
                  >
                    {progress.startsWith("Successfully") ? "Close" : "Cancel"}
                  </button>
                  <button
                    type="button"
                    className="gh-bulk-upload-submit"
                    disabled={images.length === 0 || isUploading}
                    onClick={() => void uploadImages()}
                  >
                    {isUploading ? "Uploading…" : "Upload Images"}
                  </button>
                </div>
              </footer>
            </section>
          </div>,
          document.body,
        )}

      <style>{`
        .gh-bulk-upload-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgb(0 0 0 / 72%);
        }
        .gh-bulk-upload-dialog {
          display: flex;
          flex-direction: column;
          width: min(760px, 100%);
          max-height: min(88vh, 900px);
          overflow: hidden;
          border: 1px solid var(--theme-elevation-300);
          border-radius: 12px;
          background: var(--theme-elevation-100);
          color: var(--theme-text);
          box-shadow: 0 20px 70px rgb(0 0 0 / 45%);
        }
        .gh-bulk-upload-header,
        .gh-bulk-upload-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 22px;
          border-bottom: 1px solid var(--theme-elevation-200);
        }
        .gh-bulk-upload-header h2 {
          margin: 0 0 5px;
          font-size: 19px;
        }
        .gh-bulk-upload-header p,
        .gh-bulk-upload-note {
          margin: 0;
          color: var(--theme-elevation-600);
          font-size: 13px;
        }
        .gh-bulk-upload-close {
          border: 0;
          background: transparent;
          color: var(--theme-text);
          font-size: 28px;
          cursor: pointer;
        }
        .gh-bulk-upload-body {
          overflow-y: auto;
          padding: 20px 22px;
        }
        .gh-bulk-upload-picker {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          padding: 0 14px;
          border: 1px solid var(--theme-elevation-400);
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
        }
        .gh-bulk-upload-picker input {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
        }
        .gh-bulk-upload-note { margin-top: 12px; }
        .gh-bulk-upload-list {
          display: grid;
          gap: 12px;
          margin-top: 18px;
        }
        .gh-bulk-upload-item {
          display: grid;
          grid-template-columns: 64px minmax(140px, 0.8fr) minmax(220px, 1.5fr) auto;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border: 1px solid var(--theme-elevation-250);
          border-radius: 8px;
          background: var(--theme-elevation-50);
        }
        .gh-bulk-upload-thumb {
          display: block;
          width: 64px;
          height: 64px;
          object-fit: cover;
          border: 1px solid var(--theme-elevation-250);
          border-radius: 6px;
          background: var(--theme-elevation-100);
        }
        .gh-bulk-upload-thumb--placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--theme-elevation-600);
          font-size: 11px;
          font-weight: 600;
        }
        .gh-bulk-upload-file,
        .gh-bulk-upload-alt {
          display: grid;
          gap: 6px;
          min-width: 0;
        }
        .gh-bulk-upload-file strong {
          overflow-wrap: anywhere;
          font-size: 13px;
        }
        .gh-bulk-upload-file span,
        .gh-bulk-upload-alt span {
          color: var(--theme-elevation-600);
          font-size: 12px;
        }
        .gh-bulk-upload-alt input {
          width: 100%;
          min-height: 38px;
          padding: 8px 10px;
          border: 1px solid var(--theme-elevation-400);
          border-radius: 5px;
          background: var(--theme-elevation-0);
          color: var(--theme-text);
        }
        .gh-bulk-upload-remove,
        .gh-bulk-upload-cancel,
        .gh-bulk-upload-submit {
          min-height: 36px;
          padding: 7px 12px;
          border: 1px solid var(--theme-elevation-400);
          border-radius: 6px;
          background: transparent;
          color: var(--theme-text);
          cursor: pointer;
          font-size: 12px;
        }
        .gh-bulk-upload-submit {
          margin-left: 8px;
          border-color: #7a63bd;
          background: #514080;
          color: white;
          font-weight: 600;
        }
        .gh-bulk-upload-submit:disabled,
        .gh-bulk-upload-remove:disabled,
        .gh-bulk-upload-cancel:disabled,
        .gh-bulk-upload-close:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .gh-bulk-upload-progress { color: var(--theme-success-600); }
        .gh-bulk-upload-error { color: var(--theme-error-500); }
        .gh-bulk-upload-footer {
          border-top: 1px solid var(--theme-elevation-200);
          border-bottom: 0;
          font-size: 12px;
        }
        .gh-bulk-upload-footer > span { color: var(--theme-elevation-600); }
        @media (max-width: 600px) {
          .gh-bulk-upload-overlay { padding: 8px; }
          .gh-bulk-upload-header,
          .gh-bulk-upload-footer { padding: 14px; }
          .gh-bulk-upload-body { padding: 14px; }
          .gh-bulk-upload-item { grid-template-columns: 1fr; }
          .gh-bulk-upload-remove { justify-self: start; }
        }
      `}</style>
    </>
  );
};

export default BulkMediaUpload;
