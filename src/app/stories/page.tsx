import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
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
      <Nav />
      <main className="bg-sand px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="text-terra flex flex-wrap items-center gap-2 font-semibold">
              <li>
                <Link href="/" className="hover:text-anchor underline-offset-4 hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-ink/60">›</li>
              <li aria-current="page" className="text-ink">
                Lives Changed
              </li>
            </ol>
          </nav>

          <div className="bg-gold mt-8 h-1 w-28 rounded-full" />
          <h1 className="font-heading text-anchor mt-4 text-5xl">Lives Changed</h1>
          <p className="text-ink/80 mt-4 max-w-[60ch] text-lg">
            The people of Grace House — graduates, staff, and volunteers — in
            their own words.
          </p>

          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <li key={story.href} className="flex">
                <Link
                  href={story.href}
                  className="group flex flex-1 flex-col overflow-hidden bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] focus-visible:outline-2 focus-visible:outline-terra"
                >
                  <div className="border-ink/70 relative aspect-[4/3] shrink-0 border-b">
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="bg-lift text-ink inline-block self-start rounded-md px-4 py-1.5 text-sm font-bold tracking-[0.05em] uppercase">
                      {story.tag}
                    </span>
                    <h2 className="font-heading text-anchor mt-4 text-3xl italic">
                      {story.name}
                    </h2>
                    <p className="mt-2 text-base italic">{story.excerpt}</p>
                    <span className="text-terra group-hover:text-lift mt-auto inline-flex items-center gap-2 pt-6 text-lg font-semibold underline underline-offset-4">
                      {story.readLabel} <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}