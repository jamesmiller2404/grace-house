import Link from "next/link";
import { site } from "@/content/site";

/**
 * Site footer, based on photoshop_assets/footer-section.png.
 * Deliberately breaks from the cream/anchor theme: near-black navy (#040d1d).
 */
export default function Footer() {
  return (
    <footer className="bg-[#040d1d] text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Column 1: wordmark + mission blurb */}
        <div>
          <p className="font-heading text-3xl tracking-[0.04em] text-white">
            {site.name}
          </p>
          <p className="text-gold mt-1 text-sm font-medium tracking-wide uppercase">
            {site.tagline}
          </p>
          <p className="mt-5 max-w-xs text-cream/85 leading-relaxed">
            To see families restored and give hope to the hopeless.
          </p>
        </div>

        {/* Column 2: Get help */}
        <div>
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
            No weekend intakes
          </p>
          <Link
            href="/support"
            style={{ borderRadius: "12px" }}
            className="bg-terra hover:bg-[#b06850] mt-6 inline-block px-5 py-3 font-sans text-sm font-semibold text-white transition-colors"
          >
            Start intake
          </Link>
        </div>

        {/* Column 3: Explore */}
        <div>
          <h2 className="text-lift text-sm font-semibold tracking-widest uppercase">
            Explore
          </h2>
          <ul className="mt-4 space-y-2.5">
            {[
              { label: "About", href: "/about" },
              { label: "Program", href: "/about/mission" },
              { label: "Stories", href: "/stories" },
              { label: "Events", href: "/#events" },
              { label: "Support", href: "/support" },
              { label: "Get Help", href: "/#get-help" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-cream/85 hover:text-lift transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Our homes */}
        <div>
          <h2 className="text-lift text-sm font-semibold tracking-widest uppercase">
            Our Homes
          </h2>
          <ul className="mt-4 space-y-2.5 text-cream/85">
            <li>Men&rsquo;s house</li>
            <li>Women&rsquo;s house</li>
            <li>Men&rsquo;s transitional home</li>
            <li>Sacramento, CA</li>
          </ul>
        </div>
      </div>

      {/* Crisis strip */}
      <div className="border-cream/10 border-t">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2 px-4 py-5 sm:px-6">
          <p className="text-gold text-sm font-semibold tracking-widest uppercase">
            In crisis? Support is available any time
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {site.crisisLines.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="text-cream hover:text-lift text-base font-semibold transition-colors"
                >
                  {c.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Legal row */}
      <div className="border-cream/10 border-t">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-sm text-cream/70 sm:px-6">
          <p>© 2026 {site.name}. Not a detox center.</p>
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
