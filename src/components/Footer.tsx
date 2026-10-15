"use client";

import { useState } from "react";
import Image from "next/image";
import { site } from "@/content/site";

/**
 * Site footer, based on photoshop_assets/footer-section.png.
 * Deliberately breaks from the cream/anchor theme: near-black navy (#040d1d).
 */

/**
 * The contact details shown in the "Get Help" column. The site layout passes
 * the values from the footer admin panel (/admin/globals/footer), which picks
 * them from the Contact Info panel; the phone and email fall back to the
 * static defaults in src/content/site.ts so the footer never breaks, even
 * before the panel is filled in. The address has no static default — the
 * footer simply shows no address line until one is picked/registered.
 */
export type FooterProps = {
  /** Display phone number, e.g. "(916) 470-0408". */
  phone?: string;
  /** The tel: link behind the phone number, derived from it. */
  phoneHref?: string;
  /** The email address shown (its mailto: link is derived from it). */
  email?: string;
  /** The street address shown below the office hours. */
  address?: string;
};

export default function Footer({
  phone = site.phone,
  phoneHref = site.phoneHref,
  email = site.email,
  address,
}: FooterProps = {}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="View full-size photo of Pastor Lonnie"
            title="View full-size photo"
            className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <Image
              src="/images/pastorLonnie2a.jpg"
              alt="Pastor Lonnie"
              width={1086}
              height={1086}
              className="h-auto w-full max-w-[320px] rounded-lg shadow-lg transition-transform duration-200 hover:scale-[1.03]"
            />
          </button>
          <p className="font-memorial mt-5 text-center leading-snug text-white">
            <span className="block text-2xl font-medium tracking-[0.14em]">
              Lonnie W. Nix
            </span>
            <span className="mt-1 block text-lg italic tracking-[0.28em] text-white/90">
              1956&ndash;2021
            </span>
          </p>
        </div>

        {/* Column 3: Get help */}
        <div className="lg:text-right">
          <h2 className="text-lift text-sm font-semibold tracking-widest uppercase">
            Get Help
          </h2>
          <a
            href={phoneHref}
            className="text-gold mt-4 block text-2xl font-semibold"
          >
            {phone}
          </a>
          <a
            href={`mailto:${email}`}
            className="text-gold mt-2 block break-all text-lg font-semibold hover:underline"
          >
            {email}
          </a>
          <p className="mt-2 text-cream/85 leading-relaxed">
            Mon–Fri, 9am–5pm
            <br />
            Intakes on weekdays only
          </p>
          {address && (
            <p className="text-cream/85 mt-2 leading-relaxed">{address}</p>
          )}
        </div>
      </div>

      {/* Photo lightbox overlay */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Full-size photo of Pastor Lonnie"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close photo"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border-cream/30 bg-cream/10 text-2xl leading-none text-cream transition-colors hover:bg-cream/20 focus-visible:outline-2 focus-visible:outline-gold"
          >
            &times;
          </button>
          <Image
            src="/images/pastorLonnie2a.jpg"
            alt="Pastor Lonnie"
            width={1086}
            height={1086}
            className="max-h-[85vh] w-auto max-w-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}


      {/* Legal row */}
      <div className="border-cream/10 border-t">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-sm text-cream/70 sm:px-6">
          <p>© 2026 {site.name}</p>
          <p>
            <a
              href="/privacy"
              className="hover:text-lift transition-colors"
            >
              Privacy
            </a>
            <span className="mx-2">·</span>
            <a
              href="/accessibility"
              className="hover:text-lift transition-colors"
            >
              Accessibility
            </a>
          </p>
          {/* Site credit: Offworld Creations brand logo, linking to the
           * studio's site. Rendered at 44x26 (from the 200x119 source) so it
           * fits the slim legal row without dominating it, at 50% opacity to
           * keep it subtle. */}
          <a
            href="https://offworldcreations.carrd.co"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Site by Offworld Creations"
            title="Site by Offworld Creations"
            className="flex flex-col items-center opacity-50 transition-opacity"
          >
            <Image
              src="/images/offworldcreations_logo_transparent2.png"
              alt="Offworld Creations logo"
              width={44}
              height={26}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
