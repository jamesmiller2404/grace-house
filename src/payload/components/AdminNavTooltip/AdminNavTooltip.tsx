"use client";

import { useEffect, useRef } from "react";

/**
 * AdminNavTooltip — hover-activated popup info boxes over admin sidebar nav
 * items and dashboard cards.
 *
 * Registered in payload.config.ts under `admin.components.afterNavLinks` and
 * `admin.components.afterDashboard`, so it renders on every admin page.
 *
 * It finds all <a> links pointing at /admin/collections/<slug> or
 * /admin/globals/<slug>, extracts the slug, and attaches a `data-tooltip`
 * attribute with a description of what that section does. Hovering the link
 * shows a beige/tan rounded tooltip box styled to match the admin panel mockup
 * (photoshop_assets/adminPanelMockup1.png).
 *
 * Tooltip text comes from a static map keyed by collection/global slug.
 * Entries without a description get a concise default written here.
 */

const TOOLTIP_TEXT: Record<string, string> = {
  // Collections
  users: "Manage site users and their access roles (admin / editor).",
  events:
    "Create and manage upcoming events — dates, locations, images, and contact info.",
  media: "Upload and manage images used on event pages.",
  "mission-page":
    "The Title and body text shown on the Mission page (/about/mission).",
  hero: "The front page hero: the main heading, the subline beneath it, and the background image.",
  intro:
    'The "What is Grace House" section on the home page: its heading, body text, link and colors.',
  stories:
    "The Lives Changed section: the people of Grace House — graduates, volunteers and staff — in their own words.",
  donate:
    "The Donate page (/support): the title and intro, the PayPal and Venmo cards, the 501(c)(3) note and the content sections (generic headings and paragraphs).",
  "custom-pages":
    'Spare pages you can use for anything. Tick "Show in header menu", name the page and add heading/paragraph/photo blocks — the page goes live at /pages/<page-name>.',
  "get-help-now":
    'The "Get Help Now" strip on the front page and /get-help page: the heading, phone number and office hours, quick facts, 24/7 crisis resources, and the assessment call-to-action toggle.',
  faq: "Create and manage frequently asked questions and answers shown on the site.",
  "feeding-the-streets":
    "The Title and heading/paragraph/photo blocks shown on the Feeding the Streets page (/feeding-the-streets).",
  // Globals
  "home-layout":
    'Choose which sections appear on the home page and in what order. Drag a section to reorder it, or open its "..." menu and use Move Up / Move Down. Untick "Show on home page" to hide a section without removing it.',
  "contact-info":
    "The site's phone numbers, email addresses and physical addresses. Add as many as needed — give each one a label so it's clear what it's for. Reorder rows by dragging, or with the '...' menu's Move Up / Move Down.",
  footer:
    "The phone number, email address and street address shown in the footer's 'Get Help' column. Pick each one from the entries registered in the Contact Info panel, or choose 'Other (enter manually)' for a one-off.",
};

/**
 * Extract the collection or global slug from an admin URL like
 * /admin/collections/events or /admin/globals/contact-info.
 */
function slugFromHref(href: string): string | null {
  const match = href.match(/\/admin\/(collections|globals)\/([^/?#]+)/);
  return match ? match[2] : null;
}

const css = `
/* Tooltip box — matches the PNG mockup style: beige/tan rounded card with
   dark text and a soft drop shadow. */
.gh-admin-tooltip {
  position: absolute;
  z-index: 2147483647;
  background: #f0e6d2;
  color: #1a1a1a;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.4;
  max-width: 220px;
  word-wrap: break-word;
  white-space: normal;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, transform 0.15s ease;
  transform: translateY(4px);
  border: 1px solid #d4c7a8;
}
.gh-admin-tooltip.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
`;

function AdminNavTooltip() {
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tooltip = document.createElement("div");
    tooltip.className = "gh-admin-tooltip";
    tooltipRef.current = tooltip;
    document.body.appendChild(tooltip);

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    function attachTooltips() {
      const links = document.querySelectorAll<HTMLAnchorElement>(
        'a[href*="/admin/collections/"], a[href*="/admin/globals/"]',
      );
      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;
        const slug = slugFromHref(href);
        if (!slug) return;
        const tooltipText = TOOLTIP_TEXT[slug];
        if (!tooltipText) return;

        if (link.dataset.tooltipAttached === "true") return;
        link.dataset.tooltipAttached = "true";
        link.dataset.tooltip = tooltipText;

        const onEnter = () => {
          const rect = link.getBoundingClientRect();
          tooltip.textContent = tooltipText;
          tooltip.style.top = `${rect.bottom + window.scrollY + 8}px`;
          tooltip.style.left = `${rect.left + window.scrollX}px`;
          tooltip.classList.add("visible");
        };
        const onLeave = () => {
          tooltip.classList.remove("visible");
        };

        link.addEventListener("mouseenter", onEnter);
        link.addEventListener("mouseleave", onLeave);
      });
    }

    const timer = setTimeout(attachTooltips, 300);

    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      setTimeout(attachTooltips, 100);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      tooltip.remove();
      style.remove();
    };
  }, []);

  return null;
}

export default AdminNavTooltip;
