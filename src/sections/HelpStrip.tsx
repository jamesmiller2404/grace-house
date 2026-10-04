"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type HelpStripProps = {
  heading: string;
  openBody: string;
  closedBody: string;
  phone: string;
  phoneHref: string;
  cta: { label: string; href: string };
  ctaNote?: string;
  hours: { label: string; days: number[]; open: number; close: number; timeZone: string };
  openNowLabel: string;
  closedLabel: string;
  facts: string[];
  crisisTitle?: string;
  crisisLines: { label: string; text: string; href: string }[];
};

const DAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

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
  // null until mounted, so server and client markup match
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => setOpen(isOfficeOpen(hours)), [hours]);
  const closed = open === false;

  return (
    <section aria-labelledby="help-title" className="border-b-4 border-gold bg-sand text-ink">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-8 md:grid-cols-[3fr_2fr] md:gap-12">
          <div>
            <h2 id="help-title" className="font-heading text-3xl font-bold text-ink md:text-4xl">
              {heading}
            </h2>
            <p className="mt-2 text-lg">{closed ? closedBody : openBody}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href={cta.href}
                className="rounded-md bg-terra px-8 py-4 text-2xl font-bold text-white transition-colors hover:bg-anchor"
              >
                {cta.label}
              </Link>
              {ctaNote && <span className="text-lg font-bold">← {ctaNote}</span>}
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
                className="flex gap-2 before:font-bold before:text-terra before:content-['✓']"
              >
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-anchor/30 pt-4">
          {crisisTitle && (
            <p className="text-sm font-bold tracking-[0.06em] text-ink">{crisisTitle}</p>
          )}
          <ul className="mt-3 grid gap-4 sm:grid-cols-3">
            {crisisLines.map((c) => (
              <li key={c.label}>
                <span className="block text-sm font-bold uppercase tracking-[0.05em] text-terra">
                  {c.label}
                </span>
                <a href={c.href} className="font-bold text-ink underline">
                  {c.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}