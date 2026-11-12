"use client";

import { Link, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

/**
 * A clearly labeled route back to the Payload dashboard, shown above the
 * collection/global links in the admin sidebar.
 */
function DashboardLink() {
  const {
    config: {
      admin: {
        routes: { admin: adminRoute },
      },
    },
  } = useConfig();

  return (
    <>
      <style>{`
        .gh-dashboard-link {
          align-items: center;
          border: 1px solid var(--theme-elevation-300);
          border-radius: 4px;
          color: var(--theme-elevation-900);
          display: flex;
          font-size: 0.9rem;
          font-weight: 600;
          gap: 0.65rem;
          margin: 0.75rem 0.75rem 1rem;
          min-height: 42px;
          padding: 0.6rem 0.85rem;
          text-decoration: none;
          transition: background-color 120ms ease, border-color 120ms ease;
        }

        .gh-dashboard-link:hover {
          background: var(--theme-elevation-100);
          border-color: var(--theme-elevation-500);
          color: var(--theme-elevation-1000);
        }

        .gh-dashboard-link:focus-visible {
          outline: 2px solid var(--theme-success-500);
          outline-offset: 2px;
        }

        .gh-dashboard-link svg {
          flex: 0 0 auto;
          height: 17px;
          width: 17px;
        }
      `}</style>
      <Link
        aria-label="Return to Dashboard"
        className="gh-dashboard-link"
        href={formatAdminURL({ adminRoute, path: "" })}
        prefetch={false}
        title="Return to Dashboard"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.5 4.5 7 10l5.5 5.5" />
          <path d="M7.5 10H17" />
        </svg>
        <span>Dashboard</span>
      </Link>
    </>
  );
}

export default DashboardLink;
