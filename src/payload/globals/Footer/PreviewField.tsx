"use client";

import { useForm, useFormFields } from "@payloadcms/ui";
import type { FooterProps } from "@/components/Footer";
import { site } from "@/content/site";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Data = Record<string, unknown>;
const record = (v: unknown): Data => v && typeof v === "object" && !Array.isArray(v) ? v as Data : {};
const text = (v: unknown, fallback = ""): string => typeof v === "string" ? v : fallback;
const rows = (v: unknown): Data[] => Array.isArray(v) ? v.map(record) : [];
const phoneHref = (v: string) => `tel:${v.replace(/[^\\d+]/g, "")}`;

function selectedContact(choice: unknown, custom: unknown, registered: Data[], fallback: string) {
  const key = text(choice);
  if (key === "custom") return text(custom, fallback);
  if (key.startsWith("registered:")) {
    return text(registered.find((item) => String(item.id) === key.slice(11))?.value, fallback);
  }
  return text(registered[0]?.value, fallback);
}

function mediaId(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  const item = record(value);
  return item.id == null ? "" : String(item.id);
}

export default function FooterPreviewField() {
  const fields = useFormFields(([state]) => state);
  const { getData } = useForm();
  const data = useMemo(() => { void fields; return record(getData()); }, [fields, getData]);
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [ready, setReady] = useState(false);
  const [contacts, setContacts] = useState<{ phones: Data[]; emails: Data[]; addresses: Data[] }>({ phones: [], emails: [], addresses: [] });
  const [photoUrl, setPhotoUrl] = useState("");
  const frameRef = useRef<HTMLIFrameElement>(null);

  const photo = record(data.memorialPhoto);
  const photoKey = mediaId(data.memorialPhoto);
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    void fetch("/api/globals/contact-info?depth=0", { credentials: "same-origin", signal: controller.signal })
      .then((r) => r.ok ? r.json() : null)
      .then((payload: unknown) => {
        const doc = record(record(payload).doc ?? payload);
        setContacts({ phones: rows(doc.phoneNumbers), emails: rows(doc.emails), addresses: rows(doc.addresses) });
      }).catch(() => undefined);
    return () => controller.abort();
  }, [open]);

  useEffect(() => {
    if (!open || !photoKey) { setPhotoUrl(""); return; }
    if (typeof photo.url === "string" && photo.url) { setPhotoUrl(photo.url); return; }
    const controller = new AbortController();
    void fetch(`/api/media/${encodeURIComponent(photoKey)}?depth=0`, { credentials: "same-origin", signal: controller.signal })
      .then((r) => r.ok ? r.json() : null)
      .then((payload: unknown) => {
        const doc = record(record(payload).doc ?? payload);
        const thumb = record(record(doc.sizes).thumbnail);
        setPhotoUrl(text(doc.url, text(thumb.url)));
      }).catch(() => setPhotoUrl(""));
    return () => controller.abort();
  }, [open, photoKey, photo.url]);

  const preview = useMemo<FooterProps>(() => {
    const phone = selectedContact(data.phoneChoice, data.phoneCustom, contacts.phones, site.phone);
    const email = selectedContact(data.emailChoice, data.emailCustom, contacts.emails, site.email);
    const address = selectedContact(data.addressChoice, data.addressCustom, contacts.addresses, "");
    return {
      phone, phoneHref: phoneHref(phone), email, address: address || undefined,
      brandName: text(data.brandName, "Grace House"),
      brandTagline: text(data.brandTagline, "NOR CAL"),
      missionText: text(data.missionText, "To see families restored and give hope to the hopeless."),
      memorialPhoto: photoUrl || "/images/pastorLonnie2a.jpg",
      memorialPhotoAlt: text(data.memorialPhotoAlt, "Pastor Lonnie"),
      memorialName: text(data.memorialName, "Lonnie W. Nix"),
      memorialDates: text(data.memorialDates, "1956–2021"),
      getHelpLabel: text(data.getHelpLabel, "Get Help"),
      hoursText: text(data.hoursText, "Mon–Fri, 9am–5pm"),
      intakesText: text(data.intakesText, "Intakes on weekdays only"),
    };
  }, [data, contacts, photoUrl]);

  useEffect(() => {
    if (!open) return;
    const receive = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (record(event.data).type === "grace-house:footer-preview-ready") setReady(true);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [open]);

  useEffect(() => {
    if (!open || !ready) return;
    frameRef.current?.contentWindow?.postMessage({ type: "grace-house:footer-preview", props: preview }, window.location.origin);
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
      <button type="button" className="gh-story-preview-launch" onClick={() => { setReady(false); setOpen(true); }}>
        Preview Footer
      </button>
      <span className="gh-story-preview-hint">Preview the footer as it will appear on the website. Unsaved changes are included.</span>
      {open && (
        <div className="gh-story-preview-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section className="gh-story-preview-dialog" role="dialog" aria-modal="true" aria-label="Footer preview">
            <header className="gh-story-preview-toolbar">
              <div className="gh-story-preview-heading"><strong>Footer Preview</strong><span>Unsaved changes · Live preview</span></div>
              <div className="gh-story-preview-actions">
                <div className="gh-story-preview-device-switch" aria-label="Preview size">
                  <button type="button" className={device === "desktop" ? "is-active" : ""} aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Desktop</button>
                  <button type="button" className={device === "mobile" ? "is-active" : ""} aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}>Mobile</button>
                </div>
                <button type="button" className="gh-story-preview-close" onClick={close}>Close</button>
              </div>
            </header>
            <div className={`gh-story-preview-stage ${device === "mobile" ? "is-mobile" : "is-desktop"}`}>
              <iframe ref={frameRef} title="Live footer preview" src="/footer-preview" className="gh-story-preview-frame" style={{ width: device === "mobile" ? "390px" : "100%" }} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
