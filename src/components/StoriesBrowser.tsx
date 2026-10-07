"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ViewControls, {
  type ViewMode,
  type SortMode,
} from "@/components/ViewControls";
import type { StoryItem } from "@/content/stories";

export type StoriesBrowserProps = {
  stories: StoryItem[];
};

/**
 * Interactive index of every profile/story for the Lives Changed page.
 * Card view reuses the homepage "Lives Changed" card style; list view shows
 * the same people as compact rows. Sort toggles between date (soonest
 * first) and name (A→Z) via the shared ViewControls toolbar.
 */
export default function StoriesBrowser({ stories }: StoriesBrowserProps) {
  const [view, setView] = useState<ViewMode>("card");
  const [sort, setSort] = useState<SortMode>("date");

  const sorted = [...stories].sort((a, b) =>
    sort === "name"
      ? a.name.localeCompare(b.name)
      : a.date.localeCompare(b.date),
  );

  return (
    <>
      <div className="mt-8">
        <ViewControls
          view={view}
          sort={sort}
          onViewChange={setView}
          onSortChange={setSort}
        />
      </div>

      {view === "card" ? (
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((story) => (
            <li key={story.href} className="flex">
              <Link
                href={story.href}
                className="group focus-visible:outline-terra flex flex-1 flex-col overflow-hidden bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] focus-visible:outline-2"
              >
                <div className="border-ink/70 relative aspect-[4/3] shrink-0 border-b">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="bg-lift text-ink inline-block self-start rounded-md px-4 py-1.5 text-sm font-bold tracking-[0.05em] uppercase">
                    {story.tag}
                  </span>
                  <h2 className="font-heading text-anchor mt-4 text-3xl italic">
                    {story.name}
                  </h2>
                  <p className="mt-2 text-base italic">{story.excerpt}</p>
                  <span className="text-terra group-hover:text-lift mt-auto inline-flex items-center gap-2 pt-6 text-lg font-semibold">
                    {story.readLabel}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-10 flex flex-col gap-4">
          {sorted.map((story) => (
            <li key={story.href} className="flex">
              <Link
                href={story.href}
                className="group focus-visible:outline-terra flex flex-1 items-stretch gap-6 overflow-hidden bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] focus-visible:outline-2"
              >
                <div className="border-ink/70 relative hidden aspect-[4/3] w-44 shrink-0 overflow-hidden border-r sm:block">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    sizes="176px"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center py-1 pr-2">
                  <span className="bg-lift text-ink inline-block self-start rounded-md px-4 py-1.5 text-sm font-bold tracking-[0.05em] uppercase">
                    {story.tag}
                  </span>
                  <h2 className="font-heading text-anchor mt-3 text-2xl italic">
                    {story.name}
                  </h2>
                  <p className="mt-1 text-base italic">{story.excerpt}</p>
                  <span className="text-terra group-hover:text-lift mt-auto inline-flex items-center gap-2 pt-4 text-lg font-semibold">
                    {story.readLabel}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
