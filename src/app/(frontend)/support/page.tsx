import Link from "next/link";
import type { Metadata } from "next";
import { getDonate } from "@/payload/queries";

export const metadata: Metadata = {
  title: "Donate — Grace House",
};

/**
 * The Donate page, reading its content from the `donate` collection in the
 * database (managed in /admin/collections/donate). Renders at request time,
 * so admin-panel edits show up immediately.
 */
export default async function SupportPage() {
  const d = await getDonate();
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
            <li aria-hidden className="text-ink/60 font-normal">›</li>
            <li aria-current="page">Donate</li>
          </ol>
        </nav>

        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h1 className="font-heading text-ink text-5xl">{d.title}</h1>
        <p className="mt-4 max-w-[60ch] text-lg leading-relaxed">
          {d.intro}
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {/* PayPal */}
          <section
            aria-labelledby="paypal-title"
            className="border-anchor/15 rounded-lg border bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 id="paypal-title" className="font-heading text-ink text-3xl">
              {d.paypal.heading}
            </h2>
            <p className="mt-3 leading-relaxed">
              {d.paypal.bodyStart}{" "}
              <a
                href={`mailto:${d.paypal.email}`}
                className="font-semibold break-all underline underline-offset-4 hover:underline"
              >
                {d.paypal.email}
              </a>{" "}
              {d.paypal.bodyEnd}
            </p>
            <a
              href={d.paypal.buttonHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderRadius: "8px" }}
              className="bg-terra hover:bg-terra/90 mt-6 inline-block rounded-md px-6 py-3 text-lg font-bold text-white transition-colors"
            >
              {d.paypal.buttonLabel}
            </a>
          </section>

          {/* Venmo */}
          <section
            aria-labelledby="venmo-title"
            className="border-anchor/15 rounded-lg border bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 id="venmo-title" className="font-heading text-ink text-3xl">
              {d.venmo.heading}
            </h2>
            <p className="mt-3 leading-relaxed">
              {d.venmo.bodyStart}{" "}
              <a
                href={d.venmo.profileHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-4 hover:underline"
              >
                {d.venmo.username}
              </a>
              {d.venmo.bodyEnd}
            </p>
            <a
              href={d.venmo.buttonHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderRadius: "8px" }}
              className="bg-anchor hover:bg-anchor/90 mt-6 inline-block rounded-md px-6 py-3 text-lg font-bold text-white transition-colors"
            >
              {d.venmo.buttonLabel}
            </a>
          </section>
        </div>

        <p className="text-ink/70 mt-10 max-w-[70ch] text-base leading-relaxed">
          {d.note.text}{" "}
          <a
            href={d.note.phoneHref}
            className="font-semibold underline underline-offset-4"
          >
            {d.note.phone}
          </a>
          .
        </p>
        <hr className="border-anchor/20 my-12" />

        {/* Additional text blocks (e.g. Underground Clothing Connection) */}
        <div className="max-w-[70ch]">
          {d.blocks.map((block, i) =>
            block.type === "Heading" ? (
              <h2
                key={i}
                className="font-heading text-ink mt-10 text-3xl sm:text-4xl"
              >
                {block.text}
              </h2>
            ) : (
              <p
                key={i}
                className={`whitespace-pre-line leading-relaxed ${
                  i === 0 ? "mt-4" : "mt-6"
                }`}
              >
                {block.text}
                {block.linkLabel && block.linkHref && (
                  <>
                    {" "}
                    <a
                      href={block.linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        block.linkLabel.length > 30
                          ? "break-all underline underline-offset-4 hover:underline"
                          : "underline underline-offset-4 hover:underline"
                      }
                    >
                      {block.linkLabel}
                    </a>
                  </>
                )}
              </p>
            ),
          )}
        </div>
      </div>
    </main>
  );
}
