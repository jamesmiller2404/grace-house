"use client";

import React from "react";

const MediaListImagesMobileLayout: React.FC = () => {
  return (
    <style>{`
      #field-images .no-results > :not(.gh-album-empty-state) {
        display: none !important;
      }

      #field-images .gh-album-empty-state {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding-top: calc(var(--base) / 2);
      }

      #field-images .gh-album-empty-state__message {
        margin: 0;
        color: var(--theme-elevation-900);
        font-size: 0.95rem;
      }

      #field-images .gh-album-empty-state__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 1rem;
      }

      #field-images .gh-album-empty-state__button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        min-height: 42px;
        padding: 0.6rem 0.9rem;
        background: var(--theme-elevation-100);
        border: 1px solid var(--theme-elevation-300);
        border-radius: 5px;
        color: var(--theme-elevation-900);
        font: inherit;
        font-size: 0.9rem;
        font-weight: 600;
        line-height: 1.2;
        cursor: pointer;
      }

      #field-images .gh-album-empty-state__button:hover {
        background: var(--theme-elevation-200);
        border-color: var(--theme-elevation-500);
        color: var(--theme-elevation-1000);
      }

      @media (max-width: 767px) {
        #field-images .gh-album-empty-state__actions {
          width: 100%;
        }

        #field-images .gh-album-empty-state__button {
          flex: 1 1 auto;
        }
      }

      /* Match the Primary List desktop/tablet thumbnail dimensions exactly. */
      @media (min-width: 768px) {
        #field-images .table td:has(img) {
          min-width: 200px !important;
          vertical-align: middle;
        }

        #field-images .table td:has(img) .thumbnail,
        #field-images .table td:has(img) [class*="thumbnail"] {
          display: block !important;
          width: 180px !important;
          height: 120px !important;
          min-width: 180px !important;
          min-height: 120px !important;
          max-width: 180px !important;
          max-height: 120px !important;
          overflow: hidden !important;
          position: relative !important;
        }

        #field-images .table td:has(img) img {
          display: block !important;
          width: 180px !important;
          height: 120px !important;
          min-width: 180px !important;
          min-height: 120px !important;
          max-width: 180px !important;
          max-height: 120px !important;
          object-fit: contain !important;
          background: #222;
          border-radius: 6px;
        }

        #field-images .table tr:has(td img) {
          height: 136px;
        }
      }

      @media (max-width: 767px) {
        #field-images {
          width: 100%;
          min-width: 0;
        }

        #field-images .table-wrap,
        #field-images .collection-list__wrap,
        #field-images .collection-list__table-wrap {
          width: 100% !important;
          max-width: 100% !important;
          overflow: visible !important;
        }

        #field-images .table,
        #field-images .table tbody {
          display: block !important;
          width: 100% !important;
          min-width: 0 !important;
        }

        #field-images .table thead {
          display: none !important;
        }

        #field-images .table tbody tr {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) !important;
          gap: 12px !important;
          width: 100% !important;
          height: auto !important;
          margin: 0 0 14px !important;
          padding: 14px !important;
          box-sizing: border-box !important;
          border: 1px solid var(--theme-elevation-200) !important;
          border-radius: 8px !important;
          background: var(--theme-elevation-50) !important;
        }

        #field-images .table tbody tr td {
          display: flex !important;
          align-items: flex-start !important;
          gap: 8px !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          max-height: none !important;
          padding: 0 !important;
          border: 0 !important;
          white-space: normal !important;
          overflow-wrap: anywhere !important;
          box-sizing: border-box !important;
        }

        #field-images .table tbody tr td:has(img) {
          display: block !important;
          grid-column: 1 / -1 !important;
          width: 100% !important;
          min-width: 0 !important;
          line-height: 0 !important;
        }

        #field-images .table tbody tr td:has(img),
        #field-images .table tbody tr td:has(img) :not(img) {
          height: auto !important;
          min-height: 0 !important;
          max-height: none !important;
          aspect-ratio: auto !important;
          align-self: start !important;
        }

        #field-images .table tbody tr td:has(img) .thumbnail,
        #field-images .table tbody tr td:has(img) [class*="thumbnail"],
        #field-images .table tbody tr td:has(img) a:has(img) {
          display: block !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          max-height: none !important;
          aspect-ratio: auto !important;
          overflow: visible !important;
          position: static !important;
        }

        #field-images .table tbody tr td:has(img) img {
          display: block !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          max-height: 360px !important;
          aspect-ratio: auto !important;
          object-fit: contain !important;
          object-position: center !important;
          background: #222 !important;
          border-radius: 6px !important;
        }

        #field-images .table tbody tr td:not(:has(img))::before {
          flex: 0 0 76px;
          color: var(--theme-elevation-500);
          font-size: 11px;
          font-weight: 600;
          line-height: 1.5;
        }

        #field-images .table tbody tr td:nth-child(2)::before {
          content: "Alt text";
        }

        #field-images .table tbody tr td:nth-child(3)::before {
          content: "Updated";
        }
      }
    `}</style>
  );
};

export default MediaListImagesMobileLayout;
