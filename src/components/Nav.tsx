"use client";


import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";

export default function Nav() {
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  // Close the mobile menu when tapping/clicking outside of it.
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const menu = mobileMenuRef.current;
      if (menu?.open && !menu.contains(event.target as Node)) {
        menu.open = false;
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  // Close the mobile menu after a link inside it is tapped.
  function closeMobileMenu() {
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }
  }
  return (
    <header className="bg-anchor text-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:gap-6 sm:px-6 lg:gap-8 lg:py-[18px]">
        {/* Crown + wordmark */}
        <Link href="/" className="flex min-w-0 items-center gap-3 sm:gap-5 lg:gap-7">
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
            <span className="font-heading text-[clamp(1.5rem,6vw,3.75rem)] block leading-none font-normal tracking-[0.04em] text-white sm:whitespace-nowrap">
              {site.name}
            </span>
            <span className="text-gold mt-0.5 block font-sans text-[clamp(0.7rem,2.8vw,1.5rem)] leading-none font-medium tracking-wide uppercase sm:whitespace-nowrap">
              {site.tagline}
            </span>
          </span>
        </Link>

        {/* Right column: donate button above nav links */}
        <div className="flex shrink-0 flex-col items-end gap-2.5 sm:gap-3.5 lg:gap-5">
          <Link
            href="/support"
            style={{ borderRadius: "8px" }}
            className="bg-lift text-anchor hover:bg-gold shrink-0 px-2 py-0.5 text-center font-sans text-[11px] font-medium tracking-wider uppercase sm:px-3 sm:py-1 sm:text-[13px] lg:px-3.5 lg:py-1 lg:text-sm"
          >
            <span className="sm:hidden">Donate</span>
            <span className="hidden sm:inline">Donate to Grace House</span>
          </Link>

          <nav className="hidden items-center gap-0.5 text-[14px] lg:flex lg:gap-1 lg:text-[17px] mt-[24px]" aria-label="Main">
            {site.nav.map((l) =>
              l.children ? (
                <div
                  key={l.label}
                  className="group relative"
                >
                  <span
                    className="border-cream/25 text-cream/90 hover:text-lift flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1 font-sans font-medium whitespace-nowrap lg:px-4 lg:py-1.5"
                  >
                    {l.label}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 shrink-0 transition-transform group-hover:rotate-180"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div
                    className="invisible absolute left-0 top-full z-20 pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                  >
                    <div className="bg-anchor ring-cream/20 w-56 rounded-md p-2 shadow-lg ring-1">
                      {l.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="text-cream/90 hover:bg-cream/10 hover:text-lift block rounded-md px-3 py-2 font-sans text-base font-medium"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className="border-cream/25 text-cream/90 hover:text-lift rounded-md border px-3 py-1 font-sans font-medium whitespace-nowrap lg:px-4 lg:py-1.5"
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>

          {/* Mobile: links live in a menu that closes on link tap / outside tap */}
          <details ref={mobileMenuRef} className="relative lg:hidden">
            <summary className="border-cream/40 cursor-pointer list-none rounded-md border px-3 py-2 text-base">
              Menu
            </summary>
            <div className="bg-anchor ring-cream/20 absolute right-0 z-10 mt-2 w-44 rounded-md p-3 shadow-lg ring-1" onClick={closeMobileMenu}>
              {site.nav.map((l) => (
                <div key={l.label}>
                  {l.children ? (
                    <div className="py-2 font-medium">{l.label}</div>
                  ) : (
                    <Link href={l.href} className="block py-2">
                      {l.label}
                    </Link>
                  )}
                  {l.children?.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="text-cream/80 hover:text-lift block py-2 pl-4 text-base"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
      {/* Gold divider along the bottom edge of the header, mirroring the HelpStrip */}
      <div aria-hidden="true" className="border-gold border-b-4" />
    </header>
  );
}
