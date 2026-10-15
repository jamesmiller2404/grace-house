"use client";

import { withCondition } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import React from "react";

import ContactSelectField from "./Field";

/**
 * The phone-numbers ContactSelect (./Field.tsx) — the wrapper that bakes in
 * `contactKind: "phone"` (the generic component cannot learn the kind from
 * the field config: `custom` is not guaranteed to reach client components).
 * Registered as the admin component for ContactSelectField("phone", ...)
 * (./index.ts). withCondition mirrors StatusSelect's wiring.
 */
const PhoneContactSelect: React.FC<TextFieldClientProps> = (props) => (
  <ContactSelectField {...props} contactKind="phone" />
);

export default withCondition(PhoneContactSelect);
