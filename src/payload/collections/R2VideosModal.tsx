"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { useConfig } from "@payloadcms/ui";
import type { BeforeListClientProps } from "payload";
import {
  isVideoFilename,
  isVideoMimeType,
  MAX_VIDEO_BYTES,
  VIDEO_EXTENSIONS,
  VIDEO_MIME_TYPES,
} from "@/payload/lib/r2Media";

type R2VideoItem = {
  key: string;
  filename: string;
  size: number;
  lastModified: string | null;
  mediaId: string | number | null;
  mimeType: string | null;
  playUrl: string;
  downloadUrl: string;
  source: "r2" | "local";
};

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

const R2VideosModal: React.FC<BeforeListClientProps> = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { config } = useConfig();
  const isMediaCollection = pathname.endsWith("/collections/media");

  const [actionsContainer, setActionsContainer] = useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [storageMode, setStorageMode] = useState<"r2" | "local">("r2");
  const [videos, setVideos] = useState<R2VideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<R2VideoItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const apiRoot = config.routes.api.replace(/\/$/, "");

  useEffect(() => {
    if (!isMediaCollection) return;

    let frame = 0;
    let slot: HTMLSpanElement | null = null;
    const findContainer = () => {
      const container = document.querySelector<HTMLElement>(".list-header__title-actions");
      if (!container) return false;

      const dashboardBtn = Array.from(
        container.querySelectorAll<HTMLElement>("a, button"),
      ).find((el) => el.textContent?.replace(/\s+/g, " ").trim().toLowerCase() === "dashboard");

      slot = document.createElement("span");
      slot.style.display = "contents";
      if (dashboardBtn) {
        container.insertBefore(slot, dashboardBtn);
      } else {
        container.appendChild(slot);
      }
      setActionsContainer(slot);
      observer.disconnect();
      return true;
    };

    const observer = new MutationObserver(() => {
      if (findContainer()) cancelAnimationFrame(frame);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    frame = requestAnimationFrame(() => {
      findContainer();
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      slot?.remove();
    };
  }, [isMediaCollection, pathname]);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiRoot}/media/r2-videos`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || `Failed to load videos (${response.status}).`);
      }
      const data = (await response.json()) as {
        mode?: "r2" | "local";
        videos?: R2VideoItem[];
      };
      setStorageMode(data.mode === "local" ? "local" : "r2");
      setVideos(Array.isArray(data.videos) ? data.videos : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load R2 videos.");
    } finally {
      setLoading(false);
    }
  }, [apiRoot]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activeVideo) {
          setActiveVideo(null);
        } else {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, activeVideo]);

  const handleUploadFile = async (file: File | undefined) => {
    if (!file || uploading) return;

    if (!isVideoMimeType(file.type) && !isVideoFilename(file.name)) {
      setError("Please select a smartphone video file (.mp4, .mov, .m4v, .webm, .3gp, .mkv).");
      return;
    }

    if (file.size > MAX_VIDEO_BYTES) {
      setError(`"${file.name}" is ${formatBytes(file.size)}. Maximum allowed video size is 220 MB.`);
      return;
    }

    setUploading(true);
    setError("");
    setUploadProgress(`Preparing upload for ${file.name}…`);

    try {
      if (storageMode === "r2") {
        const urlRes = await fetch(`${apiRoot}/media/r2-videos/upload-url`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type || "video/mp4",
            size: file.size,
          }),
        });
        if (!urlRes.ok) {
          const body = (await urlRes.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error || `Could not start R2 upload (${urlRes.status}).`);
        }
        const { uploadUrl } = (await urlRes.json()) as { uploadUrl: string };

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl, true);
          xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const pct = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(`Uploading ${file.name} to R2 Videos… ${pct}%`);
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`R2 upload failed with status ${xhr.status}.`));
            }
          };
          xhr.onerror = () => reject(new Error("Network error while uploading video to R2."));
          xhr.send(file);
        });
      } else {
        setUploadProgress(`Uploading ${file.name}…`);
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${apiRoot}/media`, {
          method: "POST",
          credentials: "include",
          headers: { Accept: "application/json" },
          body: formData,
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { message?: string } | null;
          throw new Error(body?.message || `Upload failed (${res.status}).`);
        }
      }

      setUploadProgress(`Uploaded ${file.name}.`);
      await loadVideos();
      router.refresh();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload video.");
      setUploadProgress("");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (video: R2VideoItem) => {
    const confirmed = window.confirm(
      `Delete "${video.filename}" permanently from ${storageMode === "r2" ? "R2 storage" : "local media storage"}${video.mediaId ? " and the Media Library" : ""}?`,
    );
    if (!confirmed) return;

    setDeletingKey(video.key);
    setError("");
    try {
      const response = await fetch(`${apiRoot}/media/r2-videos`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          key: video.key,
          mediaId: video.mediaId,
        }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || `Delete failed (${response.status}).`);
      }
      if (activeVideo?.key === video.key) {
        setActiveVideo(null);
      }
      setVideos((prev) => prev.filter((item) => item.key !== video.key));
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete video.");
    } finally {
      setDeletingKey(null);
    }
  };

  if (!isMediaCollection) return null;

  return (
    <>
      {actionsContainer &&
        createPortal(
          <button
            type="button"
            className="gh-dashboard-list-button"
            onClick={() => {
              setActiveVideo(null);
              setIsOpen(true);
              void loadVideos();
            }}
          >
            R2 Videos
          </button>,
          actionsContainer,
        )}

      {isOpen &&
        createPortal(
          <div
            className="gh-media-picker"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setActiveVideo(null);
                setIsOpen(false);
              }
            }}
          >
            <section
              className="gh-media-picker__dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gh-r2-videos-title"
              style={{ maxWidth: "880px" }}
            >
              <header className="gh-media-picker__header">
                <div>
                  <h2 id="gh-r2-videos-title">
                    {storageMode === "r2" ? "Videos in R2 Storage" : "Uploaded Videos (Local Dev)"}
                  </h2>
                  <p>
                    Play, download to your computer, or delete video files stored in{" "}
                    {storageMode === "r2" ? "the Cloudflare R2 bucket" : "local media storage"}.
                  </p>
                </div>
                <button
                  type="button"
                  className="gh-media-picker__close"
                  aria-label="Close R2 Videos"
                  onClick={() => {
                    setActiveVideo(null);
                    setIsOpen(false);
                  }}
                >
                  ×
                </button>
              </header>

              {error && (
                <p className="gh-media-picker__message gh-media-picker__error">{error}</p>
              )}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginBottom: "14px",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--gh-border-subtle, #312a3d)",
                  background: "var(--gh-surface-input, #100d14)",
                }}
              >
                <div style={{ fontSize: "0.85rem", color: "var(--theme-elevation-500, #ada5bc)" }}>
                  {uploadProgress ||
                    `Upload smartphone videos (.mp4, .mov, .m4v, .webm, .3gp, .mkv) up to 220 MB${storageMode === "r2" ? " into R2 Videos/" : ""}.`}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={[...VIDEO_MIME_TYPES, ...VIDEO_EXTENSIONS].join(",")}
                    style={{ display: "none" }}
                    onChange={(event) => void handleUploadFile(event.currentTarget.files?.[0])}
                  />
                  <button
                    type="button"
                    className="gh-media-picker__choose"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? "Uploading…" : "Upload Video"}
                  </button>
                </div>
              </div>

              {activeVideo && (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "1px solid var(--gh-border-subtle, #312a3d)",
                    background: "var(--gh-surface-input, #100d14)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    <strong>{activeVideo.filename}</strong>
                    <button
                      type="button"
                      className="gh-media-picker__secondary"
                      onClick={() => setActiveVideo(null)}
                    >
                      Close Player
                    </button>
                  </div>
                  <video
                    controls
                    autoPlay
                    playsInline
                    src={activeVideo.playUrl}
                    style={{
                      width: "100%",
                      maxHeight: "360px",
                      borderRadius: "8px",
                      background: "#000",
                    }}
                  />
                </div>
              )}

              <div style={{ maxHeight: "420px", overflowY: "auto" }}>
                {loading ? (
                  <p className="gh-media-picker__message">Loading videos…</p>
                ) : videos.length === 0 ? (
                  <p className="gh-media-picker__message">
                    No video files found in {storageMode === "r2" ? "R2 storage" : "local storage"}.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {videos.map((video) => (
                      <div
                        key={video.key}
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid var(--gh-border-subtle, #312a3d)",
                          background: "var(--gh-surface-card, #1d1825)",
                        }}
                      >
                        <div style={{ minWidth: 0, flex: "1 1 240px" }}>
                          <div
                            style={{
                              fontWeight: 600,
                              wordBreak: "break-word",
                              marginBottom: "2px",
                            }}
                          >
                            {video.filename}
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--theme-elevation-500, #ada5bc)",
                            }}
                          >
                            {[
                              formatBytes(video.size),
                              video.lastModified
                                ? new Date(video.lastModified).toLocaleString()
                                : null,
                              video.mediaId ? "Linked in Media Library" : "R2 object only",
                            ]
                              .filter(Boolean)
                              .join(" • ")}
                          </div>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          <button
                            type="button"
                            className="gh-media-picker__secondary"
                            onClick={() => setActiveVideo(video)}
                          >
                            Play
                          </button>
                          <a
                            href={video.downloadUrl}
                            download={video.filename}
                            className="gh-media-picker__choose"
                            style={{ textDecoration: "none" }}
                          >
                            Download
                          </a>
                          <button
                            type="button"
                            className="gh-media-picker__secondary"
                            disabled={deletingKey === video.key}
                            onClick={() => void handleDelete(video)}
                            style={{
                              borderColor: "var(--gh-danger, #c45645)",
                              color: "#f5c2ba",
                            }}
                          >
                            {deletingKey === video.key ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>,
          document.body,
        )}
    </>
  );
};

export default R2VideosModal;
