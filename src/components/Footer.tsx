"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

/**
 * Site footer, based on photoshop_assets/footer-section.png.
 * Deliberately breaks from the cream/anchor theme: near-black navy (#040d1d).
 */
export default function Footer() {
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
            href={site.phoneHref}
            className="text-gold mt-4 block text-2xl font-semibold"
          >
            {site.phone}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="text-gold mt-2 block break-all text-lg font-semibold hover:underline"
          >
            {site.email}
          </a>
          <p className="mt-2 text-cream/85 leading-relaxed">
            Mon–Fri, 9am–5pm
            <br />
            Intakes on weekdays only
          </p>
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
          {/*
           * Discrete staff entrance to the Payload admin (/admin/login is the
           * login screen). Kept muted so it doesn't read as public navigation.
           * prefetch={false} keeps the admin bundle out of every public page
           * load; it still navigates client-side once clicked.
           */}
          <Link
            href="/admin/login"
            prefetch={false}
            aria-label="Admin login"
            title="Admin login"
            className="text-cream/40 hover:text-lift inline-flex items-center gap-1.5 text-xs transition-colors"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                clipRule="evenodd"
              />
            </svg>
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
