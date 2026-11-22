"use client";

import { useEffect } from "react";

type CardMeta = {
  subtitle: string;
  unit?: [string, string];
  iconSvg: string;
};

const CARD_META: Record<string, CardMeta> = {
  // Home Page
  hero: {
    subtitle: "Front page headline, subline, and hero background image.",
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 15l5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>',
  },
  intro: {
    subtitle: 'Home page "What is Grace House" welcome section and styling.',
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M9.5 20v-6h5v6"/></svg>',
  },
  "get-help-now": {
    subtitle: "Help strip phone, office hours, quick facts, and 24/7 resources.",
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  },
  "home-layout": {
    subtitle: "Reorder or toggle which sections appear on the home page.",
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="6" rx="1.5"/><rect x="3" y="12" width="8" height="9" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/></svg>',
  },

  // Community & Content
  events: {
    subtitle: "Upcoming community events, dates, locations, and photos.",
    unit: ["event", "events"],
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  },
  stories: {
    subtitle: "Stories from graduates, volunteers, and staff in their own words.",
    unit: ["story", "stories"],
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  },
  faq: {
    subtitle: "Frequently asked questions and answers shown on the site.",
    unit: ["question", "questions"],
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  },
  "feeding-the-streets": {
    subtitle: "Content blocks and photos for the Feeding the Streets page.",
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  },
  media: {
    subtitle: "Upload, tag, and manage photos used across the website.",
    unit: ["image", "images"],
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  },
  "media-tags": {
    subtitle: "Reusable tags to organize and filter the Media Library.",
    unit: ["tag", "tags"],
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  },

  // Site Pages
  "mission-page": {
    subtitle: "Title and story shown on the Mission page (/about/mission).",
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  },
  donate: {
    subtitle: "Support page intro, PayPal & Venmo cards, and sections.",
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  },
  board: {
    subtitle: "Board of Directors page intro and member profiles.",
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  },
  "custom-pages": {
    subtitle: "Extra pages with heading, paragraph, and photo blocks.",
    unit: ["page", "pages"],
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  },

  // Site Settings & Access
  users: {
    subtitle: "Manage admin and editor accounts and access roles.",
    unit: ["user", "users"],
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  },
  "contact-info": {
    subtitle: "Central directory of phone numbers, emails, and addresses.",
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  },
  footer: {
    subtitle: "Phone, email, and address shown in the site footer.",
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="15" x2="21" y2="15"/></svg>',
  },
};

function slugFromHref(href: string): string | null {
  const match = href.match(/\/admin\/(collections|globals)\/([^/?#]+)/);
  return match ? match[2] : null;
}

type Props = {
  counts: Record<string, number>;
};

/**
 * Enhances Payload's native dashboard cards with a warm icon badge, a concise
 * inline description, and a live item-count pill for multi-item collections.
 */
function DashboardCardEnhancer({ counts }: Props) {
  useEffect(() => {
    function enhanceCards() {
      const cards = document.querySelectorAll<HTMLElement>(".dashboard .card");

      cards.forEach((card) => {
        if (card.dataset.ghEnhanced === "true") return;

        const primaryLink = card.querySelector<HTMLAnchorElement>(
          'a[href*="/admin/collections/"]:not([href*="/create"]), a[href*="/admin/globals/"]:not([href*="/create"])',
        );
        const href = primaryLink?.getAttribute("href");
        if (!href) return;

        const slug = slugFromHref(href);
        const meta = slug ? CARD_META[slug] : undefined;
        if (!slug || !meta) return;

        card.dataset.ghEnhanced = "true";
        card.classList.add("gh-card-enhanced");

        // Top row: icon badge + optional live count pill
        const topRow = document.createElement("div");
        topRow.className = "gh-card-enhanced__top";

        const iconWrap = document.createElement("span");
        iconWrap.className = "gh-card-enhanced__icon";
        iconWrap.setAttribute("aria-hidden", "true");
        iconWrap.innerHTML = meta.iconSvg;
        topRow.appendChild(iconWrap);

        const count = counts[slug];
        if (typeof count === "number" && meta.unit) {
          const badge = document.createElement("span");
          badge.className = "gh-card-enhanced__badge";
          badge.textContent = `${count} ${count === 1 ? meta.unit[0] : meta.unit[1]}`;
          topRow.appendChild(badge);
        } else {
          const arrow = document.createElement("span");
          arrow.className = "gh-card-enhanced__arrow";
          arrow.setAttribute("aria-hidden", "true");
          arrow.textContent = "→";
          topRow.appendChild(arrow);
        }

        const subtitle = document.createElement("p");
        subtitle.className = "gh-card-enhanced__subtitle";
        subtitle.textContent = meta.subtitle;

        card.prepend(topRow);
        card.appendChild(subtitle);
      });
    }

    enhanceCards();
    const observer = new MutationObserver(enhanceCards);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document
        .querySelectorAll<HTMLElement>(".dashboard .card[data-gh-enhanced='true']")
        .forEach((card) => {
          card.classList.remove("gh-card-enhanced");
          delete card.dataset.ghEnhanced;
          card.querySelector(".gh-card-enhanced__top")?.remove();
          card.querySelector(".gh-card-enhanced__subtitle")?.remove();
        });
    };
  }, [counts]);

  return null;
}

export default DashboardCardEnhancer;
