"use client";

import React from "react";

/**
 * Persistent "View Live Site" shortcut inside the admin sidebar navigation
 * so editors can check their changes on the public site from any screen.
 */
function ViewLiveSiteNavLink() {
  return (
    <a
      className="gh-nav-live-site"
      href="/"
      rel="noopener noreferrer"
      target="_blank"
      title="Open the public Grace House website in a new tab"
    >
      <svg
        aria-hidden="true"
        fill="none"
        height="16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        viewBox="0 0 24 24"
        width="16"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" x2="21" y1="14" y2="3" />
      </svg>
      <span>View Live Site</span>
    </a>
  );
}

export default ViewLiveSiteNavLink;
