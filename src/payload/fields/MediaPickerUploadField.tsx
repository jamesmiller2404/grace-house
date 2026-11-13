"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { UploadField, useConfig, useField } from "@payloadcms/ui";
import type { UploadFieldClientProps } from "payload";

type MediaDocument = {
  id: number | string;
  alt?: string | null;
  filename?: string | null;
  url?: string | null;
  thumbnailURL?: string | null;
  width?: number | null;
  height?: number | null;
};

type MediaFindResponse = {
  docs?: MediaDocument[];
  page?: number;
  totalPages?: number;
  totalDocs?: number;
};

function getRelationshipID(value: unknown): number | string | null {
  if (typeof value === "number" || typeof value === "string") {
    return value || null;
  }

  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    return typeof id === "number" || typeof id === "string" ? id : null;
  }

  return null;
}

function getMediaDocument(value: unknown): MediaDocument | null {
  if (
    value &&
    typeof value === "object" &&
    "id" in value &&
    ("url" in value || "filename" in value || "alt" in value)
  ) {
    return value as MediaDocument;
  }

  return null;
}

/**
 * Keeps Payload's native upload field and adds a larger, searchable visual
 * browser for choosing an existing document from the Media collection.
 * The form value remains the Media document ID, exactly as for a normal
 * Payload upload field.
 */
const MediaPickerUploadField: React.FC<UploadFieldClientProps> = (props) => {
  const { config } = useConfig();
  const fieldRef = useRef<HTMLDivElement>(null);
  const { path } = props;
  const { value, setValue } = useField({ path });

  const relationTo = props.field.relationTo;
  const collectionSlug =
    typeof relationTo === "string" ? relationTo : relationTo[0];

  const currentID = useMemo(() => getRelationshipID(value), [value]);
  const isProfilePhoto = path === "image";
  const [profilePhoto, setProfilePhoto] = useState<MediaDocument | null>(getMediaDocument(value));

  const apiRoot = useMemo(() => {
    const apiRoute = config.routes.api.replace(/\/$/, "");
    return `${apiRoute}/${collectionSlug}`;
  }, [collectionSlug, config.routes.api]);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<MediaDocument[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<MediaDocument | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Present one clear path for each action: our "New Photo" button
  // activates Payload's native upload/URL workflow, while the separate
  // Browse Media Library button opens the visual picker below. Hide the
  // native duplicate actions without replacing Payload's upload mechanics.
  useEffect(() => {
    const root = fieldRef.current;
    if (!root) return;

    const simplifyNativeActions = () => {
      const buttons = root.querySelectorAll<HTMLElement>("button, a");
      buttons.forEach((button) => {
        const label = (button.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
        if (label === "create new" || label.includes("create new")) {
          button.hidden = true;
          button.setAttribute("aria-hidden", "true");
          button.tabIndex = -1;
        } else if (label.includes("choose from existing")) {
          button.hidden = true;
          button.setAttribute("aria-hidden", "true");
          button.tabIndex = -1;
        }
      });
    };

    simplifyNativeActions();
    const observer = new MutationObserver(simplifyNativeActions);
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  const openNativeUpload = () => {
    const root = fieldRef.current;
    if (!root) return;
    const createButton = Array.from(
      root.querySelectorAll<HTMLElement>("button, a"),
    ).find((button) =>
      (button.textContent || "").replace(/\s+/g, " ").trim().toLowerCase().includes("create new"),
    );
    createButton?.click();
  };

  const openPicker = () => {
    setSearch("");
    setSearchTerm("");
    setPage(1);
    setError("");
    setShowPreview(false);
    setSelectedMedia(getMediaDocument(value));
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showPreview) {
          setShowPreview(false);
        } else {
          setOpen(false);
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, showPreview]);

  // Load the profile portrait details for the compact inline preview.
  useEffect(() => {
    if (!isProfilePhoto || currentID === null) {
      setProfilePhoto(null);
      return;
    }
    const existing = getMediaDocument(value);
    if (existing) {
      setProfilePhoto(existing);
      return;
    }
    const controller = new AbortController();
    const loadProfilePhoto = async () => {
      try {
        const response = await fetch(
          `${apiRoot}/${encodeURIComponent(String(currentID))}?depth=0`,
          { signal: controller.signal, headers: { Accept: "application/json" } },
        );
        if (!response.ok) return;
        const document = (await response.json()) as MediaDocument;
        if (document && document.id !== undefined) setProfilePhoto(document);
      } catch (fetchError) {
        if (!(fetchError instanceof DOMException && fetchError.name === "AbortError")) setProfilePhoto(null);
      }
    };
    void loadProfilePhoto();
    return () => controller.abort();
  }, [apiRoot, currentID, isProfilePhoto, value]);

  // Fetch the currently selected Media document when the form stores only its ID.
  useEffect(() => {
    if (!open || currentID === null || selectedMedia) return;

    const controller = new AbortController();

    const loadSelected = async () => {
      try {
        const response = await fetch(
          `${apiRoot}/${encodeURIComponent(String(currentID))}?depth=0`,
          { signal: controller.signal, headers: { Accept: "application/json" } },
        );

        if (!response.ok) return;

        const document = (await response.json()) as MediaDocument;
        if (document && document.id !== undefined) {
          setSelectedMedia(document);
        }
      } catch (fetchError) {
        if (!(fetchError instanceof DOMException && fetchError.name === "AbortError")) {
          // The gallery remains usable even when the current selection cannot be loaded.
        }
      }
    };

    void loadSelected();

    return () => controller.abort();
  }, [apiRoot, currentID, open, selectedMedia]);

  // Debounce text input so mobile users do not trigger a request on every keystroke.
  useEffect(() => {
    if (!open) return;

    const timeout = window.setTimeout(() => {
      setSearchTerm(search.trim());
      setPage(1);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [open, search]);

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();

    const loadMedia = async () => {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        depth: "0",
        limit: "24",
        page: String(page),
        sort: "-updatedAt",
      });

      if (searchTerm) {
        params.set("where[or][0][filename][like]", searchTerm);
        params.set("where[or][1][alt][like]", searchTerm);
      }

      try {
        const response = await fetch(`${apiRoot}?${params.toString()}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Media request failed (${response.status}).`);
        }

        const result = (await response.json()) as MediaFindResponse;
        setItems(Array.isArray(result.docs) ? result.docs : []);
        setTotalPages(
          typeof result.totalPages === "number" && result.totalPages > 0
            ? result.totalPages
            : 1,
        );
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Could not load the Media library.",
        );
        setItems([]);
        setTotalPages(1);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadMedia();

    return () => controller.abort();
  }, [apiRoot, open, page, searchTerm]);

  const chooseMedia = () => {
    if (!selectedMedia || props.readOnly) return;

    setValue(selectedMedia.id);
    setOpen(false);
  };

  return (
    <div className={`gh-media-picker-field${isProfilePhoto ? " gh-media-picker-field--profile-photo" : ""}`} ref={fieldRef}>
      <UploadField {...props} />
      {isProfilePhoto && profilePhoto && currentID !== null && (
        <div className="gh-profile-photo-preview">
          {(profilePhoto.thumbnailURL || profilePhoto.url) && (
            <img src={profilePhoto.thumbnailURL || profilePhoto.url || ""} alt={profilePhoto.alt || profilePhoto.filename || "Selected profile photo"} />
          )}
          <button type="button" className="gh-profile-photo-preview__remove" onClick={() => { setValue(null); setProfilePhoto(null); }} aria-label="Remove profile photo" title="Remove profile photo">×</button>
        </div>
      )}
      {!props.readOnly && (
        <button
          className="gh-media-picker__new-button"
          type="button"
          onClick={openNativeUpload}
        >
          New Photo
        </button>
      )}

      {!props.readOnly && (
        <button
          className="gh-media-picker__open-button"
          type="button"
          onClick={openPicker}
          aria-haspopup="dialog"
        >
          Browse Media Library
        </button>
      )}

      {open &&
        createPortal(
          <div
            className="gh-media-picker"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <section
              className="gh-media-picker__dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gh-media-picker-title"
            >
              <header className="gh-media-picker__header">
                <div>
                  <h2 id="gh-media-picker-title">Choose a photo</h2>
                  <p>Browse the Media library and preview a photo before choosing it.</p>
                </div>
                <button
                  className="gh-media-picker__close"
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close Media library"
                >
                  ×
                </button>
              </header>

              {!showPreview ? (
                <>
                  <div className="gh-media-picker__search">
                    <label htmlFor="gh-media-picker-search">Search by filename or description</label>
                    <input
                      id="gh-media-picker-search"
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.currentTarget.value)}
                      placeholder="Search photos..."
                    />
                  </div>

                  <div className="gh-media-picker__grid" aria-live="polite">
                    {loading ? (
                      <p className="gh-media-picker__message">Loading photos…</p>
                    ) : error ? (
                      <p className="gh-media-picker__message gh-media-picker__error">{error}</p>
                    ) : items.length === 0 ? (
                      <p className="gh-media-picker__message">
                        {searchTerm ? "No photos match that search." : "There are no photos in the Media library yet."}
                      </p>
                    ) : (
                      items.map((item) => {
                        const imageURL = item.url || item.thumbnailURL;
                        const title = item.alt || item.filename || `Photo ${item.id}`;

                        return (
                          <button
                            className="gh-media-picker__tile"
                            type="button"
                            key={String(item.id)}
                            onClick={() => {
                              setSelectedMedia(item);
                              setShowPreview(true);
                            }}
                          >
                            <span className="gh-media-picker__thumb">
                              {imageURL ? (
                                <img src={imageURL} alt="" loading="lazy" />
                              ) : (
                                <span className="gh-media-picker__no-image">Preview unavailable</span>
                              )}
                            </span>
                            <span className="gh-media-picker__tile-title">{title}</span>
                            {item.filename && item.filename !== title && (
                              <span className="gh-media-picker__filename">{item.filename}</span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>

                  <footer className="gh-media-picker__footer">
                    <span className="gh-media-picker__page">
                      Page {page} of {totalPages}
                    </span>
                    <div className="gh-media-picker__page-actions">
                      <button
                        type="button"
                        className="gh-media-picker__secondary"
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        disabled={page <= 1 || loading}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        className="gh-media-picker__secondary"
                        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                        disabled={page >= totalPages || loading}
                      >
                        Next
                      </button>
                    </div>
                  </footer>
                </>
              ) : (
                <div className="gh-media-picker__preview">
                  <button
                    type="button"
                    className="gh-media-picker__back"
                    onClick={() => setShowPreview(false)}
                  >
                    ← Back to photos
                  </button>

                  {selectedMedia?.url || selectedMedia?.thumbnailURL ? (
                    <img
                      className="gh-media-picker__preview-image"
                      src={selectedMedia.url || selectedMedia.thumbnailURL || ""}
                      alt={selectedMedia.alt || selectedMedia.filename || "Selected photo"}
                    />
                  ) : (
                    <div className="gh-media-picker__preview-unavailable">
                      A larger preview is not available for this photo.
                    </div>
                  )}

                  <div className="gh-media-picker__preview-details">
                    <strong>
                      {selectedMedia?.alt || selectedMedia?.filename || "Selected photo"}
                    </strong>
                    {selectedMedia?.filename && <span>{selectedMedia.filename}</span>}
                    {selectedMedia?.width && selectedMedia?.height && (
                      <span>
                        {selectedMedia.width} × {selectedMedia.height} pixels
                      </span>
                    )}
                  </div>

                  <div className="gh-media-picker__preview-actions">
                    <button
                      type="button"
                      className="gh-media-picker__secondary"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="gh-media-picker__choose"
                      onClick={chooseMedia}
                      disabled={!selectedMedia}
                    >
                      Use this photo
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default MediaPickerUploadField;
