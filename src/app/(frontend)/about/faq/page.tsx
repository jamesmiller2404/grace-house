import Link from "next/link";
import { site } from "@/content/site";

// Placeholder FAQ page. The original Q&A page is stashed at
// _stashed_page.tsx.bak (excluded from routing) — restore it by moving that
// file back to page.tsx and deleting this one.

export const metadata = {
  title: "FAQ — Grace House",
};

export default function FaqPage() {
  return (
    <main className="flex-1 bg-cream px-6 py-14">
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
            <li aria-current="page">FAQ</li>
          </ol>
        </nav>

        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h1 className="font-heading text-ink text-5xl">FAQ</h1>
        <p className="text-ink/80 mt-4 max-w-[60ch] text-lg leading-relaxed">
          Frequently Asked Questions page is on its way.
        </p>
        <p className="text-ink/70 mt-4 max-w-[60ch] leading-relaxed">
          In the meantime, if you have a question, call us at{" "}
          <a href={site.phoneHref} className="text-gold font-semibold hover:underline">
            {site.phone}
          </a>{" "}
          or email{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-gold font-semibold break-all hover:underline"
          >
            {site.email}
          </a>{" "}
         -
        </p>
      </div>
    </main>
  );
}
