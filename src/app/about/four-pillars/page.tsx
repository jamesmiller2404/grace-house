import Link from "next/link";
import Nav from "@/components/Nav";
import { fourPillarsPage } from "@/content/fourPillars";

export const metadata = {
  title: "The Four Pillars — Grace House",
};

export default function FourPillarsPage() {
  const { pillarsHeading, pillarsBody } = fourPillarsPage;
  return (
    <>
      <Nav />
      <main className="bg-cream px-6 py-14">
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
              <li>
                <Link
                  href="/about"
                  className="underline-offset-4 hover:underline"
                >
                  About
                </Link>
              </li>
              <li aria-hidden className="text-ink/60 font-normal">›</li>
              <li aria-current="page">{pillarsHeading}</li>
            </ol>
          </nav>

          {/* The Four Pillars */}
          <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
          <h1 className="font-heading text-ink text-5xl">{pillarsHeading}</h1>
          <p className="whitespace-pre-line mt-4 max-w-[60ch] text-lg leading-relaxed">
            {pillarsBody}
          </p>
        </div>
      </main>
    </>
  );
}
