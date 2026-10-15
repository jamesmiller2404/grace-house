import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CustomPageBlocks from "@/components/CustomPageBlocks";
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

        {/* The page body — blocks in the order the editor stacked them
            (shared with the home page's "Custom Page" section). */}
        <div className="max-w-[70ch]">
          <CustomPageBlocks blocks={page.blocks} />
        </div>
      </div>
    </main>
  );
}

