"use client";

import { useForm, useFormFields } from "@payloadcms/ui";
import type { CustomPageBlock, CustomPageContent } from "@/content/customPages";
import { customPageSlug } from "@/content/customPages";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Data = Record<string, unknown>;
const record = (value: unknown): Data =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Data : {};
const text = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;
const rows = (value: unknown): Data[] =>
  Array.isArray(value) ? value.map(record) : [];
const mediaId = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  const item = record(value);
  return item.id == null ? "" : String(item.id);
};
const mediaUrl = (value: unknown): string => {
  const item = record(value);
  return text(item.url, text(item.thumbnailURL));
};

export default function CustomPagesPreviewField() {
  const fields = useFormFields(([state]) => state);
  const { getData } = useForm();
  const data = useMemo(() => { void fields; return record(getData()); }, [fields, getData]);
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [ready, setReady] = useState(false);
  const [resolvedMedia, setResolvedMedia] = useState<Record<string, string>>({});
  const frameRef = useRef<HTMLIFrameElement>(null);
  const mediaValues = useMemo(() => rows(data.blocks).map((block) => block.image), [data.blocks]);
  const imageKeys = useMemo(() => [...new Set(mediaValues.map(mediaId).filter(Boolean))], [mediaValues]);

  useEffect(() => {
    if (!open || imageKeys.length === 0) { setResolvedMedia({}); return; }
    const controller = new AbortController();
    void Promise.all(imageKeys.map(async (id) => {
      const current = mediaValues.find((value) => mediaId(value) === id);
      const direct = mediaUrl(current);
      if (direct) return [id, direct] as const;
      try {
        const response = await fetch("/api/media/" + encodeURIComponent(id) + "?depth=0", {
          credentials: "same-origin",
          signal: controller.signal,
        });
        if (!response.ok) return [id, ""] as const;
        const payload: unknown = await response.json();
        const doc = record(record(payload).doc ?? payload);
        const thumbnail = record(record(doc.sizes).thumbnail);
        return [id, text(doc.url, text(thumbnail.url))] as const;
      } catch { return [id, ""] as const; }
    })).then((entries) => setResolvedMedia(Object.fromEntries(entries))).catch(() => undefined);
    return () => controller.abort();
  }, [open, imageKeys, mediaValues]);

  const preview = useMemo<CustomPageContent>(() => {
    const title = text(data.title, "Page Name");
    const blocks: CustomPageBlock[] = rows(data.blocks).flatMap((block) => {
      if (block.type === "Photo") {
        const image = mediaUrl(block.image) || resolvedMedia[mediaId(block.image)] || "";
        if (!image) return [];
        const media = record(block.image);
        return [{
          type: "photo" as const,
          image,
          alt: text(media.alt),
          caption: text(block.caption) || undefined,
        }];
      }
      const body = text(block.text);
      if (!body.trim()) return [];
      return [{
        type: block.type === "Heading" ? "heading" as const : "paragraph" as const,
        text: body,
        linkLabel: text(block.linkLabel) || undefined,
        linkHref: text(block.linkHref) || undefined,
      }];
    });
    return { title, slug: customPageSlug(title), blocks };
  }, [data, resolvedMedia]);

  useEffect(() => {
    if (!open) return;
    const receive = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (record(event.data).type === "grace-house:custom-page-preview-ready") setReady(true);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [open]);

  useEffect(() => {
    if (open && ready) {
      frameRef.current?.contentWindow?.postMessage(
        { type: "grace-house:custom-page-preview", page: preview },
        window.location.origin,
      );
    }
  }, [open, ready, preview]);

  useEffect(() => {
    if (!open) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); setReady(false); }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", keydown);
    };
  }, [open]);

  const close = () => { setOpen(false); setReady(false); };

  return (
    <div className="gh-story-preview-field">
      <button type="button" className="gh-story-preview-launch" onClick={() => { setReady(false); setOpen(true); }}>
        Preview Custom Page
      </button>
      <span className="gh-story-preview-hint">
        Preview the page as it will appear on the website. Unsaved changes are included.
      </span>
      {open && (
        <div className="gh-story-preview-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}>
          <section className="gh-story-preview-dialog" role="dialog" aria-modal="true" aria-label="Custom page preview">
            <header className="gh-story-preview-toolbar">
              <div className="gh-story-preview-heading">
                <strong>Custom Page Preview</strong>
                <span>Unsaved changes · Live preview</span>
              </div>
              <div className="gh-story-preview-actions">
                <div className="gh-story-preview-device-switch" aria-label="Preview size">
                  <button type="button" className={device === "desktop" ? "is-active" : ""} aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Desktop</button>
                  <button type="button" className={device === "mobile" ? "is-active" : ""} aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}>Mobile</button>
                </div>
                <button type="button" className="gh-story-preview-close" onClick={close}>Close</button>
              </div>
            </header>
            <div className={"gh-story-preview-stage " + (device === "mobile" ? "is-mobile" : "is-desktop")}>
              <iframe
                ref={frameRef}
                title="Live custom page preview"
                src="/custom-page-preview"
                className="gh-story-preview-frame"
                style={{ width: device === "mobile" ? "390px" : "100%" }}
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
