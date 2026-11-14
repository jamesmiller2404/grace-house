"use client";

import React, { useEffect, useState } from "react";
import Hero, { type HeroProps } from "@/sections/Hero";

function isHero(value: unknown): value is HeroProps {
  if (!value || typeof value !== "object") return false;
  const hero = value as Record<string, unknown>;
  return typeof hero.heading === "string"
    && typeof hero.eyebrow === "string"
    && typeof hero.image === "string";
}

export default function HeroPreviewFrame() {
  const [hero, setHero] = useState<HeroProps | null>(null);

  useEffect(() => {
    const receive = (message: MessageEvent<unknown>) => {
      if (
        message.source !== window.parent ||
        message.origin !== window.location.origin ||
        !message.data ||
        typeof message.data !== "object"
      ) return;
      const data = message.data as { type?: unknown; hero?: unknown };
      if (data.type === "grace-house:hero-preview" && isHero(data.hero)) {
        setHero(data.hero);
      }
    };
    window.addEventListener("message", receive);
    window.parent.postMessage(
      { type: "grace-house:hero-preview-ready" },
      window.location.origin,
    );
    return () => window.removeEventListener("message", receive);
  }, []);

  if (!hero) {
    return <main className="flex min-h-screen items-center justify-center bg-cream text-ink">Open this preview from the Hero editor.</main>;
  }

  return (
    <main className="min-h-screen bg-cream">
      <Hero {...hero} />
    </main>
  );
}
