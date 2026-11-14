"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CustomPageBlocks from "@/components/CustomPageBlocks";
import type { CustomPageContent } from "@/content/customPages";

function isCustomPage(value: unknown): value is CustomPageContent {
  if (!value || typeof value !== "object") return false;
  const page = value as Record<string, unknown>;
  return typeof page.title === "string" && typeof page.slug === "string" && Array.isArray(page.blocks);
}

export default function CustomPagePreviewFrame() {
  const [page, setPage] = useState<CustomPageContent | null>(null);

  useEffect(() => {
    const receive = (message: MessageEvent<unknown>) => {
      if (
        message.source !== window.parent ||
        message.origin !== window.location.origin ||
        !message.data ||
        typeof message.data !== "object"
      ) return;
      const data = message.data as { type?: unknown; page?: unknown };
      if (data.type === "grace-house:custom-page-preview" && isCustomPage(data.page)) {
        setPage(data.page);
      }
    };
    window.addEventListener("message", receive);
    window.parent.postMessage(
      { type: "grace-house:custom-page-preview-ready" },
      window.location.origin,
    );
    return () => window.removeEventListener("message", receive);
  }, []);

  if (!page) {
    return <main className="flex min-h-screen items-center justify-center bg-cream text-ink">Open this preview from the Custom Pages editor.</main>;
  }

  return (
    <main className="bg-cream flex min-h-screen flex-1 px-6 py-14">
      <div className="mx-auto w-full max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-terra pb-1 text-base font-bold">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="underline-offset-4 hover:underline">Home</Link></li>
            <li aria-hidden className="text-ink/60 font-normal">›</li>
            <li aria-current="page">{page.title}</li>
          </ol>
        </nav>
        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h1 className="font-heading text-ink text-5xl">{page.title}</h1>
        <div className="max-w-[70ch]">
          <CustomPageBlocks blocks={page.blocks} />
        </div>
      </div>
    </main>
  );
}
