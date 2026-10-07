"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

export type HelpStripProps = {
  heading: string;
  openBody: string;
  closedBody: string;
  phone: string;
  phoneHref: string;
  cta: { label: string; href: string };
  ctaNote?: string;
  hours: {
    label: string;
    days: number[];
    open: number;
    close: number;
    timeZone: string;
  };
  openNowLabel: string;
  closedLabel: string;
  facts: string[];
  crisisTitle?: string;
  crisisLines: { label: string; text: string; href: string }[];
};

const DAYS: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

// No external store to subscribe to; the snapshot is recomputed each render.
const subscribeNoop = () => () => {};

function isOfficeOpen(hours: HelpStripProps["hours"], now = new Date()) {
  const { days, open, close, timeZone } = hours;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);
  const day = DAYS[parts.find((p) => p.type === "weekday")!.value];
  const hour = Number(parts.find((p) => p.type === "hour")!.value) % 24;
  return days.includes(day) && hour >= open && hour < close;
}

export default function HelpStrip({
  heading,
  openBody,
  closedBody,
  phone,
  phoneHref,
  cta,
  ctaNote,
  hours,
  openNowLabel,
  closedLabel,
  facts,
  crisisTitle,
  crisisLines,
}: HelpStripProps) {
  // null until mounted, so server and client markup match.
  // useSyncExternalStore gives us exactly that: getServerSnapshot returns null,
  // and the client snapshot is computed after hydration without setState-in-effect.
  const open = useSyncExternalStore(
    subscribeNoop,
    () => isOfficeOpen(hours),
    () => null,
  );
  const closed = open === false;

  return (
    <section
      aria-labelledby="help-title"
      className="border-gold bg-sand text-ink border-b-4"
    >
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-8 md:grid-cols-[3fr_2fr] md:gap-12">
          <div>
            <h2
              id="help-title"
              className="font-heading text-ink text-3xl font-bold md:text-4xl"
            >
              {heading}
            </h2>
            <p className="mt-2 text-lg">{closed ? closedBody : openBody}</p>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-4 max-lg:w-fit max-lg:flex-col max-lg:gap-0">
                <Link
                  href={cta.href}
                  className="bg-terra hover:bg-terra/90 rounded-md px-4 py-2 text-lg font-bold text-white transition-colors"
                >
                  {cta.label}
                </Link>
                {ctaNote && (
                  <span className="text-base font-bold max-lg:hidden">← {ctaNote}</span>
                )}
                {ctaNote && (
                  <div className="mt-2 lg:hidden">
                    <span
                      aria-hidden="true"
                      className="block text-center text-base font-bold leading-none"
                    >
                      ↑
                    </span>
                    <span className="text-base font-bold">{ctaNote}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="mt-5 text-2xl font-bold">
              or call{" "}
              <a href={phoneHref} className="whitespace-nowrap hover:underline">
                {phone}
              </a>
            </p>

            <p className="mt-4 flex items-center gap-2 font-semibold">
              <span
                aria-hidden
                className={`inline-block h-3.5 w-3.5 shrink-0 rounded-full ${
                  closed ? "bg-terra" : "bg-green-700"
                }`}
              />
              <span>
                {open === null
                  ? `Intake line ${hours.label}`
                  : closed
                    ? closedLabel
                    : `${openNowLabel} · Intake line ${hours.label}`}
              </span>
            </p>
          </div>

          <ul className="space-y-3 text-base md:pt-1">
            {facts.map((f) => (
              <li
                key={f}
                className="before:text-terra flex gap-2 before:font-bold before:content-['✓']"
              >
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          {crisisTitle && (
            <p className="text-ink text-center text-xl font-bold tracking-[0.06em] uppercase">
              {crisisTitle}
            </p>
          )}
          <div className="border-anchor/30 mt-3 border-t pt-3">
            <ul className="grid gap-4 sm:grid-cols-3">
              {crisisLines.map((c) => (
                <li key={c.label}>
                  <span className="text-terra block text-sm font-bold tracking-[0.05em] uppercase">
                    {c.label}
                  </span>
                  <a href={c.href} className="text-ink font-bold underline">
                    {c.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-anchor/30 mt-4 border-t" />
        </div>
      </div>
    </section>
  );
}
