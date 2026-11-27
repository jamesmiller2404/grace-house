import Image from "next/image";
import Link from "next/link";
import type { CustomPageBlock } from "@/content/customPages";
import { splitBlockParagraphs } from "@/lib/splitBlockParagraphs";
import { RichText } from "@payloadcms/richtext-lexical/react";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import DividerImage from "@/components/DividerImage";

/**
 * Renders a custom page's body — the blocks in the order the editor stacked
 * them — shared by the standalone page (/pages/<slug>, see
 * src/app/(frontend)/pages/[slug]/page.tsx) and the home page's "Custom Page"
 * section (src/sections/CustomPageSection.tsx), so the two can never drift
 * apart. The surrounding layout (headings, breadcrumb, widths) belongs to the
 * callers; this renders the blocks only.
 */
export default function CustomPageBlocks({
  blocks,
  columns = "1",
}: {
  blocks: CustomPageBlock[];
  columns?: "1" | "2" | "3";
}) {
  const isMultiColumn = columns === "2" || columns === "3";
  const gridClass =
    columns === "3"
      ? "mt-8 grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-3"
      : columns === "2"
        ? "mt-8 grid items-start gap-8 md:grid-cols-2"
        : "";

  const content = blocks.map((block, i) => {
    if (block.type === "divider") {
      return (
        <DividerImage
          key={i}
          image={block.image}
          alt={block.alt}
          align={block.align}
          className={isMultiColumn ? "col-span-full" : ""}
        />
      );
    }
    if (block.type === "video") {
      return (
        <div key={i} className={isMultiColumn ? "w-full" : "mt-10 max-w-2xl"}>
          <YouTubeEmbed videoUrl={block.videoUrl} caption={block.caption} />
        </div>
      );
    }
    if (block.type === "photo") {
      return (
        <figure key={i} className={isMultiColumn ? "w-full" : "mt-10"}>
          <div
            className={
              isMultiColumn
                ? "border-ink w-full overflow-hidden rounded-lg border-2"
                : "border-ink inline-block max-w-2xl overflow-hidden rounded-lg border-2"
            }
          >
            <Image
              src={block.image}
              alt={block.alt}
              width={1200}
              height={800}
              sizes={
                columns === "3"
                  ? "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  : columns === "2"
                    ? "(min-width:768px) 50vw, 100vw"
                    : "(min-width:1024px) 50vw, 100vw"
              }
              className={
                isMultiColumn
                  ? "block h-auto w-full object-cover"
                  : "block h-auto max-h-[80vh] w-auto max-w-full"
              }
            />
          </div>
          {block.caption && (
            <figcaption className="text-ink/80 mt-2 text-base">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }
    const link =
      block.linkLabel && block.linkHref
        ? { href: block.linkHref, label: block.linkLabel }
        : null;
    if (block.type === "heading") {
      return (
        <h2
          key={i}
          className={`font-heading text-ink text-3xl sm:text-4xl ${
            isMultiColumn ? "col-span-full mt-4" : "mt-10"
          }`}
        >
          {block.text}
          {link && (
            <>
              {" "}
              <BlockLink href={link.href} label={link.label} />
            </>
          )}
        </h2>
      );
    }
    if (block.content) {
      return (
        <div
          key={i}
          className={`text-ink/90 leading-relaxed [&_p]:mt-6 [&_p:first-child]:mt-4 [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4 ${
            isMultiColumn ? "[&_p:first-child]:mt-0" : ""
          }`}
        >
          <RichText data={block.content as never} />
        </div>
      );
    }
    const paragraphs = splitBlockParagraphs(block.text);
    const renderedParagraphs = paragraphs.map((paragraph, paragraphIndex) => (
      <p
        key={`${i}-${paragraphIndex}`}
        className={`text-ink/90 whitespace-pre-line leading-relaxed ${
          isMultiColumn && paragraphIndex === 0
            ? "mt-0"
            : i === 0 && paragraphIndex === 0
              ? "mt-4"
              : "mt-6"
        }`}
      >
        {paragraph}
        {paragraphIndex === paragraphs.length - 1 && link && (
          <>
            {" "}
            <BlockLink href={link.href} label={link.label} />
          </>
        )}
      </p>
    ));
    return isMultiColumn ? <div key={i}>{renderedParagraphs}</div> : renderedParagraphs;
  });

  if (isMultiColumn) {
    return <div className={gridClass}>{content}</div>;
  }
  return <>{content}</>;
}

/**
 * The optional link attached to a paragraph/heading block. Internal links
 * (starting with "/") render through Next's Link; website URLs open in a new
 * tab; tel:/mailto: links hand off to the phone's dialer / mail app.
 */
function BlockLink({ href, label }: { href: string; label: string }) {
  const classes =
    label.length > 30
      ? "break-all underline underline-offset-4 hover:underline"
      : "underline underline-offset-4 hover:underline";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={`font-semibold ${classes}`}>
        {label}
      </Link>
    );
  }
  const external = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`font-semibold ${classes}`}
    >
      {label}
    </a>
  );
}
