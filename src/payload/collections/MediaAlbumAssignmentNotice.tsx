"use client";

import React, { useEffect, useState } from "react";
import { useConfig, useDocumentDrawerContext, useField } from "@payloadcms/ui";

/**
 * In the Media drawer opened from an album, show the preassigned album as
 * read-only text. The Albums relationship remains editable on the full page.
 */
const MediaAlbumAssignmentNotice: React.FC = () => {
  const { drawerSlug } = useDocumentDrawerContext();
  const { value } = useField<unknown[]>({ path: "lists" });
  const { config } = useConfig();
  const [albumName, setAlbumName] = useState<string | null>(null);

  const isMediaDrawer =
    typeof drawerSlug === "string" &&
    drawerSlug.startsWith("doc-drawer_media_");

  const firstRelation = Array.isArray(value) ? value[0] : undefined;
  const albumID =
    typeof firstRelation === "string" || typeof firstRelation === "number"
      ? firstRelation
      : firstRelation &&
          typeof firstRelation === "object" &&
          "id" in firstRelation &&
          (typeof firstRelation.id === "string" ||
            typeof firstRelation.id === "number")
        ? firstRelation.id
        : undefined;

  useEffect(() => {
    if (!isMediaDrawer || albumID === undefined) return;

    const controller = new AbortController();
    const apiRoot = config.routes.api.replace(/\/+$/, "");

    void fetch(
      `${apiRoot}/media-lists/${encodeURIComponent(String(albumID))}?depth=0`,
      {
        credentials: "include",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      },
    )
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load album name");
        return (await response.json()) as { name?: unknown };
      })
      .then((album) => {
        if (typeof album.name === "string") setAlbumName(album.name);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setAlbumName(null);
        }
      });

    return () => controller.abort();
  }, [albumID, config.routes.api, isMediaDrawer]);

  if (!isMediaDrawer) return null;

  return (
    <>
      <style>{`
        .doc-drawer #field-lists {
          display: none;
        }
      `}</style>
      <p className="field-description">
        Image assigned to{" "}
        <strong>
          <u>{albumName ?? "this album"}.</u>
        </strong>
      </p>
    </>
  );
};

export default MediaAlbumAssignmentNotice;
