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
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="help-title" className="font-heading text-2xl text-anchor">
              {heading}
            </h2>
            <p>{closed ? closedBody : openBody}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href={phoneHref} className="whitespace-nowrap text-2xl font-semibold text-anchor">
              {phone}
            </a>
            <Link href={cta.href} className="rounded-md bg-terra px-5 py-3 font-semibold text-white">
              {cta.label}
            </Link>
          </div>
        </div>

        <div className="mt-4 border-t border-anchor/20 pt-4 text-base">
          <p className="font-semibold text-anchor">
            {open === null
              ? `Intake line ${hours.label}`
              : closed
                ? closedLabel
                : `${openNowLabel} · Intake line ${hours.label}`}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
            {facts.map((f) => (
              <li
                key={f}
                className="before:mr-1 before:font-bold before:text-terra before:content-['✓']"
              >
                {f}
              </li>
            ))}
          </ul>
          {crisisTitle && (
            <p className="mt-4 text-xs font-semibold tracking-[0.12em] text-anchor">{crisisTitle}</p>
          )}
          <ul className="mt-2 grid gap-3 sm:grid-cols-3">
            {crisisLines.map((c) => (
              <li key={c.label}>
                <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-terra">
                  {c.label}
                </span>
                <a href={c.href} className="font-semibold text-anchor underline">
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