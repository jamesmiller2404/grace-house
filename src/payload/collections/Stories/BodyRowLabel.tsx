"use client";

import { useRowLabel } from "@payloadcms/ui";
import React from "react";

/**
 * Row label for the Stories `body` array (registered in
 * src/payload/collections/Stories.ts). Shows the block type and a short
 * snippet of its text — e.g. "2. Heading: Finding her footing" — instead of
 * Payload's default "Block 02", so the paragraph / heading order reads at a
 * glance even when the rows are collapsed.
 */
const BodyRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{ type?: string; text?: string }>();
  const type = data?.type || "Paragraph";
  const text = (data?.text || "").trim();
  const snippet = text.length > 40 ? `${text.slice(0, 40).trimEnd()}…` : text;
  const label = snippet ? `${type}: ${snippet}` : type;
  return <span>{`${(rowNumber ?? 0) + 1}. ${label}`}</span>;
};

export default BodyRowLabel;
