"use client";

import { useForm, useFormFields } from "@payloadcms/ui";
import type { StoryProfile } from "@/content/storyProfiles";
import { pillars } from "@/content/pillars";
import React, { useEffect, useMemo, useRef, useState } from "react";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asText(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function directMediaUrl(value: unknown): string | undefined {
  if (typeof value === "string" && (/^https?:\/\//i.test(value) || value.startsWith("/"))) {
    return value;
  }
  const record = asRecord(value);
  if (typeof record.url === "string" && record.url) return record.url;
  if (typeof record.thumbnailURL === "string" && record.thumbnailURL) return record.thumbnailURL;
  if (record.value !== undefined) return directMediaUrl(record.value);
  return undefined;
}

function mediaId(value: unknown): string | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string") {
    if (!value || value.startsWith("/") || /^https?:\/\//i.test(value)) return undefined;
    return value;
  }
  const record = asRecord(value);
  if (record.url || record.thumbnailURL) return undefined;
  if (record.value !== undefined) return mediaId(record.value);
  if (record.id !== undefined && record.id !== null) return mediaId(record.id);
  return undefined;
}

function resolveMedia(
  value: unknown,
  resolvedMedia: Record<string, string>,
  fallback: string,
): string {
  const direct = directMediaUrl(value);
  if (direct) return direct;
  const id = mediaId(value);
  return (id && resolvedMedia[id]) || fallback;
}

function pronounsForGender(gender: unknown) {
  if (gender === "Male") return { subject: "he", possessive: "his" };
  if (gender === "Female") return { subject: "she", possessive: "her" };
  return { subject: "they", possessive: "their" };
}

function buildPreviewProfile(
  data: UnknownRecord,
  resolvedMedia: Record<string, string>,
): StoryProfile {
  const name = asText(data.name, "Your Story");
  const role = asText(data.role, "Graduate");
  const tag = role === "Other" ? asText(data.roleLabel, "Other") : role;

  type StoryBodyBlock =
  | { type: "photo"; image: string; caption?: string }
  | { type: "h2"; text: string }
  | { type: "p"; text: string };

 const body: StoryBodyBlock[] = asArray(data.body).flatMap(
    (item): StoryBodyBlock[] => {
      const block = asRecord(item);
      const type = block.type;

      if (type === "Photo") {
        const imageValue = block.image;
        if (!imageValue) return [];

        return [{
          type: "photo",
          image: resolveMedia(imageValue, resolvedMedia, "/images/noPhotoAvailable_horizontall.png"),
          caption: asText(block.caption) || undefined,
        }];
      }

      if (type === "Heading") {
        return [{ type: "h2", text: asText(block.text) }];
      }

      if (type === "Paragraph") {
        return [{ type: "p", text: asText(block.text) }];
      }

      return [];
    }
  );

  const bannerQuote = asRecord(data.bannerQuote);
  const closing = asRecord(data.closing);
  const pillarTitle = asText(data.pillar);
  const pillarIndex = data.showPillar === true
    ? pillars.findIndex((pillar) => pillar.title === pillarTitle)
    : -1;

  const memories = asArray(data.memories).flatMap((item) => {
    const memory = asRecord(item);
    if (!memory.image) return [];
    return [{
      image: resolveMedia(memory.image, resolvedMedia, "/images/noPhotoAvailable_horizontall.png"),
      alt: asText(memory.alt),
      caption: asText(memory.caption),
    }];
  });

  return {
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "preview",
    name,
    tag,
    date: asText(data.date) || undefined,
    image: resolveMedia(data.image, resolvedMedia, "/images/noPhotoAvailable_vertical.png"),
    imagePositionX: typeof data.imagePositionX === "number" ? data.imagePositionX : 50,
    imagePositionY: typeof data.imagePositionY === "number" ? data.imagePositionY : 50,
    heroQuote: data.showPullQuote !== false ? asText(data.pullQuote) : "",
    body,
    quoteBand: {
      quote: data.showBannerQuote !== false ? asText(bannerQuote.quote) : "",
      attribution: data.showBannerQuote !== false ? asText(bannerQuote.attribution) : "",
    },
    closing: {
      heading: asText(closing.heading),
      paragraphs: asArray(closing.paragraphs).map((paragraph) => asText(asRecord(paragraph).text)),
    },
    pillarIndex: pillarIndex >= 0 ? pillarIndex : null,
    pronouns: pronounsForGender(data.gender),
    showMemories: data.showMemories !== false,
    memories,
  };
}

function collectMediaIds(data: UnknownRecord): string[] {
  const candidates: unknown[] = [data.image];
  for (const block of asArray(data.body)) candidates.push(asRecord(block).image);
  for (const memory of asArray(data.memories)) candidates.push(asRecord(memory).image);
  return [...new Set(candidates.map(mediaId).filter((id): id is string => Boolean(id)))];
}

export default function StoryPreviewField() {
  const formFields = useFormFields(([fields]) => fields);
  const { getData } = useForm();
  //const draftData = useMemo(() => asRecord(getData()), [formFields, getData]);
  const draftData = useMemo(() => {
  void formFields;
  return asRecord(getData());
  }, [formFields, getData]);
  const [resolvedMedia, setResolvedMedia] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [frameLoaded, setFrameLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const mediaIds = useMemo(() => collectMediaIds(draftData), [draftData]);
  const mediaIdsKey = mediaIds.join("|");

  useEffect(() => {
    if (!isOpen || !mediaIdsKey) return;
    const controller = new AbortController();
    const ids = mediaIdsKey.split("|").filter(Boolean);

    void Promise.all(ids.map(async (id) => {
      try {
        const response = await fetch(`/api/media/${encodeURIComponent(id)}?depth=0`, {
          credentials: "same-origin",
          signal: controller.signal,
        });
        if (!response.ok) return null;
        const payload: unknown = await response.json();
        const document = asRecord(asRecord(payload).doc ?? payload);
        const sizes = asRecord(document.sizes);
        const thumbnail = asRecord(sizes.thumbnail);
        const url =
          asText(document.url) ||
          asText(document.thumbnailURL) ||
          asText(thumbnail.url);
        return url ? [id, url] as const : null;
      } catch {
        return null;
      }
    })).then((results) => {
      if (controller.signal.aborted) return;
      const updates: Record<string, string> = {};
      for (const result of results) {
        if (result) updates[result[0]] = result[1];
      }
      if (Object.keys(updates).length) {
        setResolvedMedia((current) => ({ ...current, ...updates }));
      }
    });

    return () => controller.abort();
  }, [isOpen, mediaIdsKey]);

  const previewProfile = useMemo(
    () => buildPreviewProfile(draftData, resolvedMedia),
    [draftData, resolvedMedia],
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleFrameMessage = (event: MessageEvent<unknown>) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== iframeRef.current?.contentWindow ||
        !event.data ||
        typeof event.data !== "object"
      ) {
        return;
      }
      if ((event.data as { type?: unknown }).type === "grace-house:story-preview-ready") {
        setFrameLoaded(true);
      }
    };
    window.addEventListener("message", handleFrameMessage);
    return () => window.removeEventListener("message", handleFrameMessage);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !frameLoaded) return;
    iframeRef.current?.contentWindow?.postMessage(
      { type: "grace-house:story-preview", profile: previewProfile },
      window.location.origin,
    );
  }, [isOpen, frameLoaded, previewProfile]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setFrameLoaded(false);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closePreview = () => {
    setIsOpen(false);
    setFrameLoaded(false);
  };

  return (
    <div className="gh-story-preview-field">
      <button
        type="button"
        className="gh-story-preview-launch"
        onClick={() => {
          setFrameLoaded(false);
          setIsOpen(true);
        }}
      >
        Preview Profile
      </button>
      <span className="gh-story-preview-hint">
        Preview the profile as it will appear on the website. Unsaved changes are included.
      </span>

      {isOpen && (
        <div className="gh-story-preview-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closePreview();
        }}>
          <section
            className="gh-story-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Story profile preview"
          >
            <header className="gh-story-preview-toolbar">
              <div className="gh-story-preview-heading">
                <strong>Profile Preview</strong>
                <span>Unsaved changes · Live preview</span>
              </div>
              <div className="gh-story-preview-actions">
                <div className="gh-story-preview-device-switch" aria-label="Preview size">
                  <button
                    type="button"
                    className={device === "desktop" ? "is-active" : ""}
                    aria-pressed={device === "desktop"}
                    onClick={() => setDevice("desktop")}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    className={device === "mobile" ? "is-active" : ""}
                    aria-pressed={device === "mobile"}
                    onClick={() => setDevice("mobile")}
                  >
                    Mobile
                  </button>
                </div>
                <button type="button" className="gh-story-preview-close" onClick={closePreview}>
                  Close
                </button>
              </div>
            </header>
            <div className={`gh-story-preview-stage ${device === "mobile" ? "is-mobile" : "is-desktop"}`}>
              <iframe
                ref={iframeRef}
                title="Live story profile preview"
                src="/story-preview"
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
