"use client";

import { Link, LogOutIcon, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

/**
 * Dashboard-level sign-out action. This is separate from the sidebar control
 * so users can find Logout without opening the navigation.
 */
function DashboardLogoutButton() {
  const {
    config: {
      admin: {
        routes: { logout: logoutRoute },
      },
      routes: { admin: adminRoute },
    },
  } = useConfig();

  return (
    <>
      <style>{`
        .gh-dashboard-logout {
          align-items: center;
          background: var(--theme-elevation-100);
          border: 1px solid var(--theme-elevation-300);
          border-radius: 5px;
          color: var(--theme-elevation-900);
          display: inline-flex;
          font-size: 0.9rem;
          font-weight: 600;
          gap: 0.55rem;
          margin: 1.25rem 0;
          min-height: 42px;
          padding: 0.6rem 0.9rem;
          text-decoration: none;
          transition: background-color 120ms ease, border-color 120ms ease;
        }

        .gh-dashboard-logout:hover {
          background: var(--theme-elevation-200);
          border-color: var(--theme-elevation-500);
          color: var(--theme-elevation-1000);
        }

        .gh-dashboard-logout:focus-visible {
          outline: 2px solid var(--theme-success-500);
          outline-offset: 2px;
        }

        .gh-dashboard-logout svg {
          height: 17px;
          width: 17px;
        }
      `}</style>
      <Link
        aria-label="Log out"
        className="gh-dashboard-logout"
        href={formatAdminURL({ adminRoute, path: logoutRoute })}
        prefetch={false}
        title="Log out"
      >
        <LogOutIcon />
        <span>Logout</span>
      </Link>
    </>
  );
}

export default DashboardLogoutButton;
