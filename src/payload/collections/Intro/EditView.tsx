"use client";

import { DefaultEditView } from "@payloadcms/ui";
import React from "react";

/** Keep the What is Grace House editor on Payload's standard edit layout. */
type EditViewProps = Parameters<typeof DefaultEditView>[0];

export default function IntroEditView(props: EditViewProps) {
  return <DefaultEditView {...props} />;
}
