import Link from "next/link";
import type { EventItem } from "@/content/events";

export type UpcomingEventsProps = {
  heading: string;
  subtitle?: string;
  events: EventItem[];
  cta?: { label: string; href: string };
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
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default function UpcomingEvents({
  heading,
  subtitle,
  events,
  cta,
}: UpcomingEventsProps) {
  return (
    <section id="events" className="bg-sand px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-anchor text-5xl">{heading}</h2>
        {subtitle && <p className="mt-4 text-lg">{subtitle}</p>}

        <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => {
            const date = parseISODate(event.date);
            return (
              <li
                key={`${event.title}-${event.date}-${event.time}-${i}`}
                className="flex flex-col rounded-lg bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-5">
                  {date && (
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
                  )}
                  <div>
                    <span className="bg-lift text-ink inline-block rounded-full px-3 py-1 text-xs font-bold tracking-[0.08em] uppercase">
                      {event.category}
                    </span>
                    <h3 className="font-heading text-anchor mt-2 text-3xl leading-tight">
                      {event.title}
                    </h3>
                  </div>
                </div>

                <p className="mt-4 text-base">
                  {event.location}
                  <br />
                  {event.time}
                </p>

                <Link
                  href={event.href}
                  className="text-terra hover:text-lift mt-auto inline-flex items-center gap-2 pt-6 text-lg font-semibold"
                >
                  View event
                </Link>
              </li>
            );
          })}
        </ul>

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
