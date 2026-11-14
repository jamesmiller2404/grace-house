"use client";
import { useForm, useFormFields } from "@payloadcms/ui";
import type { EventDetail } from "@/content/events";
import React, { useEffect, useMemo, useRef, useState } from "react";
type Data = Record<string, unknown>;
const record = (v: unknown): Data => v && typeof v === "object" && !Array.isArray(v) ? v as Data : {};
const text = (v: unknown, fallback = ""): string => typeof v === "string" ? v : fallback;
const rows = (v: unknown): Data[] => Array.isArray(v) ? v.map(record) : [];
const mediaId = (v: unknown): string => {
  if (typeof v === "string" || typeof v === "number") return String(v);
  const item = record(v); return item.id == null ? "" : String(item.id);
};
const mediaUrl = (v: unknown): string => { const item = record(v); return text(item.url, text(item.thumbnailURL)); };
function selectedContact(choice: unknown, custom: unknown, registered: Data[], fallback: string) {
  const key = text(choice);
  if (key === "custom") return text(custom, fallback);
  if (key.startsWith("registered:")) return text(registered.find((item) => String(item.id) === key.slice(11))?.value, fallback);
  return text(registered[0]?.value, fallback);
}
function isoDate(value: unknown): string {
  if (typeof value !== "string" || !value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
}
export default function EventsPreviewField() {
  const fields = useFormFields(([state]) => state);
  const { getData } = useForm();
  const data = useMemo(() => { void fields; return record(getData()); }, [fields, getData]);
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [ready, setReady] = useState(false);
  const [contacts, setContacts] = useState<{ phones: Data[]; emails: Data[] }>({ phones: [], emails: [] });
  const [resolvedMedia, setResolvedMedia] = useState<Record<string, string>>({});
  const frameRef = useRef<HTMLIFrameElement>(null);
  const mediaValues = useMemo(() => [data.image, ...rows(data.blocks).map((block) => block.image)], [data.image, data.blocks]);
  const imageKeys = useMemo(() => [...new Set(mediaValues.map(mediaId).filter(Boolean))], [mediaValues]);
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    void fetch("/api/globals/contact-info?depth=0", { credentials: "same-origin", signal: controller.signal })
      .then((r) => r.ok ? r.json() : null).then((payload: unknown) => {
        const doc = record(record(payload).doc ?? payload);
        setContacts({ phones: rows(doc.phoneNumbers), emails: rows(doc.emails) });
      }).catch(() => undefined);
    return () => controller.abort();
  }, [open]);
  useEffect(() => {
    if (!open || imageKeys.length === 0) { setResolvedMedia({}); return; }
    const controller = new AbortController();
    void Promise.all(imageKeys.map(async (id) => {
      const current = mediaValues.find((value) => mediaId(value) === id);
      const direct = mediaUrl(current);
      if (direct) return [id, direct] as const;
      try {
        const response = await fetch("/api/media/" + encodeURIComponent(id) + "?depth=0", { credentials: "same-origin", signal: controller.signal });
        if (!response.ok) return [id, ""] as const;
        const payload: unknown = await response.json();
        const doc = record(record(payload).doc ?? payload);
        const thumbnail = record(record(doc.sizes).thumbnail);
        return [id, text(doc.url, text(thumbnail.url))] as const;
      } catch { return [id, ""] as const; }
    })).then((entries) => setResolvedMedia(Object.fromEntries(entries))).catch(() => undefined);
    return () => controller.abort();
  }, [open, imageKeys, mediaValues]);
  const preview = useMemo<EventDetail>(() => {
    const contactData = record(data.contact);
    const phone = selectedContact(contactData.phoneChoice, contactData.phoneCustom, contacts.phones, "(916) 555-5555");
    const email = selectedContact(contactData.emailChoice, contactData.emailCustom, contacts.emails, "ghemail@gmail.com");
    const imageFor = (value: unknown) => mediaUrl(value) || resolvedMedia[mediaId(value)] || "";
    return {
      slug: "preview", title: text(data.title, "Event Title"), description: text(data.description),
      status: text(data.status, "Upcoming"), date: isoDate(data.date), startTime: text(data.startTime),
      endTime: text(data.endTime), location: text(data.location, "Event Location"), city: text(data.city),
      cost: text(data.cost, "Free"), image: imageFor(data.image),
      imagePositionX: typeof data.imagePositionX === "number" ? data.imagePositionX : 50,
      imagePositionY: typeof data.imagePositionY === "number" ? data.imagePositionY : 50,
      blocks: rows(data.blocks).flatMap<EventDetail["blocks"][number]>((block): EventDetail["blocks"][number][] => {
        if (block.type === "Photo") {
          const image = imageFor(block.image);
          return image ? [{ type: "Photo" as const, image, caption: text(block.caption) }] : [];
        }
        if (block.type === "Heading" || block.type === "Paragraph") return [{ type: block.type, text: text(block.text) }];
        return [];
      }),
      contact: { questions: "Questions?", phone: "Call " + phone + " or", email: "Email " + email },
    };
  }, [data, contacts, resolvedMedia]);
  useEffect(() => {
    if (!open) return;
    const receive = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (record(event.data).type === "grace-house:event-preview-ready") setReady(true);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [open]);
  useEffect(() => {
    if (open && ready) frameRef.current?.contentWindow?.postMessage({ type: "grace-house:event-preview", event: preview }, window.location.origin);
  }, [open, ready, preview]);
  useEffect(() => {
    if (!open) return;
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); setReady(false); } };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", keydown); };
  }, [open]);
  const close = () => { setOpen(false); setReady(false); };
  return (
    <div className="gh-story-preview-field">
      <button type="button" className="gh-story-preview-launch" onClick={() => { setReady(false); setOpen(true); }}>Preview Event</button>
      <span className="gh-story-preview-hint">Preview the event page as it will appear on the website. Unsaved changes are included.</span>
      {open && <div className="gh-story-preview-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
        <section className="gh-story-preview-dialog" role="dialog" aria-modal="true" aria-label="Event preview">
          <header className="gh-story-preview-toolbar">
            <div className="gh-story-preview-heading"><strong>Event Preview</strong><span>Unsaved changes · Live preview</span></div>
            <div className="gh-story-preview-actions">
              <div className="gh-story-preview-device-switch" aria-label="Preview size">
                <button type="button" className={device === "desktop" ? "is-active" : ""} aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Desktop</button>
                <button type="button" className={device === "mobile" ? "is-active" : ""} aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}>Mobile</button>
              </div>
              <button type="button" className="gh-story-preview-close" onClick={close}>Close</button>
            </div>
          </header>
          <div className={"gh-story-preview-stage " + (device === "mobile" ? "is-mobile" : "is-desktop")}>
            <iframe ref={frameRef} title="Live event preview" src="/event-preview" className="gh-story-preview-frame" style={{ width: device === "mobile" ? "390px" : "100%" }} />
          </div>
        </section>
      </div>}
    </div>
  );
}
