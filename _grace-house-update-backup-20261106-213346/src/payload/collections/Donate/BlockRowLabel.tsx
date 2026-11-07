"use client";

import { useRowLabel } from "@payloadcms/ui";
import React from "react";

/**
 * Row label for the Donate `blocks` array (registered in
 * src/payload/collections/Donate.ts). Shows the block type and a short
 * snippet of its text — e.g. "2. Heading: Underground Clothing Connection" —
 * instead of Payload's default "Block 02", so the heading/paragraph order
 * reads at a glance even when the rows are collapsed. Same behaviour as
 * src/payload/collections/Stories/BodyRowLabel.tsx.
 */
const BlockRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{ type?: string; text?: string }>();
  const type = data?.type || "Paragraph";
  const text = (data?.text || "").trim();
  const snippet = text.length > 40 ? `${text.slice(0, 40).trimEnd()}…` : text;
  const label = snippet ? `${type}: ${snippet}` : type;
  return <span>{`${(rowNumber ?? 0) + 1}. ${label}`}</span>;
};

export default BlockRowLabel;