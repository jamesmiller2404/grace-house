"use client";

import { useRowLabel } from "@payloadcms/ui";
import React from "react";

/**
 * Row label for the Custom Pages `blocks` array (registered in
 * src/payload/collections/CustomPages.ts). Shows the block type and — for a
 * Paragraph or Heading — a short snippet of its text ("2. Heading: Our
 * History"), for a Photo just the type ("3. Photo"), instead of Payload's
 * default "Block 02", so the block order reads at a glance even when the
 * rows are collapsed. Same behaviour as
 * src/payload/collections/Donate/BlockRowLabel.tsx.
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
