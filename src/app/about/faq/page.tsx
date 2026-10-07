import Link from "next/link";
import { faqPage } from "@/content/faq";

export const metadata = {
  title: "FAQ — Grace House",
};

export default function FaqPage() {
  const { faqHeading, faqIntro, faqs } = faqPage;
  return (
    <>
      <main className="flex-1 bg-cream px-6 py-14">
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
              <li aria-current="page">{faqHeading}</li>
            </ol>
          </nav>

          {/* FAQ */}
          <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
          <h1 className="font-heading text-ink text-5xl">{faqHeading}</h1>
          <p className="mt-4 max-w-[60ch] text-lg leading-relaxed">
            {faqIntro}
          </p>

          <ul className="mt-10 max-w-3xl space-y-4">
            {faqs.map((faq) => (
              <li key={faq.question}>
                <details className="group bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] focus-within:outline-2 focus-within:outline-terra open:bg-white">
                  <summary className="font-heading text-anchor flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-xl">
                    {faq.question}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </summary>
                  <p className="text-ink/80 px-6 pb-5 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
