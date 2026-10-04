import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export default function Nav() {
  return (
    <header className="bg-anchor text-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-10">
        {/* Crown + wordmark */}
        <Link href="/" className="flex shrink-0 items-center gap-7">
          <Image
            src="/images/crown.png"
            alt=""
            width={217}
            height={78}
            priority
            style={{ width: "auto" }}
            className="h-16 md:h-[78px]"
          />
          <span className="shrink-0">
            <span className="block whitespace-nowrap font-heading text-4xl font-normal tracking-[0.04em] text-white md:text-6xl">
              {site.name}
            </span>
            <span className="mt-1 block whitespace-nowrap font-sans text-sm font-medium uppercase text-gold md:text-2xl">
              {site.tagline}
            </span>
          </span>
        </Link>

        {/* Right column: donate button above nav links */}
        <div className="flex flex-col items-end gap-9">
          <Link
            href="/support"
            style={{ borderRadius: "12px" }}
            className="bg-lift px-5 py-2.5 font-sans text-base font-medium uppercase tracking-wider text-anchor hover:bg-gold"
          >
            Donate to Grace House
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {site.nav.map((l) => (
              <Link key={l.href} href={l.href} className="font-sans text-2xl font-medium text-cream/90 hover:text-lift">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Mobile: links live in a no-JS menu */}
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-md border border-cream/40 px-3 py-2 text-base">
              Menu
            </summary>
            <div className="absolute right-0 z-10 mt-2 w-44 rounded-md bg-anchor p-3 shadow-lg ring-1 ring-cream/20">
              {site.nav.map((l) => (
                <Link key={l.href} href={l.href} className="block py-2">
                  {l.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

