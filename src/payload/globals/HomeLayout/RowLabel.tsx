"use client";

import { useRowLabel } from "@payloadcms/ui";
import React from "react";
import { homeSectionLabels, type HomeSectionType } from "@/content/homeLayout";

/**
 * Row label for the home-layout `sections` array (registered in
 * src/payload/globals/HomeLayout.ts). Shows the section's friendly name and
 * its position — e.g. "1. Get Help Now" — instead of Payload's default
 * "Section 01", so the list reads as the home page order at a glance even
 * when the rows are collapsed.
 */
const SectionRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{ section?: HomeSectionType }>();
  const type = data?.section;
  const label = type ? homeSectionLabels[type] : "New section";
  return <span>{`${(rowNumber ?? 0) + 1}. ${label}`}</span>;
};

export default SectionRowLabel;
