"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ViewControls, {
  SortArrows,
  type ViewMode,
  type SortState,
} from "@/components/ViewControls";
import { formatStoryDate, storyDateLabel } from "@/lib/formatStoryDate";
import type { StoryItem } from "@/content/stories";
import { pillars } from "@/content/pillars";

export type StoriesBrowserProps = {
  stories: StoryItem[];
};

type StorySortKey = "name" | "date" | "pillar";

/** Initial order: graduation date, earliest first. */
const INITIAL_SORT: SortState<StorySortKey> = {
  key: "date",
  ascending: true,
};

/** Render the story date (MM/DD/YYYY or MM/YYYY) the way the mockup shows it: 05-30-2026. */
function formatGraduationDate(date: string): string {
  const full = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(date);
  if (full) {
    return `${full[1].padStart(2, "0")}-${full[2].padStart(2, "0")}-${full[3]}`;
  }
  const monthYear = /^(\d{1,2})\/(\d{4})$/.exec(date);
  if (monthYear) {
    return `${monthYear[1].padStart(2, "0")}-${monthYear[2]}`;
  }
  return date;
}

/** Sort key for a story date — handles MM/DD/YYYY and MM/YYYY. */
function dateSortKey(date: string): string {
  const full = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(date);
  if (full) {
    return `${full[3]}${full[1].padStart(2, "0")}${full[2].padStart(2, "0")}`;
  }
  const monthYear = /^(\d{1,2})\/(\d{4})$/.exec(date);
  if (monthYear) {
    return `${monthYear[2]}${monthYear[1].padStart(2, "0")}00`;
  }
  return date;
}

/**
 * Interactive index of every profile/story for the Lives Changed page.
 * Card view reuses the homepage "Lives Changed" card style; list view is the
 * sortable table — Name, Graduation Date and The Pillar columns, each with
 * up/down arrows that take control of the order (clicking again reverses it).
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
        cmp = dateSortKey(a.date).localeCompare(dateSortKey(b.date));
        break;
      case "pillar":
        // Profiles without an optional pillar sort after profiles with one.
        cmp =
          (a.pillarIndex ?? Number.MAX_SAFE_INTEGER) -
            (b.pillarIndex ?? Number.MAX_SAFE_INTEGER) ||
          a.name.localeCompare(b.name);
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
                  {story.date && (
                    <p className="text-ink/70 mt-1 text-sm font-semibold">
                      {storyDateLabel(story.tag)} {formatStoryDate(story.date)}
                    </p>
                  )}
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
          <table className="w-full min-w-[600px] border-collapse text-left">
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
                  <td className="text-ink py-4 text-lg">
                    {story.pillarIndex == null ? "" : pillars[story.pillarIndex]?.title ?? ""}
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