"use client";

import { useForm, useFormFields } from "@payloadcms/ui";
import type { HeroProps } from "@/sections/Hero";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Data = Record<string, unknown>;
const record = (value: unknown): Data =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Data : {};
const text = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;
const mediaId = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  const item = record(value);
  return item.id == null ? "" : String(item.id);
};
const mediaUrl = (value: unknown): string => {
  const item = record(value);
  return text(item.url, text(item.thumbnailURL));
};

export default function HeroPreviewField() {
  const fields = useFormFields(([state]) => state);
  const { getData } = useForm();
  const data = useMemo(() => { void fields; return record(getData()); }, [fields, getData]);
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [ready, setReady] = useState(false);
  const [resolvedMedia, setResolvedMedia] = useState<Record<string, string>>({});
  const frameRef = useRef<HTMLIFrameElement>(null);
  const imageId = mediaId(data.image);

  useEffect(() => {
    if (!open || !imageId) { setResolvedMedia({}); return; }
    const direct = mediaUrl(data.image);
    if (direct) {
      setResolvedMedia({ [imageId]: direct });
      return;
    }
    const controller = new AbortController();
    void fetch("/api/media/" + encodeURIComponent(imageId) + "?depth=0", {
      credentials: "same-origin",
      signal: controller.signal,
    }).then((response) => response.ok ? response.json() : null)
      .then((payload: unknown) => {
        if (!payload) return;
        const doc = record(record(payload).doc ?? payload);
        const thumbnail = record(record(doc.sizes).thumbnail);
        const url = text(doc.url, text(thumbnail.url));
        setResolvedMedia(url ? { [imageId]: url } : {});
      }).catch(() => undefined);
    return () => controller.abort();
  }, [open, imageId, data.image]);

  const preview = useMemo<HeroProps>(() => ({
    heading: text(data.heading, "Hope Starts Here"),
    eyebrow: text(data.eyebrow),
    image: mediaUrl(data.image) || resolvedMedia[imageId] || "/images/hero1a.jpg",
    primaryCta: { label: "Get Help", href: "#help" },
    secondaryCta: { label: "Our Stories", href: "/#stories" },
  }), [data, imageId, resolvedMedia]);

  useEffect(() => {
    if (!open) return;
    const receive = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (record(event.data).type === "grace-house:hero-preview-ready") setReady(true);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [open]);

  useEffect(() => {
    if (open && ready) {
      frameRef.current?.contentWindow?.postMessage(
        { type: "grace-house:hero-preview", hero: preview },
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
        Preview Hero
      </button>
      <span className="gh-story-preview-hint">
        Preview the homepage hero as it will appear on the website. Unsaved changes are included.
      </span>
      {open && (
        <div className="gh-story-preview-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}>
          <section className="gh-story-preview-dialog" role="dialog" aria-modal="true" aria-label="Hero preview">
            <header className="gh-story-preview-toolbar">
              <div className="gh-story-preview-heading">
                <strong>Hero Preview</strong>
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
                title="Live hero preview"
                src="/hero-preview"
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
