import type { CollectionSlug, Payload } from "payload";
import Link from "next/link";
import React from "react";

import type { User } from "../../../payload-types";
import AddImagesQuickAction from "./AddImagesQuickAction";
import DashboardCardEnhancer from "./DashboardCardEnhancer";

type DashboardBannerProps = {
  payload?: Payload;
  user?: User | null;
};

const COUNTED_COLLECTIONS: CollectionSlug[] = [
  "events",
  "stories",
  "media",
  "media-tags",
  "faq",
  "custom-pages",
  "users",
];

function getFirstName(user?: User | null): string {
  const raw = user?.name?.trim();
  if (!raw) return "";
  return raw.split(/\s+/)[0] || "";
}

/**
 * Welcoming dashboard hero rendered at the top of /admin (via
 * `admin.components.beforeDashboard` in payload.config.ts).
 *
 * Shows a personalized greeting, a one-click "View Live Site" link,
 * at-a-glance live counts, and quick-action shortcuts for common editing
 * tasks. Also passes the live counts to DashboardCardEnhancer so the
 * collection cards below display icons, subtitles, and item counts.
 */
async function DashboardWelcomeBanner({ payload, user }: DashboardBannerProps) {
  const counts: Record<string, number> = {};

  if (payload) {
    const results = await Promise.allSettled(
      COUNTED_COLLECTIONS.map(async (collection) => {
        const { totalDocs } = await payload.count({ collection });
        return [collection, totalDocs] as const;
      }),
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        const [slug, total] = result.value;
        counts[slug] = total;
      }
    }
  }

  const firstName = getFirstName(user);
  const greeting = firstName ? `Welcome back, ${firstName}` : "Welcome back";

  const stats = [
    {
      label: "Events",
      value: counts.events,
      href: "/admin/collections/events",
    },
    {
      label: "Lives Changed",
      value: counts.stories,
      href: "/admin/collections/stories",
    },
    {
      label: "Media Library",
      value: counts.media,
      href: "/admin/collections/media",
    },
    {
      label: "Common Questions",
      value: counts.faq,
      href: "/admin/collections/faq",
    },
  ];

  const quickActions = [
    {
      label: "New Event",
      href: "/admin/collections/events/create",
      hasPlus: true,
    },
    {
      label: "New Story",
      href: "/admin/collections/stories/create",
      hasPlus: true,
    },
    {
      label: "Home Layout",
      href: "/admin/globals/home-layout",
      hasPlus: false,
    },
  ];

  return (
    <section
      aria-label="Dashboard overview"
      className="gh-welcome-banner"
    >
      <div className="gh-welcome-banner__top">
        <div className="gh-welcome-banner__identity">
          <div className="gh-welcome-banner__emblem" aria-hidden="true">
            <img src="/images/crown.png" alt="" />
          </div>
          <div className="gh-welcome-banner__copy">
            <p className="gh-welcome-banner__eyebrow">Grace House Content Studio</p>
            <h1 className="gh-welcome-banner__title">{greeting}</h1>
            <p className="gh-welcome-banner__subtitle">
              Manage home page sections, upcoming events, stories, and media from one place.
            </p>
          </div>
        </div>

        <a
          className="gh-welcome-banner__site-link"
          href="/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>View Live Site</span>
          <svg
            aria-hidden="true"
            fill="none"
            height="15"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="15"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" x2="21" y1="14" y2="3" />
          </svg>
        </a>
      </div>

      <div className="gh-welcome-banner__stats">
        {stats.map((stat) => (
          <Link
            className="gh-welcome-stat"
            href={stat.href}
            key={stat.href}
          >
            <span className="gh-welcome-stat__value">
              {typeof stat.value === "number" ? stat.value : "—"}
            </span>
            <span className="gh-welcome-stat__label">{stat.label}</span>
          </Link>
        ))}
      </div>

      <div className="gh-welcome-banner__actions">
        <span className="gh-welcome-banner__actions-label">Quick actions</span>
        <div className="gh-welcome-banner__actions-list">
          {quickActions.map((action) => (
            <Link
              className="gh-quick-action"
              href={action.href}
              key={action.href}
            >
              {action.hasPlus ? (
                <span aria-hidden="true" className="gh-quick-action__plus">
                  +
                </span>
              ) : null}
              <span>{action.label}</span>
            </Link>
          ))}
          <AddImagesQuickAction />
        </div>
      </div>

      <DashboardCardEnhancer counts={counts} />
    </section>
  );
}

export default DashboardWelcomeBanner;
