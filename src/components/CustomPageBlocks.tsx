import Image from "next/image";
import Link from "next/link";
import type { CustomPageBlock } from "@/content/customPages";

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
}: {
  blocks: CustomPageBlock[];
}) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === "photo") {
          return (
            <figure key={i} className="mt-10">
              <div className="border-ink relative aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-lg border-2">
                <Image
                  src={block.image}
                  alt={block.alt}
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover"
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
            <h2 key={i} className="font-heading text-ink mt-10 text-3xl sm:text-4xl">
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
        return (
          <p
            key={i}
            className={`text-ink/90 whitespace-pre-line leading-relaxed ${
              i === 0 ? "mt-4" : "mt-6"
            }`}
          >
            {block.text}
            {link && (
              <>
                {" "}
                <BlockLink href={link.href} label={link.label} />
              </>
            )}
          </p>
        );
      })}
    </>
  );
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
