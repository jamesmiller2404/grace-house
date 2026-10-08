import Link from "next/link";

export const metadata = {
  title: "Board Members — Grace House",
};

export default function BoardPage() {
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
            <li aria-current="page">Board Members</li>
          </ol>
        </nav>

        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h1 className="font-heading text-ink text-5xl">Board Members</h1>
        <p className="text-ink/70 mt-4 max-w-[60ch] leading-relaxed">
          Placeholder page — meet the Grace House Board of Directors, coming
          soon.
        </p>
      </div>
    </main>
  );
}
