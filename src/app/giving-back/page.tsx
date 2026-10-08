import Link from "next/link";

export const metadata = {
  title: "Giving Back — Grace House",
  description:
    "Community outreach at Grace House — volunteer, partner, and give back to the community.",
};

/**
 * Community outreach / Giving Back page. Placeholder content — real
 * outreach details, opportunities, and partner info will be filled in later.
 */
export default function GivingBackPage() {
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
              <li aria-current="page">Giving Back</li>
            </ol>
          </nav>

          <div className="bg-gold mt-8 h-1 w-28 rounded-full" />
          <h1 className="font-heading text-anchor mt-4 text-5xl">
            Giving Back
          </h1>
          <p className="text-ink/80 mt-4 max-w-[60ch] text-lg">
            Placeholder subtitle — a short description of Grace House&apos;s
            community outreach work and how people can get involved.
          </p>

          <section className="mt-12">
            <h2 className="font-heading text-anchor text-3xl italic">
              Our Community Outreach
            </h2>
            <p className="text-ink/80 mt-4 max-w-[60ch] text-lg">
              Placeholder paragraph — describe the outreach programs Grace
              House runs in the community, who they serve, and the impact they
              have.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="font-heading text-anchor text-3xl italic">
              Volunteer Opportunities
            </h2>
            <p className="text-ink/80 mt-4 max-w-[60ch] text-lg">
              Placeholder paragraph — list current volunteer opportunities,
              what volunteers do, and how to sign up.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="font-heading text-anchor text-3xl italic">
              Partners &amp; Donations
            </h2>
            <p className="text-ink/80 mt-4 max-w-[60ch] text-lg">
              Placeholder paragraph — thank and list community partners, and
              explain ways businesses and individuals can donate or sponsor
              Grace House&apos;s outreach work.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}