import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export default function Nav() {
  return (
    <header className="bg-anchor text-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:gap-6 sm:px-6 md:gap-8 md:py-10">
        {/* Crown + wordmark */}
        <Link href="/" className="flex min-w-0 items-center gap-3 sm:gap-5 md:gap-7">
          <Image
            src="/images/crown.png"
            alt=""
            width={217}
            height={78}
            priority
            style={{ width: "auto" }}
            className="h-8 shrink-0 sm:h-12 md:h-[78px]"
          />
          <span className="min-w-0">
            <span className="font-heading block truncate text-2xl font-normal tracking-[0.04em] whitespace-nowrap text-white sm:text-3xl md:text-4xl lg:text-6xl">
              {site.name}
            </span>
            <span className="text-gold mt-0.5 block font-sans text-xs font-medium tracking-wide whitespace-nowrap uppercase sm:text-sm md:text-base lg:text-2xl">
              {site.tagline}
            </span>
          </span>
        </Link>

        {/* Right column: donate button above nav links */}
        <div className="flex shrink-0 flex-col items-end gap-4 sm:gap-6 md:gap-9">
          <Link
            href="/support"
            style={{ borderRadius: "12px" }}
            className="bg-lift text-anchor hover:bg-gold px-3 py-1.5 font-sans text-xs font-medium tracking-wider whitespace-nowrap uppercase sm:px-4 sm:py-2 sm:text-sm md:px-5 md:py-2.5 md:text-base"
          >
            Donate to Grace House
          </Link>

          <nav className="hidden items-center gap-6 text-xl md:flex lg:gap-8 lg:text-2xl" aria-label="Main">
            {site.nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-cream/90 hover:text-lift font-sans font-medium whitespace-nowrap"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Mobile: links live in a no-JS menu */}
          <details className="relative md:hidden">
            <summary className="border-cream/40 cursor-pointer list-none rounded-md border px-3 py-2 text-base">
              Menu
            </summary>
            <div className="bg-anchor ring-cream/20 absolute right-0 z-10 mt-2 w-44 rounded-md p-3 shadow-lg ring-1">
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
