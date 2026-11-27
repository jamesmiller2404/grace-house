import type { Metadata } from "next";
import Link from "next/link";
import PressCard from "@/components/PressCard";
import { getNewsAndSupport } from "@/payload/queries";

export const metadata: Metadata = {
  title: "News & Support — Grace House",
  description:
    "Media coverage and community letters of support for Grace House NorCal.",
};

type SearchParams = {
  searchParams: Promise<{ year?: string }>;
};

export default async function NewsAndSupportPage({
  searchParams,
}: SearchParams) {
  const { year: rawYear } = await searchParams;
  const allItems = await getNewsAndSupport();

  const years = Array.from(new Set(allItems.map((item) => item.year))).sort(
    (a, b) => b - a,
  );

  const selectedYear =
    rawYear && /^\d{4}$/.test(rawYear) && years.includes(Number(rawYear))
      ? Number(rawYear)
      : null;

  const filtered = selectedYear
    ? allItems.filter((item) => item.year === selectedYear)
    : allItems;

  const newsItems = filtered.filter((item) => item.type === "news");
  const letterItems = filtered.filter((item) => item.type === "letter");

  return (
    <main className="bg-cream flex-1 px-6 py-14">
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
            <li aria-hidden="true" className="text-ink/60 font-normal">
              ›
            </li>
            <li aria-current="page">News &amp; Support</li>
          </ol>
        </nav>

        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h1 className="font-heading text-anchor text-5xl">
          News &amp; Support
        </h1>
        <p className="text-ink/85 mt-4 max-w-[65ch] text-lg leading-relaxed">
          Read local news coverage about Grace House NorCal and letters of
          support from community partners, leaders, and neighbors.
        </p>

        {/* Server-rendered year filter via URL search params */}
        {years.length > 1 && (
          <nav
            aria-label="Filter by year"
            className="mt-8 flex flex-wrap items-center gap-2"
          >
            <Link
              href="/news-and-support"
              aria-current={selectedYear === null ? "page" : undefined}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra ${
                selectedYear === null
                  ? "bg-anchor text-white"
                  : "border border-ink/20 bg-white text-ink hover:border-anchor/50"
              }`}
            >
              All Years
            </Link>
            {years.map((year) => {
              const active = selectedYear === year;
              return (
                <Link
                  key={year}
                  href={`/news-and-support?year=${year}`}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra ${
                    active
                      ? "bg-anchor text-white"
                      : "border border-ink/20 bg-white text-ink hover:border-anchor/50"
                  }`}
                >
                  {year}
                </Link>
              );
            })}
          </nav>
        )}

        {filtered.length === 0 ? (
          <p className="text-ink/70 mt-12 text-lg">
            No published news articles or letters of support yet. Check back
            soon.
          </p>
        ) : (
          <div className="mt-12 space-y-16">
            {newsItems.length > 0 && (
              <section aria-labelledby="in-the-news-heading">
                <h2
                  id="in-the-news-heading"
                  className="font-heading text-anchor text-3xl sm:text-4xl"
                >
                  In the News
                </h2>
                <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {newsItems.map((item) => (
                    <PressCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )}

            {letterItems.length > 0 && (
              <section aria-labelledby="letters-of-support-heading">
                <h2
                  id="letters-of-support-heading"
                  className="font-heading text-anchor text-3xl sm:text-4xl"
                >
                  Letters of Support
                </h2>
                <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {letterItems.map((item) => (
                    <PressCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
