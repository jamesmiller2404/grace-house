"use client";

import { useEffect } from "react";

/**
 * Adds accessible information buttons beside Payload collection/global links.
 * Hovering a link still shows its explainer on desktop; the separate info
 * button opens it on touchscreens without hijacking collection navigation.
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

function slugFromHref(href: string): string | null {
  const match = href.match(/\\/admin\\/(collections|globals)\\/([^/?#]+)/);
  return match ? match[2] : null;
}

const css = `
.gh-admin-tooltip {
  position: fixed;
  z-index: 2147483647;
  background: #f0e6d2;
  color: #1a1a1a;
  border: 1px solid #d4c7a8;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  padding: 9px 11px;
  font-size: 12px;
  line-height: 1.45;
  width: max-content;
  max-width: min(260px, calc(100vw - 24px));
  white-space: normal;
  overflow-wrap: break-word;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s ease;
}
.gh-admin-tooltip.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.gh-admin-tooltip-trigger-parent {
  position: relative !important;
}
.gh-admin-tooltip-button {
  align-items: center;
  appearance: none;
  background: var(--theme-elevation-100, #333);
  border: 1px solid var(--theme-elevation-400, #666);
  border-radius: 50%;
  color: var(--theme-elevation-800, #eee);
  cursor: pointer;
  display: inline-flex;
  height: 25px;
  justify-content: center;
  padding: 0;
  position: absolute;
  right: 7px;
  top: 50%;
  transform: translateY(-50%);
  width: 25px;
  z-index: 5;
}
.gh-admin-tooltip-button:hover,
.gh-admin-tooltip-button:focus-visible,
.gh-admin-tooltip-button[aria-expanded="true"] {
  background: var(--theme-elevation-300, #555);
  border-color: var(--theme-elevation-600, #888);
  color: var(--theme-elevation-1000, #fff);
}
.gh-admin-tooltip-button:focus-visible {
  outline: 2px solid var(--theme-success-500, #5b9);
  outline-offset: 2px;
}
.gh-admin-tooltip-button svg {
  display: block;
  height: 15px;
  width: 15px;
  pointer-events: none;
}
`;

function AdminNavTooltip() {
  useEffect(() => {
    const tooltip = document.createElement("div");
    tooltip.className = "gh-admin-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.id = "gh-admin-section-tooltip";
    document.body.appendChild(tooltip);

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    let activeButton: HTMLButtonElement | null = null;

    function positionTooltip(anchor: HTMLElement) {
      const rect = anchor.getBoundingClientRect();
      const margin = 12;
      const tooltipWidth = Math.min(260, window.innerWidth - margin * 2);
      const left = Math.max(
        margin,
        Math.min(rect.left, window.innerWidth - tooltipWidth - margin),
      );
      tooltip.style.left = `${left}px`;
      tooltip.style.maxWidth = `${tooltipWidth}px`;

      // Measure after setting the horizontal position and content.
      const height = tooltip.getBoundingClientRect().height;
      const below = rect.bottom + 8;
      const top =
        below + height <= window.innerHeight - margin
          ? below
          : Math.max(margin, rect.top - height - 8);
      tooltip.style.top = `${top}px`;
    }

    function closeTooltip() {
      tooltip.classList.remove("visible");
      if (activeButton) {
        activeButton.setAttribute("aria-expanded", "false");
        activeButton = null;
      }
    }

    function showTooltip(text: string, anchor: HTMLElement) {
      tooltip.textContent = text;
      tooltip.classList.add("visible");
      positionTooltip(anchor);
    }

    function attachTooltips() {
      const links = document.querySelectorAll<HTMLAnchorElement>(
        'a[href*="/admin/collections/"], a[href*="/admin/globals/"]',
      );

      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        const slug = slugFromHref(href);
        const tooltipText = slug ? TOOLTIP_TEXT[slug] : undefined;
        if (!tooltipText || link.dataset.tooltipAttached === "true") return;

        link.dataset.tooltipAttached = "true";
        link.dataset.tooltip = tooltipText;

        const parent = link.parentElement;
        if (!parent) return;
        parent.classList.add("gh-admin-tooltip-trigger-parent");

        const button = document.createElement("button");
        button.type = "button";
        button.className = "gh-admin-tooltip-button";
        button.setAttribute("aria-label", `About ${link.textContent?.trim() || slug}`);
        button.setAttribute("aria-describedby", tooltip.id);
        button.setAttribute("aria-expanded", "false");
        button.title = "Show section information";
        button.innerHTML = `
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="7.25" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 9v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
            <circle cx="10" cy="6.4" r="1" fill="currentColor"/>
          </svg>
        `;

        button.addEventListener("click", (event) => {
          // This is a sibling of the link, but stop propagation so card/row
          // handlers cannot interpret the information tap as navigation.
          event.preventDefault();
          event.stopPropagation();

          if (activeButton === button && tooltip.classList.contains("visible")) {
            closeTooltip();
            return;
          }

          closeTooltip();
          activeButton = button;
          button.setAttribute("aria-expanded", "true");
          showTooltip(tooltipText, button);
        });

        // Insert beside the link, not inside it: navigation and explanation
        // remain two separate, independently accessible actions.
        parent.appendChild(button);

        link.addEventListener("mouseenter", () => {
          if (activeButton) return;
          showTooltip(tooltipText, link);
        });
        link.addEventListener("mouseleave", () => {
          if (!activeButton) closeTooltip();
        });
      });
    }

    function onDocumentClick(event: MouseEvent) {
      if (
        activeButton &&
        event.target instanceof Node &&
        !activeButton.contains(event.target)
      ) {
        closeTooltip();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeTooltip();
    }

    function onViewportChange() {
      if (activeButton && tooltip.classList.contains("visible")) {
        positionTooltip(activeButton);
      }
    }

    attachTooltips();
    const observer = new MutationObserver(attachTooltips);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
      tooltip.remove();
      style.remove();
      document
        .querySelectorAll(".gh-admin-tooltip-button")
        .forEach((button) => button.remove());
      document
        .querySelectorAll(".gh-admin-tooltip-trigger-parent")
        .forEach((parent) =>
          parent.classList.remove("gh-admin-tooltip-trigger-parent"),
        );
    };
  }, []);

  return null;
}

export default AdminNavTooltip;
