"use client";

import React from "react";
import Link from "next/link";
import { formatAdminURL } from "payload/shared";
import { CheckboxInput, useConfig, useListQuery, useSelection } from "@payloadcms/ui";

type MediaListDoc = {
  id: number | string;
  alt?: string | null;
  filename?: string | null;
  thumbnailURL?: string | null;
  url?: string | null;
};

const MediaMobileCards: React.FC = () => {
  const { config } = useConfig();
  const { data } = useListQuery();
  const { selected, setSelection } = useSelection();

  const docs = (data?.docs ?? []) as MediaListDoc[];
  const adminRoute = config.routes.admin;

  if (docs.length === 0) return null;

  return (
    <>
      <div className="gh-mobile-media-grid" aria-label="Media Library images">
        {docs.map((doc) => {
          const imageURL = doc.thumbnailURL || doc.url;
          const filename = doc.filename || `Image ${doc.id}`;
          const editURL = formatAdminURL({
            adminRoute,
            serverURL: config.serverURL,
            path: `/collections/media/${doc.id}`,
          });

          return (
            <article className="gh-mobile-media-card" key={String(doc.id)}>
              <div className="gh-mobile-media-card__selection">
                <CheckboxInput
                  checked={Boolean(selected.get(doc.id))}
                  className="gh-mobile-media-card__checkbox"
                  onToggle={() => setSelection(doc.id)}
                />
                <span>Select image</span>
              </div>

              <Link
                className="gh-mobile-media-card__image-link"
                href={editURL}
                aria-label={`Edit ${filename}`}
              >
                {imageURL ? (
                  // Payload's upload URL is supplied by the Media document.
                  <img src={imageURL} alt={doc.alt || ""} loading="lazy" />
                ) : (
                  <span className="gh-mobile-media-card__no-image">Preview unavailable</span>
                )}
              </Link>

              <div className="gh-mobile-media-card__filename">{filename}</div>
            </article>
          );
        })}
      </div>

      <style>{`
        .gh-mobile-media-grid {
          display: none;
        }

        @media (max-width: 767px) {
          .collection-list--media .collection-list__tables {
            display: none !important;
          }

          .gh-mobile-media-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            margin: 0 0 20px;
          }

          .gh-mobile-media-card {
            min-width: 0;
            overflow: hidden;
            border: 1px solid var(--theme-elevation-200);
            border-radius: 8px;
            background: var(--theme-elevation-50);
          }

          .gh-mobile-media-card__selection {
            display: flex;
            min-height: 44px;
            align-items: center;
            gap: 10px;
            padding: 8px 10px;
            border-bottom: 1px solid var(--theme-elevation-150);
            color: var(--theme-text);
            font-size: 13px;
          }

          .gh-mobile-media-card__checkbox {
            flex: 0 0 auto;
          }

          .gh-mobile-media-card__image-link {
            display: flex;
            width: 100%;
            aspect-ratio: 4 / 3;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: var(--theme-elevation-100);
            text-decoration: none;
          }

          .gh-mobile-media-card__image-link img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .gh-mobile-media-card__no-image {
            padding: 12px;
            color: var(--theme-elevation-500);
            font-size: 12px;
            text-align: center;
          }

          .gh-mobile-media-card__filename {
            overflow-wrap: anywhere;
            padding: 9px 10px 11px;
            color: var(--theme-text);
            font-size: 12px;
            line-height: 1.4;
          }
        }

        @media (max-width: 380px) {
          .gh-mobile-media-grid {
            gap: 8px;
          }

          .gh-mobile-media-card__selection {
            gap: 7px;
            padding-right: 7px;
            padding-left: 7px;
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default MediaMobileCards;
