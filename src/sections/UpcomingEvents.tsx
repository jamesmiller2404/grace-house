"use client";

import Link from "next/link";
import { useState } from "react";
import ViewControls, {
  SortArrows,
  type ViewMode,
  type SortState,
} from "@/components/ViewControls";
import type { EventItem } from "@/content/events";

export type UpcomingEventsProps = {
  heading: string;
  subtitle?: string;
  events: EventItem[];
  cta?: { label: string; href: string };
  /**
   * Render the card/list and date/name display controls. Only the dedicated
   * /events page opts in; the homepage section stays exactly as before.
   */
  showControls?: boolean;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Parse an ISO date (YYYY-MM-DD) without timezone drift. */
function parseISODate(iso: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return undefined;
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Render an ISO date as MM-DD-YYYY, as in the list view mockup. */
function formatEventDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return match ? `${match[2]}-${match[3]}-${match[1]}` : iso;
}

/** Month / day / weekday tile shared by the card and list layouts. */
function DateTile({ date }: { date: Date }) {
  return (
    <div className="bg-ink flex h-24 w-20 shrink-0 flex-col items-center justify-center rounded-md text-center">
      <span className="text-lift text-sm font-semibold tracking-[0.1em] uppercase">
        {MONTHS[date.getMonth()]}
      </span>
      <span className="font-heading text-cream text-4xl leading-none">
        {date.getDate()}
      </span>
      <span className="text-lift mt-1 text-sm font-semibold tracking-[0.1em] uppercase">
        {WEEKDAYS[date.getDay()]}
      </span>
    </div>
  );
}

type EventSortKey = "title" | "date" | "location" | "time";

/** Initial order: soonest event first. */
const INITIAL_SORT: SortState<EventSortKey> = {
  key: "date",
  ascending: true,
};

export default function UpcomingEvents({
  heading,
  subtitle,
  events,
  cta,
  showControls,
}: UpcomingEventsProps) {
  const [view, setView] = useState<ViewMode>("card");
  const [sort, setSort] = useState<SortState<EventSortKey>>(INITIAL_SORT);

  // Clicking a column's arrows makes that column the active sort; clicking
  // the same column again flips the direction.
  function toggleSort(key: EventSortKey) {
    setSort((prev) =>
      prev.key === key
        ? { key, ascending: !prev.ascending }
        : { key, ascending: true },
    );
  }

  // Sorting only applies when the display controls are shown, so the
  // homepage order never changes.
  const sorted = showControls
    ? [...events].sort((a, b) => {
        let cmp = 0;
        switch (sort.key) {
          case "title":
            cmp = a.title.localeCompare(b.title);
            break;
          case "date":
            cmp =
              a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
            break;
          case "location":
            cmp =
              a.location.localeCompare(b.location) ||
              a.title.localeCompare(b.title);
            break;
          case "time":
            cmp = a.time.localeCompare(b.time);
            break;
        }
        return sort.ascending ? cmp : -cmp;
      })
    : events;

  return (
    <section id="events" className="bg-sand px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-anchor text-5xl">{heading}</h2>
        {subtitle && <p className="mt-4 text-lg">{subtitle}</p>}

        {showControls && (
          <div className="mt-8">
            <ViewControls view={view} onViewChange={setView} />
          </div>
        )}

        {showControls && view === "list" ? (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-ink/80 border-b-2">
                  <th
                    scope="col"
                    className="text-ink py-3 pr-4 text-lg font-bold"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort("title")}
                      className="hover:text-terra inline-flex items-center transition"
                    >
                      Event
                      <SortArrows
                        label="Event"
                        active={sort.key === "title"}
                        ascending={sort.ascending}
                        onClick={() => toggleSort("title")}
                      />
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="text-ink py-3 pr-4 text-lg font-bold"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort("date")}
                      className="hover:text-terra inline-flex items-center transition"
                    >
                      Date
                      <SortArrows
                        label="Date"
                        active={sort.key === "date"}
                        ascending={sort.ascending}
                        onClick={() => toggleSort("date")}
                      />
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="text-ink py-3 pr-4 text-lg font-bold"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort("location")}
                      className="hover:text-terra inline-flex items-center transition"
                    >
                      Location
                      <SortArrows
                        label="Location"
                        active={sort.key === "location"}
                        ascending={sort.ascending}
                        onClick={() => toggleSort("location")}
                      />
                    </button>
                  </th>
                  <th scope="col" className="text-ink py-3 text-lg font-bold">
                    <button
                      type="button"
                      onClick={() => toggleSort("time")}
                      className="hover:text-terra inline-flex items-center transition"
                    >
                      Time
                      <SortArrows
                        label="Time"
                        active={sort.key === "time"}
                        ascending={sort.ascending}
                        onClick={() => toggleSort("time")}
                      />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((event, i) => (
                  <tr
                    key={`list-${event.title}-${event.date}-${event.time}-${i}`}
                    className="border-ink/40 hover:bg-ink/5 border-b transition-colors"
                  >
                    <td className="font-heading text-ink py-4 pr-4 text-xl font-bold">
                      <Link
                        href={event.href}
                        className="focus-visible:outline-terra hover:text-terra focus-visible:outline-2"
                      >
                        {event.title}
                      </Link>
                    </td>
                    <td className="text-ink py-4 pr-4 text-lg">
                      {formatEventDate(event.date)}
                    </td>
                    <td className="text-ink py-4 pr-4 text-lg">
                      {event.location}
                    </td>
                    <td className="text-ink py-4 text-lg">{event.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((event, i) => {
              const date = parseISODate(event.date);
              return (
                <li
                  key={`${event.title}-${event.date}-${event.time}-${i}`}
                  className="flex flex-col rounded-lg bg-white p-6 shadow-sm"
                >
                  <Link
                    href={event.href}
                    className="group flex h-full flex-col focus-visible:outline-terra focus-visible:outline-2"
                  >
                    {/* Date tile */}
                    {date && <DateTile date={date} />}

                    {/* Title */}
                    <h3 className="font-heading text-anchor group-hover:text-terra mt-4 text-3xl leading-tight">
                      {event.title}
                    </h3>

                    {/* One-line description */}
                    <p className="text-ink/80 mt-2 text-base">{event.description}</p>

                    {/* Time range */}
                    <p className="text-ink mt-4 text-base font-semibold">
                      {event.time} - {event.endTime}
                    </p>

                    {/* Venue */}
                    <p className="text-ink mt-1 text-base">{event.location}</p>

                    {/* City */}
                    <p className="text-ink mt-1 text-base">{event.city}</p>

                    {/* Cost */}
                    <p className="text-ink mt-1 text-base font-semibold">
                      {event.cost}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {cta && (
          <Link
            href={cta.href}
            className="text-terra hover:text-lift mt-10 inline-flex items-center gap-2 text-xl font-semibold"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
