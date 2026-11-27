import React from "react";

export type DividerAlign = "left" | "center" | "right";

export type DividerImageProps = {
  image: string;
  alt?: string;
  align?: DividerAlign;
  className?: string;
};

/**
 * Shared frontend renderer for a Divider / Ending Image block (transparent PNG
 * illustration such as the Sunrise horizontal rule). Defaults to centered.
 */
export default function DividerImage({
  image,
  alt = "",
  align = "center",
  className = "",
}: DividerImageProps) {
  if (!image) return null;

  const alignClass =
    align === "left"
      ? "mr-auto"
      : align === "right"
        ? "ml-auto"
        : "mx-auto";

  return (
    <div className={`mt-8 w-full ${className}`.trim()}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={alt}
        className={`block h-auto w-full max-w-[60ch] ${alignClass}`}
      />
    </div>
  );
}
