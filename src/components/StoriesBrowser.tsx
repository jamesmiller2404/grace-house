"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ViewControls, {
  SortArrows,
  type ViewMode,
  type SortState,
} from "@/components/ViewControls";
import type { StoryItem } from "@/content/stories";
import { pillars } from "@/content/pillars";

export type StoriesBrowserProps = {
  stories: StoryItem[];
};

type StorySortKey = "name" | "date" | "quote" | "pillar";

/** Initial order: graduation date, earliest first. */
const INITIAL_SORT: SortState<StorySortKey> = {
  key: "date",
  ascending: true,
};

/** Strip decorative quotation marks so quotes sort alphabetically. */
function stripQuotes(text: string): string {
  return text.replace(/[“”"'’]/g, "");
}

/** Render the ISO graduation date the way the mockup shows it: 05-30-2026. */
function formatGraduationDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return match ? `${match[2]}-${match[3]}-${match[1]}` : iso;
}

/**
 * Interactive index of every profile/story for the Lives Changed page.
 * Card view reuses the homepage "Lives Changed" card style; list view is the
 * sortable table from photoshop_assets/listView.png — Name, Graduation Date,
 * Quote and The Pillar columns, each with up/down arrows that take control of
 * the order (clicking again reverses it).
 */
export default function StoriesBrowser({ stories }: StoriesBrowserProps) {
  const [view, setView] = useState<ViewMode>("card");
  const [sort, setSort] = useState<SortState<StorySortKey>>(INITIAL_SORT);

  // Clicking a column's arrows makes that column the active sort; clicking
  // the same column again flips the direction.
  function toggleSort(key: StorySortKey) {
    setSort((prev) =>
      prev.key === key
        ? { key, ascending: !prev.ascending }
        : { key, ascending: true },
    );
  }

  const sorted = [...stories].sort((a, b) => {
    let cmp = 0;
    switch (sort.key) {
      case "name":
        cmp = a.name.localeCompare(b.name);
        break;
      case "date":
        cmp = a.date.localeCompare(b.date); // ISO strings sort chronologically
        break;
      case "quote":
        cmp = stripQuotes(a.excerpt).localeCompare(stripQuotes(b.excerpt));
        break;
      case "pillar":
        // Group by pillar number first, then alphabetically within each pillar
        cmp = a.pillarIndex - b.pillarIndex || a.name.localeCompare(b.name);
        break;
    }
    return sort.ascending ? cmp : -cmp;
  });

  return (
    <>
      <div className="mt-8">
        <ViewControls view={view} onViewChange={setView} />
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
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-ink/80 border-b-2">
                <th scope="col" className="text-ink py-3 pr-4 text-lg font-bold">
                  <button
                    type="button"
                    onClick={() => toggleSort("name")}
                    className="hover:text-terra inline-flex items-center transition"
                  >
                    Name
                    <SortArrows
                      label="Name"
                      active={sort.key === "name"}
                      ascending={sort.ascending}
                      onClick={() => toggleSort("name")}
                    />
                  </button>
                </th>
                <th scope="col" className="text-ink py-3 pr-4 text-lg font-bold">
                  <button
                    type="button"
                    onClick={() => toggleSort("date")}
                    className="hover:text-terra inline-flex items-center transition"
                  >
                    Graduation Date
                    <SortArrows
                      label="Graduation Date"
                      active={sort.key === "date"}
                      ascending={sort.ascending}
                      onClick={() => toggleSort("date")}
                    />
                  </button>
                </th>
                <th scope="col" className="text-ink py-3 pr-4 text-lg font-bold">
                  <button
                    type="button"
                    onClick={() => toggleSort("quote")}
                    className="hover:text-terra inline-flex items-center transition"
                  >
                    Quote
                    <SortArrows
                      label="Quote"
                      active={sort.key === "quote"}
                      ascending={sort.ascending}
                      onClick={() => toggleSort("quote")}
                    />
                  </button>
                </th>
                <th scope="col" className="text-ink py-3 text-lg font-bold">
                  <button
                    type="button"
                    onClick={() => toggleSort("pillar")}
                    className="hover:text-terra inline-flex items-center transition"
                  >
                    The Pillar
                    <SortArrows
                      label="The Pillar"
                      active={sort.key === "pillar"}
                      ascending={sort.ascending}
                      onClick={() => toggleSort("pillar")}
                    />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((story) => (
                <tr
                  key={story.href}
                  className="border-ink/40 hover:bg-ink/5 border-b transition-colors"
                >
                  <td className="font-heading text-ink py-4 pr-4 text-xl font-bold">
                    <Link
                      href={story.href}
                      className="focus-visible:outline-terra hover:text-terra focus-visible:outline-2"
                    >
                      {story.name}
                    </Link>
                  </td>
                  <td className="text-ink py-4 pr-4 text-lg">
                    {formatGraduationDate(story.date)}
                  </td>
                  <td className="text-ink py-4 pr-4 text-lg italic">
                    {story.excerpt}
                  </td>
                  <td className="text-ink py-4 text-lg">
                    {pillars[story.pillarIndex]?.title ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}