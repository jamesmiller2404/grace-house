import Image from "next/image";
import { site } from "@/content/site";

/**
 * Site footer, based on photoshop_assets/footer-section.png.
 * Deliberately breaks from the cream/anchor theme: near-black navy (#040d1d).
 */
export default function Footer() {
  return (
    <footer className="bg-[#040d1d] text-cream">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-14 text-center sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:text-left">
        {/* Column 1: wordmark + mission blurb */}
        <div className="lg:max-w-sm">
          <p className="font-heading text-3xl tracking-[0.04em] text-white">
            {site.name}
          </p>
          <p className="text-gold mt-1 text-sm font-medium tracking-wide uppercase">
            {site.tagline}
          </p>
          <p className="mt-5 max-w-xs text-cream/85 italic leading-relaxed mx-auto lg:mx-0">
            To see families restored and give hope to the hopeless.
          </p>
        </div>

        {/* Column 2: pastor photo + memorial dedication */}
        <div className="flex w-full max-w-xs flex-col items-center lg:w-auto">
          <a
            href="/images/pastorLonnie2a.jpg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View full-size photo of Pastor Lonnie"
            title="View full-size photo"
            className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <Image
              src="/images/pastorLonnie2a.jpg"
              alt="Pastor Lonnie"
              width={1086}
              height={1086}
              className="h-auto w-full max-w-[240px] rounded-lg shadow-lg transition-transform duration-200 hover:scale-[1.03]"
            />
          </a>
          <p className="font-memorial mt-5 text-center leading-snug text-white">
            <span className="block text-2xl font-medium tracking-[0.14em]">
              Lonnie Wes Nix
            </span>
            <span className="mt-2 block text-lg italic tracking-[0.28em] text-white/90">
              1956&nbsp;&ndash;&nbsp;2021
            </span>
          </p>
        </div>

        {/* Column 3: Get help */}
        <div className="lg:text-right">
          <h2 className="text-lift text-sm font-semibold tracking-widest uppercase">
            Get Help
          </h2>
          <a
            href={site.phoneHref}
            className="text-gold mt-4 block text-2xl font-semibold"
          >
            {site.phone}
          </a>
          <p className="mt-2 text-cream/85 leading-relaxed">
            Mon–Fri, 9am–5pm
            <br />
            Intakes on weekdays only
          </p>
        </div>
      </div>

      {/* Legal row */}
      <div className="border-cream/10 border-t">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-sm text-cream/70 sm:px-6">
          <p>© 2026 {site.name}</p>
          <p>
            <a href="#" className="hover:text-lift transition-colors">
              Privacy
            </a>
            <span className="mx-2">·</span>
            <a href="#" className="hover:text-lift transition-colors">
              Accessibility
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
