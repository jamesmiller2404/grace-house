"use client";
import React, { useEffect, useState } from "react";
import EventPage from "@/components/EventPage";
import type { EventDetail } from "@/content/events";
function isEvent(value: unknown): value is EventDetail {
  if (!value || typeof value !== "object") return false;
  const event = value as Record<string, unknown>;
  return typeof event.title === "string" && typeof event.date === "string"
    && typeof event.location === "string" && Array.isArray(event.blocks)
    && !!event.contact && typeof event.contact === "object";
}
export default function EventPreviewFrame() {
  const [event, setEvent] = useState<EventDetail | null>(null);
  useEffect(() => {
    const receive = (message: MessageEvent<unknown>) => {
      if (message.source !== window.parent || message.origin !== window.location.origin || !message.data || typeof message.data !== "object") return;
      const data = message.data as { type?: unknown; event?: unknown };
      if (data.type === "grace-house:event-preview" && isEvent(data.event)) setEvent(data.event);
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "grace-house:event-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);
  if (!event) return <main className="flex min-h-screen items-center justify-center bg-cream text-ink">Open this preview from the Events editor.</main>;
  return <main className="min-h-screen bg-cream"><EventPage event={event} /></main>;
}
