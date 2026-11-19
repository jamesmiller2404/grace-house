"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import { useConfig } from "@payloadcms/ui";
import type { BeforeListClientProps } from "payload";

type MediaTag = {
  id: number | string;
  name: string;
};

const MediaTagFilters: React.FC<BeforeListClientProps> = () => {
  const { config } = useConfig();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tags, setTags] = useState<MediaTag[]>([]);
  const isMediaCollection = pathname.endsWith("/collections/media");
  const selectedTagID = searchParams.get("where[tags][in]");

  const mediaListURL = formatAdminURL({
    adminRoute: config.routes.admin,
    serverURL: config.serverURL,
    path: "/collections/media",
  });

  useEffect(() => {
    if (!isMediaCollection) return;

    const controller = new AbortController();

    const loadTags = async () => {
      try {
        const response = await fetch("/api/media-tags?limit=100&sort=name&depth=0", {
          credentials: "include",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error("Could not load Media tags.");
        }

        const data = (await response.json()) as { docs?: MediaTag[] };
        setTags(Array.isArray(data.docs) ? data.docs : []);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Could not load Media tags.", error);
          setTags([]);
        }
      }
    };

    void loadTags();
    return () => controller.abort();
  }, [isMediaCollection]);

  if (!isMediaCollection || tags.length === 0) return null;

  return (
    <nav className="gh-media-tag-filters" aria-label="Filter Media by tag">
      <span className="gh-media-tag-filters__label">Filter by Tag</span>
      <a
        className={selectedTagID ? "gh-media-tag-filters__link" : "gh-media-tag-filters__link is-active"}
        href={mediaListURL}
        aria-current={selectedTagID ? undefined : "page"}
      >
        All Images
      </a>
      {tags.map((tag) => {
        const isActive = selectedTagID === String(tag.id);
        return (
          <a
            className={isActive ? "gh-media-tag-filters__link is-active" : "gh-media-tag-filters__link"}
            href={`${mediaListURL}?where[tags][in]=${encodeURIComponent(String(tag.id))}`}
            key={String(tag.id)}
            aria-current={isActive ? "page" : undefined}
          >
            {tag.name}
          </a>
        );
      })}
      <style>{`
        /*
         * Keep Payload's native controls mounted in their original React tree,
         * but position their action row over the right side of the tag strip.
         * This preserves the built-in Columns and Filters dropdown behavior.
         */
        .list-controls {
          position: relative;
        }
        /* Hide the Alt search input and its icon, but retain native list actions. */
        .list-controls .search-bar > .search-filter,
        .list-controls .search-bar > .icon--search {
          display: none;
        }
        .list-controls .search-bar__actions {
          position: absolute;
          top: calc(100% + 24px);
          right: 14px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }
        .gh-media-tag-filters {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin: 0 0 18px;
          padding: 12px 170px 12px 14px;
          border: 1px solid var(--theme-elevation-150);
          border-radius: 8px;
          background: var(--theme-elevation-50);
        }
        .gh-media-tag-filters__label {
          margin-right: 4px;
          color: var(--theme-elevation-600);
          font-size: 12px;
          font-weight: 600;
        }
        .gh-media-tag-filters__link {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 4px 10px;
          border: 1px solid var(--theme-elevation-200);
          border-radius: 5px;
          color: var(--theme-text);
          font-size: 12px;
          line-height: 1.3;
          text-decoration: none;
        }
        .gh-media-tag-filters__link:hover {
          border-color: var(--theme-elevation-500);
          background: var(--theme-elevation-100);
        }
        .gh-media-tag-filters__link.is-active {
          border-color: #8b70d6;
          background: #34294f;
          color: #e3d8ff;
          font-weight: 600;
        }
        @media (max-width: 767px) {
          .list-controls .search-bar__actions {
            top: calc(100% + 24px);
            right: 8px;
            gap: 6px;
          }
          .gh-media-tag-filters {
            align-items: flex-start;
            padding-right: 150px;
          }
          .gh-media-tag-filters__label {
            flex-basis: 100%;
          }
        }
      `}</style>
    </nav>
  );
};

export default MediaTagFilters;
