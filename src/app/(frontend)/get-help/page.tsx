import Link from "next/link";
import HelpStrip from "@/sections/HelpStrip";
import { getHelpStrip } from "@/payload/queries";

export const metadata = {
  title: "Get Help Now — Grace House",
};

/**
 * Standalone "Get Help Now" page. It renders the same HelpStrip section as the
 * home page, from the shared content in the `get-help-now` collection (see
 * src/payload/queries.ts) — including the "Show assessment call-to-action"
 * toggle, so the assessment sentence/button/note show or hide here exactly as
 * they do on the home page and the two can never drift apart. The hero's
 * "Get Help" button links here whenever the editor hides the strip on the home
 * page (see src/app/(frontend)/page.tsx), so the call to action always works.
 */
export default async function GetHelpPage() {
  const helpStrip = await getHelpStrip();

  return (
    <main className="bg-cream flex-1">
      <div className="mx-auto max-w-6xl px-6 pt-10">
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
            <li aria-current="page">Get Help Now</li>
          </ol>
        </nav>
      </div>

      {/* The "Get Help Now" strip, same as the homepage */}
      <HelpStrip {...helpStrip} />
    </main>
  );
}
