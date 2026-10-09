import Link from "next/link";
import StoriesBrowser from "@/components/StoriesBrowser";
import { stories } from "@/content/stories";

export const metadata = {
  title: "Lives Changed — Grace House",
};

/**
 * Index of every profile/story. Cards reuse the homepage "Lives Changed"
 * card style; each card links to that person's story page.
 */
export default function StoriesIndexPage() {
  return (
    <>
      <main className="bg-sand flex-1 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <nav
            aria-label="Breadcrumb"
            className="text-terra pb-1 text-base font-bold"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="underline-offset-4 hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-ink/60 font-normal">
                ›
              </li>
              <li aria-current="page">Lives Changed</li>
            </ol>
          </nav>

          <div className="bg-gold mt-8 h-1 w-28 rounded-full" />
          <h1 className="font-heading text-anchor mt-4 text-5xl">
            Lives Changed
          </h1>
          <p className="text-ink/80 mt-4 max-w-[60ch] text-lg">
            The people of Grace House — graduates, staff, and volunteers — in
            their own words.
          </p>

          <StoriesBrowser stories={stories} />
        </div>
      </main>
    </>
  );
}
