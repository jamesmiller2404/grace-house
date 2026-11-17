"use client";

import type { DefaultCellComponentProps } from "payload";
import React, { useEffect, useState } from "react";

let liveIDsRequest: Promise<Set<string>> | null = null;

function getLiveIDs(): Promise<Set<string>> {
  if (!liveIDsRequest) {
    liveIDsRequest = fetch("/api/media/live-ids", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load website image usage.");
        }
        return response.json() as Promise<{ ids?: Array<string | number> }>;
      })
      .then((data) => new Set((data.ids ?? []).map(String)))
      .catch((error) => {
        liveIDsRequest = null;
        throw error;
      });
  }
  return liveIDsRequest;
}

export default function MediaLiveStatusCell({
  rowData,
}: DefaultCellComponentProps) {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let active = true;
    getLiveIDs()
      .then((ids) => {
        if (active) setIsLive(ids.has(String(rowData.id)));
      })
      .catch(() => {
        if (active) setIsLive(false);
      });

    return () => {
      active = false;
    };
  }, [rowData.id]);

  if (!isLive) return <span aria-label="Not currently live on website">—</span>;

  return (
    <span
      aria-label="Live on website"
      title="Live on website"
      style={{
        display: "inline-block",
        width: 11,
        height: 11,
        borderRadius: "50%",
        backgroundColor: "#00ff5d",
        border: "2px solid rgba(255,255,255,.8)",
        boxShadow: "0 1px 4px rgba(0,0,0,.45)",
        verticalAlign: "middle",
      }}
    />
  );
}
