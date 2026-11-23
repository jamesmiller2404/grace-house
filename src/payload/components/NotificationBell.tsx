"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useConfig } from "@payloadcms/ui";

type NotificationItem = {
  id: string | number;
  title: string;
  message: string;
  category: string;
  severity: string;
  actionUrl: string;
  actorName: string | null;
  createdAt: string;
  isRead: boolean;
};

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function severityColor(severity: string): string {
  switch (severity) {
    case "success":
      return "var(--gh-success, #5fa883)";
    case "warning":
      return "var(--gh-warning, #e3a857)";
    case "error":
      return "var(--gh-danger, #c45645)";
    default:
      return "var(--gh-accent, #c9a45c)";
  }
}

export default function NotificationBell() {
  const { user } = useAuth();
  const { config } = useConfig();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const apiRoot = config.routes.api.replace(/\/$/, "");

  const loadFeed = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`${apiRoot}/admin-notifications/feed`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) return;
      const data = (await response.json()) as {
        items?: NotificationItem[];
        unreadCount?: number;
      };
      setItems(Array.isArray(data.items) ? data.items : []);
      setUnreadCount(typeof data.unreadCount === "number" ? data.unreadCount : 0);
    } catch {
      // Non-blocking background poll.
    }
  }, [apiRoot, user]);

  useEffect(() => {
    if (!user) return;
    const initialTimer = window.setTimeout(() => {
      void loadFeed();
    }, 0);
    const interval = window.setInterval(() => {
      void loadFeed();
    }, 30000);

    const onFocus = () => void loadFeed();
    const onCustomRefresh = () => void loadFeed();
    window.addEventListener("focus", onFocus);
    window.addEventListener("gh:notifications-updated", onCustomRefresh);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("gh:notifications-updated", onCustomRefresh);
    };
  }, [user, loadFeed]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!user) return null;

  const markAsRead = async (itemId: string | number) => {
    setItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(itemId) ? { ...item, isRead: true } : item,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    await fetch(`${apiRoot}/admin-notifications/${encodeURIComponent(String(itemId))}/read`, {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    }).catch(() => undefined);
  };

  const markAllRead = async () => {
    setLoading(true);
    try {
      await fetch(`${apiRoot}/admin-notifications/read-all`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      await markAsRead(item.id);
    }
    setOpen(false);
    if (item.actionUrl) {
      router.push(item.actionUrl);
    }
  };

  const visibleItems =
    filter === "unread" ? items.filter((item) => !item.isRead) : items;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
    >
      <button
        type="button"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={open}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) void loadFeed();
        }}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          border: "1px solid var(--gh-border-subtle, #312a3d)",
          background: open
            ? "var(--gh-aubergine, #32243f)"
            : "var(--gh-surface-card, #1d1825)",
          color: "var(--theme-elevation-900, #f5f1ea)",
          cursor: "pointer",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              minWidth: "18px",
              height: "18px",
              padding: "0 5px",
              borderRadius: "999px",
              background: "var(--gh-accent, #c9a45c)",
              color: "var(--gh-accent-ink, #141118)",
              fontSize: "11px",
              fontWeight: 800,
              lineHeight: "18px",
              textAlign: "center",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Admin notifications"
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            zIndex: 9999,
            width: "min(380px, 90vw)",
            borderRadius: "12px",
            border: "1px solid var(--gh-border-strong, #4a405c)",
            background: "var(--gh-surface-card, #1d1825)",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.55)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              padding: "12px 14px",
              borderBottom: "1px solid var(--gh-border-subtle, #312a3d)",
            }}
          >
            <strong style={{ fontSize: "0.95rem", color: "var(--theme-elevation-1000)" }}>
              Notifications
            </strong>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setFilter((prev) => (prev === "all" ? "unread" : "all"))}
                style={{
                  padding: "3px 8px",
                  borderRadius: "6px",
                  border: "1px solid var(--gh-border-subtle, #312a3d)",
                  background: "transparent",
                  color: "var(--theme-elevation-800)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                {filter === "all" ? "Unread only" : "Show all"}
              </button>
              {unreadCount > 0 && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void markAllRead()}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    border: "1px solid var(--gh-accent-border, rgba(201, 164, 92, 0.45))",
                    background: "var(--gh-accent-soft, rgba(201, 164, 92, 0.14))",
                    color: "var(--gh-accent, #c9a45c)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div style={{ maxHeight: "380px", overflowY: "auto" }}>
            {visibleItems.length === 0 ? (
              <p
                style={{
                  margin: 0,
                  padding: "24px 16px",
                  textAlign: "center",
                  fontSize: "0.85rem",
                  color: "var(--theme-elevation-500)",
                }}
              >
                {filter === "unread" ? "No unread notifications." : "No notifications yet."}
              </p>
            ) : (
              visibleItems.map((item) => (
                <button
                  key={String(item.id)}
                  type="button"
                  onClick={() => void handleItemClick(item)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 14px",
                    border: "none",
                    borderBottom: "1px solid var(--gh-border-subtle, #312a3d)",
                    background: item.isRead
                      ? "transparent"
                      : "rgba(201, 164, 92, 0.08)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.85rem",
                        fontWeight: item.isRead ? 600 : 700,
                        color: "var(--theme-elevation-1000)",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: severityColor(item.severity),
                          flexShrink: 0,
                        }}
                      />
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--theme-elevation-500)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>
                  {item.message && (
                    <div
                      style={{
                        fontSize: "0.8rem",
                        lineHeight: 1.4,
                        color: "var(--theme-elevation-700)",
                        paddingLeft: "14px",
                      }}
                    >
                      {item.message}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
