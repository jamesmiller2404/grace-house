"use client";

import Image from "next/image";
import { useState } from "react";

export type Memory = {
  image: string;
  alt: string;
  caption: string;
};

const INITIAL_COUNT = 3;

/**
 * "Maria memories..." — the graduate's personal photos, per
 * photoshop_assets/story-page-section4.png. Shows three at a time;
 * "View more →" reveals the rest (and collapses again).
 */
export default function MemoriesGallery({
  name,
  memories,
}: {
  name: string;
  memories: Memory[];
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = memories.length > INITIAL_COUNT;
  const visible = expanded ? memories : memories.slice(0, INITIAL_COUNT);

  return (
    <section aria-labelledby="memories-heading" className="mt-16">
      <h2 id="memories-heading" className="font-heading text-anchor text-4xl">
        {name} memories&hellip;
      </h2>

      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((memory) => (
          <li key={memory.image}>
            <div className="border-ink/70 relative aspect-[4/3] overflow-hidden rounded-lg border">
              <Image
                src={memory.image}
                alt={memory.alt}
                fill
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="text-ink/80 mt-2 text-base">{memory.caption}</p>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="text-terra hover:text-anchor mt-4 inline-flex items-center gap-2 text-lg font-semibold underline underline-offset-4"
        >
          {expanded ? "View fewer" : "View more"} <span aria-hidden>→</span>
        </button>
      )}
    </section>
  );
}