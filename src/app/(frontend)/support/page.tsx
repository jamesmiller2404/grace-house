import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Donate — Grace House",
};

export default function SupportPage() {
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
        <h1 className="font-heading text-ink text-5xl">Donate to Grace House</h1>
        <p className="mt-4 max-w-[60ch] text-lg leading-relaxed">
          Your generosity helps Grace House restore families and give hope to
          the hopeless. If you would like to donate to Grace House, you can do
          so via PayPal or Venmo below. Every gift makes a difference.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {/* PayPal */}
          <section
            aria-labelledby="paypal-title"
            className="border-anchor/15 rounded-lg border bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 id="paypal-title" className="font-heading text-ink text-3xl">
              PayPal
            </h2>
            <p className="mt-3 leading-relaxed">
              If you would like to donate to the Grace House you can do so
              directly via PayPal using{" "}
              <a
                href={`mailto:${site.paypal.email}`}
                className="font-semibold break-all underline underline-offset-4 hover:underline"
              >
                {site.paypal.email}
              </a>{" "}
              or click the following button.
            </p>
            <a
              href={site.paypal.donateHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderRadius: "8px" }}
              className="bg-terra hover:bg-terra/90 mt-6 inline-block rounded-md px-6 py-3 text-lg font-bold text-white transition-colors"
            >
              Donate with PayPal
            </a>
          </section>

          {/* Venmo */}
          <section
            aria-labelledby="venmo-title"
            className="border-anchor/15 rounded-lg border bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 id="venmo-title" className="font-heading text-ink text-3xl">
              Venmo
            </h2>
            <p className="mt-3 leading-relaxed">
              If you would like to donate to Grace House you can do so via
              Venmo with the username{" "}
              <a
                href={site.venmo.profileHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-4 hover:underline"
              >
                {site.venmo.username}
              </a>
              .
            </p>
            <a
              href={site.venmo.profileHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderRadius: "8px" }}
              className="bg-anchor hover:bg-anchor/90 mt-6 inline-block rounded-md px-6 py-3 text-lg font-bold text-white transition-colors"
            >
              Donate with Venmo
            </a>
          </section>
        </div>

        <p className="text-ink/70 mt-10 max-w-[70ch] text-base leading-relaxed">
          Grace House is a 501(c)(3) nonprofit organization. Thank you for
          supporting faith-based recovery in Northern California. For questions
          about donating, call us at{" "}
          <a href={site.phoneHref} className="font-semibold underline underline-offset-4">
            {site.phone}
          </a>
          .
        </p>
        <hr className="border-anchor/20 my-12" />

        {/* Underground Clothing Connection */}
        <section aria-labelledby="ucc-title" className="max-w-[70ch]">
          <h2 id="ucc-title" className="font-heading text-ink text-3xl sm:text-4xl">
            Underground Clothing Connection
          </h2>
          <p className="mt-4 leading-relaxed">
            Grace House thanks you for your donations. We would like to see
            clothing donations go to those families who need them the most. As
            a result we would suggest that donations go to the Underground
            Clothing Connection in Sunrise Mall. It is a clothing school for
            homeless students and students in the San Juan Unified School
            District. The kids and their families are able to go shop for free
            clothing where they might not otherwise get clothes for school.
            This service is free. We feel this is the best way to donate right
            now. Thank you.
          </p>

          <p className="mt-6 leading-relaxed">
            A free clothing store located in Sunrise Mall, exclusively for
            students and their families of San Juan Unified School District (by
            school referral only).
          </p>

          <div className="mt-6 space-y-4 leading-relaxed">
            <p>
              <span className="font-bold">Hours:</span>
              <br />
              Wednesdays: 11am to 4pm. Saturdays: 11am to 3pm.
            </p>
            <p>
              <span className="font-bold">Location:</span>
              <br />
              5932 Sunrise Mall, Citrus Heights, CA 95610 (Next to the theater
              inside Sunrise Mall)
            </p>
            <p>
              <span className="font-bold">Contact:</span>
              <br />
              <a
                href="tel:+19169529797"
                className="underline underline-offset-4 hover:underline"
              >
                916-952-9797
              </a>
              <br />
              <a
                href="mailto:TheUnderground411@gmail.com"
                className="break-all underline underline-offset-4 hover:underline"
              >
                TheUnderground411@gmail.com
              </a>
            </p>
          </div>

          <p className="mt-6 leading-relaxed">
            For Donations and Volunteer inquires please call or email.
            <br />
            Follow them on{" "}
            <a
              href="https://www.facebook.com/TheUnderground411"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:underline"
            >
              Facebook
            </a>
            .
          </p>

          <p className="mt-6 leading-relaxed">
            For more information please visit their website:{" "}
            <a
              href="https://citrusheightshart.org/programs/underground-clothing-connection"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all underline underline-offset-4 hover:underline"
            >
              https://citrusheightshart.org/programs/underground-clothing-connection
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
