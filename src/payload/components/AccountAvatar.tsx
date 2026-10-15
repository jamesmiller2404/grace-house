"use client";

import { useAuth, useConfig } from "@payloadcms/ui";
import { usePathname } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import React from "react";

import type { User } from "../../../payload-types";

/**
 * Custom avatar for the account icon in the upper-right corner of the admin
 * panel (the icon that links to /admin/account). Replaces Payload's default
 * person icon with the same icon plus, stacked beneath it:
 *
 *   - the logged-in user's name (falls back to their email)
 *   - the user's access level (the Users `role` select: admin / editor)
 *
 * Registered in payload.config.ts through `admin.avatar.Component`, so
 * Payload renders this instead of its built-in Account graphic. Colors come
 * from Payload's `--theme-*` variables, so it follows the Light / Dark / Auto
 * theme selector (the variables are repainted in
 * src/app/(payload)/custom.css).
 *
 * The person icon below is Payload's own `DefaultAccountIcon` markup
 * (node_modules/@payloadcms/ui/dist/graphics/Account/Default/index.js) kept
 * as-is, including its `graphic-account` class names, so its colors keep
 * coming from Payload's stylesheet and its "active" state when the user is
 * already on the account page still works.
 */

const css = `
.gh-account-avatar {
  align-items: center;
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  padding: calc(var(--base, 16px) * 0.25) 0;
  text-align: center;
}

/* The user's name, directly under the icon. */
.gh-account-avatar__name {
  color: var(--theme-elevation-1000);
  font-size: 11px;
  font-weight: 600;
  margin-top: 1px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* The user's access level (role), under the name. */
.gh-account-avatar__role {
  color: var(--theme-elevation-500);
  font-size: 10px;
}

/* Keep the mobile header uncluttered: icon only on small screens. */
@media (max-width: 767px) {
  .gh-account-avatar__name,
  .gh-account-avatar__role {
    display: none;
  }
}
`;

function AccountAvatar() {
  const { user } = useAuth<User>();
  const {
    config: {
      admin: {
        routes: { account: accountRoute },
      },
      routes: { admin: adminRoute },
    },
  } = useConfig();
  const pathname = usePathname();
  const isOnAccountPage =
    pathname === formatAdminURL({ adminRoute, path: accountRoute });

  const name = user?.name || user?.email || "";
  const role = user?.role || "";

  return (
    <div className="gh-account-avatar">
      <style>{css}</style>
      <svg
        className={[
          "graphic-account",
          isOnAccountPage && "graphic-account--active",
        ]
          .filter(Boolean)
          .join(" ")}
        height="25"
        viewBox="0 0 25 25"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle className="graphic-account__bg" cx="12.5" cy="12.5" r="11.5" />
        <circle className="graphic-account__head" cx="12.5" cy="10.73" r="3.98" />
        <path
          className="graphic-account__body"
          d="M12.5,24a11.44,11.44,0,0,0,7.66-2.94c-.5-2.71-3.73-4.8-7.66-4.8s-7.16,2.09-7.66,4.8A11.44,11.44,0,0,0,12.5,24Z"
        />
      </svg>
      {name ? <span className="gh-account-avatar__name">{name}</span> : null}
      {role ? <span className="gh-account-avatar__role">{role}</span> : null}
    </div>
  );
}

export default AccountAvatar;
