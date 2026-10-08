import Image from "next/image";
import Link from "next/link";
import type { EventDetail } from "@/content/events";

export type EventPageProps = {
  event: EventDetail;
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
const FULL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Parse an ISO date (YYYY-MM-DD) without timezone drift. */
function parseISODate(iso: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return undefined;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * Generic single-event page (mockup in
 * photoshop_assets/eventPage-genericMockup.png). Data-driven so every
 * `/events/<slug>` page renders the same layout with its own copy and photo.
 */
export default function EventPage({ event }: EventPageProps) {
  const date = parseISODate(event.date);

  return (
    <div className="bg-cream min-h-screen">
      {/* Breadcrumb — Events › <event title> */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-6 pt-8 text-base">
        <ol className="text-terra flex flex-wrap items-center gap-2 font-bold">
          <li>
            <Link href="/events" className="underline-offset-4 hover:underline">
              Events
            </Link>
          </li>
          <li aria-hidden className="text-ink/60 font-normal">›</li>
          <li aria-current="page">{event.title}</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)]">
          {/* Left column: header, photo, about */}
          <div>
            <header>
              <span className="border-ink inline-block rounded-full border px-4 py-1.5 text-xs font-bold tracking-[0.08em] uppercase">
                {event.status}
              </span>
              <h1 className="font-heading text-anchor mt-4 text-5xl leading-tight sm:text-6xl">
                {event.title}
              </h1>

              <p className="text-ink/80 mt-3 max-w-prose text-lg">
                {event.description}
              </p>

              <dl className="mt-6 space-y-1.5 text-lg">
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-bold">When</dt>
                  <dd>
                    - {date ? `${WEEKDAYS[date.getDay()]}, ${FULL_MONTHS[date.getMonth()]} ${date.getDate()}, ` : ""}
                    {event.startTime} - {event.endTime}
                  </dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-bold">Venue</dt>
                  <dd>- {event.location}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-bold">City</dt>
                  <dd>- {event.city}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-bold">Cost</dt>
                  <dd>- {event.cost}</dd>
                </div>
              </dl>
            </header>
            <div className="border-ink relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-lg border-2">
              <Image
                src={event.image}
                alt={event.title}
                fill
                priority
                sizes="(min-width:1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>

            <section className="mt-10">
              <h2 className="font-heading text-anchor text-3xl">About Event</h2>
              {event.about.map((p, i) => (
                <p key={i} className="mt-3 max-w-prose">
                  {p}
                </p>
              ))}
            </section>

            <section className="mt-8">
              <h2 className="font-heading text-anchor text-3xl">What to Expect</h2>
              {event.whatToExpect.map((p, i) => (
                <p key={i} className="mt-3 max-w-prose">
                  {p}
                </p>
              ))}
            </section>
          </div>

          {/* Right column: date card, then who it's for + contact */}
          <div className="space-y-6 lg:pt-1">
            <div className="border-gold rounded-lg border-2 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                {date && (
                  <div className="bg-ink flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-md text-center">
                    <span className="text-lift text-xs font-bold tracking-[0.1em] uppercase">
                      {MONTHS[date.getMonth()]}
                    </span>
                    <span className="font-heading text-cream text-2xl leading-none">
                      {date.getDate()}
                    </span>
                  </div>
                )}
                <p className="text-lg font-semibold">
                  {date
                    ? `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
                    : ""}
                  <br />
                  {event.startTime} - {event.endTime}
                </p>
              </div>
              <hr className="border-ink/15 my-4" />
              <ul className="space-y-2 text-lg font-semibold">
                <li>
                  <a
                    href="#add-to-calendar"
                    className="text-terra hover:text-lift underline underline-offset-4"
                  >
                    Add to calendar
                  </a>
                </li>
                <li>
                  <a
                    href="#copy-link"
                    className="text-terra hover:text-lift underline underline-offset-4"
                  >
                    Copy link to share
                  </a>
                </li>
              </ul>
            </div>

            <div className="border-ink rounded-lg border-2 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-anchor text-xl">Contact</h2>
              <p className="mt-3">{event.contact.questions}</p>
              <p>
                {event.contact.phone}
                <br />
                {event.contact.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}