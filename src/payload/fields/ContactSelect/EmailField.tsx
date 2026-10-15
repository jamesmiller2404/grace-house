"use client";

import { withCondition } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import React from "react";

import ContactSelectField from "./Field";

/**
 * The emails ContactSelect (./Field.tsx) — the wrapper that bakes in
 * `contactKind: "email"`. Registered as the admin component for
 * ContactSelectField("email", ...) (./index.ts).
 */
const EmailContactSelect: React.FC<TextFieldClientProps> = (props) => (
  <ContactSelectField {...props} contactKind="email" />
);

export default withCondition(EmailContactSelect);
