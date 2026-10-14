import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/payload/queries";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCustomPageBySlug(slug);
  if (!page) return {};
  return {
    title: `${page.title} — Grace House`,
  };
}

/**
 * A custom (spare) page, rendered from the `custom-pages` collection in the
 * database (managed in /admin/collections/custom-pages). The slug is derived
 * from the page name, so every enabled page gets a URL automatically, and all
 * `/pages/<slug>` routes share this one layout.
 *
 * A page is only reachable while its "Show in header menu" checkbox is
 * ticked in the admin panel — disabled spare pages (and unknown slugs)
 * render 404, so a half-filled page never leaks to the public. The name also
 * appears in the header's "More" dropdown while it is enabled (see
 * src/app/(frontend)/layout.tsx and src/components/Nav.tsx).
 */
export default async function CustomPage({ params }: Params) {
  const { slug } = await params;
  const page = await getCustomPageBySlug(slug);
  if (!page) notFound();

  return (
    <main className="bg-cream flex-1 px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="Breadcrumb"
          className="text-terra pb-1 text-base font-bold"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/"
                className="underline-offset-4 hover:underline"
              >
                Home
              </Link>
            </li>
            <li aria-hidden className="text-ink/60 font-normal">›</li>
            <li aria-current="page">{page.title}</li>
          </ol>
        </nav>

        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h1 className="font-heading text-ink text-5xl">{page.title}</h1>

        {/* The page body — blocks in the order the editor stacked them. */}
        <div className="max-w-[70ch]">
          {page.blocks.map((block, i) => {
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
                <h2
                  key={i}
                  className="font-heading text-ink mt-10 text-3xl sm:text-4xl"
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
        </div>
      </div>
    </main>
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
