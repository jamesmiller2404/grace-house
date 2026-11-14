"use client";

import React, { useEffect, useState } from "react";
import HelpStrip, { type HelpStripProps } from "@/sections/HelpStrip";

function isPreview(value: unknown): value is HelpStripProps {
  if (!value || typeof value !== "object") return false;
  const props = value as Record<string, unknown>;
  return typeof props.heading === "string" && typeof props.body === "string"
    && typeof props.phone === "string" && typeof props.phoneHref === "string"
    && typeof props.hours === "string" && Array.isArray(props.facts)
    && Array.isArray(props.crisisLines);
}

export default function GetHelpNowPreviewFrame() {
  const [props, setProps] = useState<HelpStripProps | null>(null);
  useEffect(() => {
    const receive = (event: MessageEvent<unknown>) => {
      if (event.source !== window.parent || event.origin !== window.location.origin) return;
      if (!event.data || typeof event.data !== "object") return;
      const message = event.data as { type?: unknown; props?: unknown };
      if (message.type === "grace-house:help-preview" && isPreview(message.props)) {
        setProps(message.props);
      }
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "grace-house:help-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);

  if (!props) return <main className="flex min-h-screen items-center justify-center bg-sand text-ink">Open this preview from the Get Help Now editor.</main>;
  return <main className="min-h-screen bg-cream"><div className="mx-auto max-w-6xl px-6 pt-10"><p className="pb-1 text-base font-bold text-terra">Home&nbsp; › &nbsp;Get Help Now</p></div><HelpStrip {...props} /></main>;
}
