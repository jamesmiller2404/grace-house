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
            Grace House prides itself on giving back to our community. We are
            proud to take part in homeless feedings, winter sanctuary
            transportation, food for hungry families, veteran stand-downs, the
            adopt-a-grandparent project and giving back to our community
            whether that looks like doing yard work, helping them move,
            bringing them meals when needed.
          </p>
          <p className="text-ink/80 mt-4 max-w-[60ch] text-lg">
            You can find us feeding our unhoused friends at the Gathering Inn
            (Roseville location) every Tuesday at 11am (rain or shine).
          </p>
          <p className="text-ink/80 mt-4 max-w-[60ch] text-lg">
            We are also feeding at Royer Park in Roseville (190 Park Dr
            Roseville, CA 95678) on Sundays at 3PM. We would love to see you
            out there.
          </p>
          <p className="text-ink/80 mt-4 max-w-[60ch] text-lg">
            We are back with our new Tuesday feed from 3:00PM – 4:00PM at the
            Sylvan Oaks Library located at 6700 Auburn Blvd, Citrus Heights, CA
            95621.
          </p>

         
        </div>
      </main>
    </>
  );
}