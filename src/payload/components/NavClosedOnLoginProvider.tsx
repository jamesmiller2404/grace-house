"use client";

import { useAuth, useNav, usePreferences } from "@payloadcms/ui";
import { PREFERENCE_KEYS } from "payload/shared";
import React, { useEffect, useRef } from "react";

const SESSION_KEY = "gh_nav_session_started";

/**
 * Ensures the left navigation sidebar starts closed when a user logs in or
 * begins a new browser session, while allowing them to toggle it freely
 * afterward.
 */
export default function NavClosedOnLoginProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { setNavOpen } = useNav();
  const { setPreference } = usePreferences();
  const prevUserIdRef = useRef<string | number | null>(user?.id ?? null);

  useEffect(() => {
    const currentUserId = user?.id ?? null;
    const prevUserId = prevUserIdRef.current;
    prevUserIdRef.current = currentUserId;

    if (!currentUserId) {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        // Ignore storage errors in restricted environments.
      }
      return;
    }

    let isNewSession = false;
    try {
      isNewSession = !sessionStorage.getItem(SESSION_KEY);
      if (isNewSession) {
        sessionStorage.setItem(SESSION_KEY, "1");
      }
    } catch {
      isNewSession = prevUserId === null;
    }

    if (prevUserId === null || isNewSession) {
      setNavOpen(false);
      void setPreference(PREFERENCE_KEYS.NAV, { open: false });
    }
  }, [user?.id, setNavOpen, setPreference]);

  return <>{children}</>;
}
