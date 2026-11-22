"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function AddImagesQuickAction() {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuPos({
        top: rect.bottom + 6,
        left: rect.left,
      });
    };

    updatePosition();

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (
        containerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  return (
    <div className="gh-quick-action-menu" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className="gh-quick-action"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span aria-hidden="true" className="gh-quick-action__plus">
          +
        </span>
        <span>Add Images</span>
      </button>

      {open &&
        menuPos &&
        createPortal(
          <div
            ref={popoverRef}
            className="gh-quick-action-menu__popover"
            role="menu"
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            <Link
              href="/admin/collections/media/create?from=dashboard"
              className="gh-quick-action-menu__item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Single Image
            </Link>
            <Link
              href="/admin/collections/media?bulkUpload=1&from=dashboard"
              className="gh-quick-action-menu__item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Multiple Images (Bulk)
            </Link>
          </div>,
          document.body,
        )}

      <style>{`
        .gh-quick-action-menu {
          position: relative;
          display: inline-flex;
        }
        .gh-quick-action-menu__popover {
          position: fixed;
          z-index: 10000;
          display: grid;
          min-width: 196px;
          padding: 6px;
          border: 1px solid var(--theme-elevation-300);
          border-radius: 8px;
          background: var(--theme-elevation-50);
          box-shadow: 0 10px 28px rgb(0 0 0 / 28%);
        }
        .gh-quick-action-menu__item {
          display: block;
          padding: 8px 10px;
          border-radius: 6px;
          color: var(--theme-text);
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          white-space: nowrap;
        }
        .gh-quick-action-menu__item:hover,
        .gh-quick-action-menu__item:focus-visible {
          background: var(--theme-elevation-150);
          outline: none;
        }
      `}</style>
    </div>
  );
}
