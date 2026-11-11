"use client";

import { Link, LogOutIcon, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import React from "react";

/**
 * Logout button in the bottom-left of the admin sidebar. Replaces Payload's
 * icon-only logout link (admin.components.logout.Button in payload.config.ts)
 * with the SAME arrow-in-bracket icon plus a visible "Logout" label, so its
 * purpose is obvious at a glance.
 *
 * Everything else is unchanged from Payload's default Logout element: the
 * same logout route (admin.routes.logout) rendered through Payload's Link
 * with prefetch disabled, the `nav__log-out` class (so the hover nudge on the
 * icon still animates), and the focus-visible outline from the nav's
 * stylesheet. Colors come from Payload's --theme-* variables, so the label
 * follows the admin theme, same as AccountAvatar.tsx.
 */

const css = `
.gh-logout-button {
  align-items: center;
  display: flex;
  gap: 8px;
}

/* The visible "Logout" text next to the icon. */
.gh-logout-button__label {
  color: var(--theme-elevation-800);
  font: inherit;
  font-weight: 500;
}
`;

function LogoutButton() {
  const {
    config: {
      admin: {
        routes: { logout: logoutRoute },
      },
      routes: { admin: adminRoute },
    },
  } = useConfig();

  return (
    <Link
      aria-label="Log out"
      className="nav__log-out gh-logout-button"
      href={formatAdminURL({ adminRoute, path: logoutRoute })}
      prefetch={false}
      title="Log out"
    >
      <style>{css}</style>
      <LogOutIcon />
      <span className="gh-logout-button__label">Logout</span>
    </Link>
  );
}

export default LogoutButton;