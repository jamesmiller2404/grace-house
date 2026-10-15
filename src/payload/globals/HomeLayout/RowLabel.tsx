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
 *
 * A "Custom Page" row shows the picked page's title when the relationship is
 * populated ("3. Our History"), falling back to "Custom Page" before a page
 * is chosen.
 */
const SectionRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{
    section?: HomeSectionType;
    customPage?: number | { title?: string } | null;
  }>();
  const type = data?.section;
  // The relationship is populated as an object once a page is picked, and
  // stays a bare id (or empty) otherwise.
  const pickedPage =
    typeof data?.customPage === "object" && data.customPage
      ? data.customPage.title
      : undefined;
  const label = pickedPage ?? (type ? homeSectionLabels[type] : "New section");
  return <span>{`${(rowNumber ?? 0) + 1}. ${label}`}</span>;
};

export default SectionRowLabel;
