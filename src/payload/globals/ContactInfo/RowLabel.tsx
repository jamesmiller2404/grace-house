"use client";

import { useRowLabel } from "@payloadcms/ui";
import React from "react";

/**
 * Row label for the contact-info `phoneNumbers` and `emails` arrays
 * (registered in src/payload/globals/ContactInfo.ts). Shows the row's label
 * and value — e.g. "Office — (916) 470-0408" — instead of Payload's default
 * "Phone Number 01", so the list reads as the site's contact points at a
 * glance even when the rows are collapsed. One component serves both arrays
 * because every row has the same { label, value } shape.
 */
const ContactRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{
    label?: string;
    value?: string;
  }>();
  const text = data?.label
    ? data.value
      ? `${data.label} — ${data.value}`
      : data.label
    : data?.value || "New contact";
  return <span>{`${(rowNumber ?? 0) + 1}. ${text}`}</span>;
};

export default ContactRowLabel;
