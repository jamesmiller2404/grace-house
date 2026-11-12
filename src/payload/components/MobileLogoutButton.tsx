"use client";

import { Link, LogOutIcon, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

/**
 * Explicit sign-out link inside the admin navigation drawer on mobile.
 * The desktop sidebar already has its own labeled Logout control.
 */
function MobileLogoutButton() {
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
        .gh-mobile-logout {
          align-items: center;
          border-top: 1px solid var(--theme-elevation-200);
          color: var(--theme-elevation-800);
          display: none;
          font-size: 0.9rem;
          font-weight: 600;
          gap: 0.65rem;
          margin: 0.75rem;
          min-height: 44px;
          padding: 0.65rem 0.75rem;
          text-decoration: none;
        }

        .gh-mobile-logout:hover {
          background: var(--theme-elevation-100);
          color: var(--theme-elevation-1000);
        }

        .gh-mobile-logout:focus-visible {
          outline: 2px solid var(--theme-success-500);
          outline-offset: 2px;
        }

        .gh-mobile-logout svg {
          flex: 0 0 auto;
          height: 17px;
          width: 17px;
        }

        @media (max-width: 767px) {
          .gh-mobile-logout {
            display: flex;
          }
        }
      `}</style>
      <Link
        aria-label="Log out"
        className="gh-mobile-logout"
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

export default MobileLogoutButton;
