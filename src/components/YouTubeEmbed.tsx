"use client";

import React from "react";
import VideoEmbed, { type VideoEmbedProps } from "@/components/VideoEmbed";

export type YouTubeEmbedProps = VideoEmbedProps;

export default function YouTubeEmbed(props: YouTubeEmbedProps) {
  return <VideoEmbed {...props} />;
}
