"use client";

import { withCondition } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import React from "react";

import ContactSelectField from "./Field";

/**
 * The physical-addresses ContactSelect (./Field.tsx) — the wrapper that bakes
 * in `contactKind: "address"`. Registered as the admin component for
 * ContactSelectField("address", ...) (./index.ts).
 */
const AddressContactSelect: React.FC<TextFieldClientProps> = (props) => (
  <ContactSelectField {...props} contactKind="address" />
);

export default withCondition(AddressContactSelect);
