"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export default function AddImagesQuickAction() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="gh-quick-action-menu" ref={containerRef}>
      <button
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

      {open && (
        <div className="gh-quick-action-menu__popover" role="menu">
          <Link
            href="/admin/collections/media/create"
            className="gh-quick-action-menu__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Single Image
          </Link>
          <Link
            href="/admin/collections/media?bulkUpload=1"
            className="gh-quick-action-menu__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Multiple Images (Bulk)
          </Link>
        </div>
      )}

      <style>{`
        .gh-quick-action-menu {
          position: relative;
          display: inline-flex;
        }
        .gh-quick-action-menu__popover {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          z-index: 50;
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
