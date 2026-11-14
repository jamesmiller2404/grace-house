"use client";

import { useForm, useFormFields } from "@payloadcms/ui";
import type { HelpStripProps } from "@/sections/HelpStrip";
import React, { useEffect, useMemo, useState } from "react";

type RecordValue = Record<string, unknown>;
const record = (value: unknown): RecordValue =>
  value && typeof value === "object" && !Array.isArray(value) ? value as RecordValue : {};
const text = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : [];

function buildPreview(data: RecordValue, registeredPhones: RecordValue[]): HelpStripProps {
  const choice = text(data.phoneChoice);
  const phone = choice === "custom"
    ? text(data.phoneCustom, "(916) 470-0408")
    : choice.startsWith("registered:")
      ? text(registeredPhones.find((item) => item.id === choice.slice(11))?.value, "(916) 470-0408")
      : "(916) 470-0408";
  const showAssessment = data.showAssessment !== false;
  return {
    heading: text(data.heading, "Need help now?"),
    body: text(data.body),
    ...(showAssessment ? {
      assessmentNote: text(data.assessmentNote) || undefined,
      cta: {
        label: text(data.ctaLabel, "Start Assessment"),
        href: text(data.ctaHref, "/assessment"),
      },
      ctaNote: text(data.ctaNote) || undefined,
    } : {}),
    phone,
    phoneHref: `tel:${phone.replace(/[^\d+]/g, "")}`,
    hours: text(data.hours),
    facts: list(data.facts).map((item) => text(record(item).text)).filter(Boolean),
    crisisTitle: text(data.crisisTitle) || undefined,
    crisisLines: list(data.crisisLines).map((item) => ({
      label: text(record(item).label),
      text: text(record(item).text),
      href: text(record(item).href),
    })).filter((item) => item.label || item.text),
  };
}

export default function GetHelpNowPreviewField() {
  const fields = useFormFields(([state]) => state);
  const { getData } = useForm();
  const data = useMemo(() => {
    void fields;
    return record(getData());
  }, [fields, getData]);
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [registeredPhones, setRegisteredPhones] = useState<RecordValue[]>([]);
  const [ready, setReady] = useState(false);

  const preview = useMemo(() => buildPreview(data, registeredPhones), [data, registeredPhones]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    void fetch("/api/globals/contact-info?depth=0", {
      credentials: "same-origin",
      signal: controller.signal,
    }).then((response) => response.ok ? response.json() : null)
      .then((payload: unknown) => {
        const global = record(record(payload).doc ?? payload);
        setRegisteredPhones(list(global.phoneNumbers).map(record));
      }).catch(() => undefined);
    return () => controller.abort();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const receive = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== document.querySelector<HTMLIFrameElement>(".gh-help-preview-frame")?.contentWindow) return;
      const message = record(event.data);
      if (message.type === "grace-house:help-preview-ready") setReady(true);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [open]);

  useEffect(() => {
    if (!open || !ready) return;
    document.querySelector<HTMLIFrameElement>(".gh-help-preview-frame")?.contentWindow?.postMessage(
      { type: "grace-house:help-preview", props: preview },
      window.location.origin,
    );
  }, [open, ready, preview]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); setReady(false); }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const close = () => { setOpen(false); setReady(false); };

  return (
    <div className="gh-story-preview-field">
      <button type="button" className="gh-story-preview-launch" onClick={() => { setReady(false); setOpen(true); }}>
        Preview Page
      </button>
      <span className="gh-story-preview-hint">
        Preview the Get Help Now section as it will appear on the website. Unsaved changes are included.
      </span>
      {open && (
        <div className="gh-story-preview-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}>
          <section className="gh-story-preview-dialog" role="dialog" aria-modal="true" aria-label="Get Help Now page preview">
            <header className="gh-story-preview-toolbar">
              <div className="gh-story-preview-heading">
                <strong>Get Help Now Preview</strong>
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
            <div className={`gh-story-preview-stage ${device === "mobile" ? "is-mobile" : "is-desktop"}`}>
              <iframe title="Live Get Help Now preview" src="/help-preview" className="gh-story-preview-frame gh-help-preview-frame" style={{ width: device === "mobile" ? "390px" : "100%" }} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
