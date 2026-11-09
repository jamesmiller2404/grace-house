"use client";

import React, { useEffect, useState } from "react";
import StoryProfile from "@/components/StoryProfile";
import type { StoryProfile as StoryProfileData } from "@/content/storyProfiles";

function isStoryProfile(value: unknown): value is StoryProfileData {
  if (!value || typeof value !== "object") return false;
  const profile = value as Record<string, unknown>;
  return (
    typeof profile.name === "string" &&
    typeof profile.tag === "string" &&
    typeof profile.image === "string" &&
    Array.isArray(profile.body) &&
    Array.isArray(profile.memories) &&
    typeof profile.quoteBand === "object" &&
    typeof profile.closing === "object" &&
    typeof profile.pronouns === "object"
  );
}

export default function StoryPreviewFrame() {
  const [profile, setProfile] = useState<StoryProfileData | null>(null);

  useEffect(() => {
    const receivePreview = (event: MessageEvent<unknown>) => {
      if (event.source !== window.parent || event.origin !== window.location.origin) return;
      if (!event.data || typeof event.data !== "object") return;

      const message = event.data as { type?: unknown; profile?: unknown };
      if (message.type === "grace-house:story-preview" && isStoryProfile(message.profile)) {
        setProfile(message.profile);
      }
    };

    window.addEventListener("message", receivePreview);
    window.parent.postMessage(
      { type: "grace-house:story-preview-ready" },
      window.location.origin,
    );
    return () => window.removeEventListener("message", receivePreview);
  }, []);

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-sand px-6 text-center text-ink">
        <p>Open this preview from the Lives Changed editor.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <StoryProfile profile={profile} preview />
    </main>
  );
}
