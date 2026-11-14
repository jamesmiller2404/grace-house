"use client";

import React, { useEffect, useState } from "react";
import Footer, { type FooterProps } from "@/components/Footer";

function isFooterProps(value: unknown): value is FooterProps {
  if (!value || typeof value !== "object") return false;
  const props = value as Record<string, unknown>;
  return typeof props.phone === "string" && typeof props.email === "string"
    && typeof props.brandName === "string" && typeof props.memorialPhoto === "string";
}

export default function FooterPreviewFrame() {
  const [props, setProps] = useState<FooterProps | null>(null);
  useEffect(() => {
    const receive = (event: MessageEvent<unknown>) => {
      if (event.source !== window.parent || event.origin !== window.location.origin || !event.data || typeof event.data !== "object") return;
      const message = event.data as { type?: unknown; props?: unknown };
      if (message.type === "grace-house:footer-preview" && isFooterProps(message.props)) setProps(message.props);
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "grace-house:footer-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);

  if (!props) return <main className="flex min-h-screen items-center justify-center bg-[#040d1d] text-white">Open this preview from the Footer editor.</main>;
  return <main className="min-h-screen flex flex-col justify-end"><Footer {...props} /></main>;
}
