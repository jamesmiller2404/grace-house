import Link from "next/link";
import { getMissionPage } from "@/payload/queries";

export const metadata = {
  title: "Mission — Grace House",
};

/**
 * The Mission page, reading its Title and body text from the `mission-page`
 * collection in the database (managed in /admin/collections/mission-page).
 */
export default async function MissionPage() {
  const { title, body } = await getMissionPage();
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
              <li aria-current="page">{title}</li>
            </ol>
          </nav>

          {/* Mission */}
          <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
          <h1 className="font-heading text-ink text-5xl">{title}</h1>
          <p className="whitespace-pre-line mt-4 max-w-[60ch] text-lg leading-relaxed">
            {body}
          </p>
        </div>
      </main>
    </>
  );
}
