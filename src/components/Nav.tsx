"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { site } from "@/content/site";
import type { CustomNavLink } from "@/content/customPages";
import {
  headerTopBarDefaults,
  type HeaderIconName,
  type HeaderTopBarContent,
} from "@/content/header";

function hasLexicalText(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const node = value as { text?: unknown; children?: unknown[]; root?: unknown };
  if (typeof node.text === "string" && node.text.trim().length > 0) return true;
  if (node.root) return hasLexicalText(node.root);
  if (Array.isArray(node.children)) {
    return node.children.some((child) => hasLexicalText(child));
  }
  return false;
}

function TopBarIconSvg({ name }: { name: HeaderIconName }) {
  const props = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true as const,
  };
  switch (name) {
    case "facebook":
      return (
        <svg {...props}>
          <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.6c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.5v3.2h2.7V22h3.3z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...props}>
          <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8zm4.2 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.3-2.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...props}>
          <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9c.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8zM10 15.2V8.8l5.2 3.2-5.2 3.2z" />
        </svg>
      );
    case "x":
      return (
        <svg {...props}>
          <path d="M18.2 2h3.1l-6.8 7.8L22.5 22h-6.3l-4.9-6.4L5.7 22H2.6l7.3-8.3L2 2h6.4l4.4 5.9L18.2 2zm-1.1 18h1.7L7.4 3.9H5.6L17.1 20z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...props}>
          <path d="M4.98 3.5a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4zM3 9h4v12H3V9zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4.1 0 4.8 2.7 4.8 6.1V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4V9z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...props}>
          <path d="M16.6 5.8A4.8 4.8 0 0 1 15 2.5h-3v13.1a2.6 2.6 0 1 1-1.9-2.5V10a5.7 5.7 0 1 0 4.9 5.6V9.2a7.8 7.8 0 0 0 4.5 1.4V7.6a4.8 4.8 0 0 1-2.9-1.8z" />
        </svg>
      );
    case "phone":
      return (
        <svg {...props}>
          <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2c1.1.4 2.3.6 3.6.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.4a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.2 1l-2.2 2.2z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...props}>
          <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 2v.4l8 5 8-5V7H4zm16 10V9.7l-7.5 4.7a1 1 0 0 1-1 0L4 9.7V17h16z" />
        </svg>
      );
    case "location":
      return (
        <svg {...props}>
          <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...props}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.4 3.7 2.2-1 1.7-4.7-2.8V7h2v5.4z" />
        </svg>
      );
    case "heart":
      return (
        <svg {...props}>
          <path d="M12 21.3 10.6 20C5.4 15.4 2 12.3 2 8.5A5.4 5.4 0 0 1 7.5 3c1.7 0 3.4.8 4.5 2.1A6 6 0 0 1 16.5 3 5.4 5.4 0 0 1 22 8.5c0 3.8-3.4 6.9-8.6 11.5L12 21.3z" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      );
  }
}

/**
 * The header nav. Renders the optional Top Bar (managed in /admin/globals/header)
 * above the main aubergine navigation bar. When the Top Bar is toggled off, the
 * bar is removed and the main header adjusts its spacing/height cleanly.
 */
export default function Nav({
  customLinks = [],
  topBar = headerTopBarDefaults,
}: {
  customLinks?: CustomNavLink[];
  topBar?: HeaderTopBarContent;
}) {
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const topBarContainerRef = useRef<HTMLDivElement>(null);
  const leftMeasureRef = useRef<HTMLDivElement>(null);
  const centerMeasureRef = useRef<HTMLDivElement>(null);
  const rightMeasureRef = useRef<HTMLDivElement>(null);
  const [topBarWrapped, setTopBarWrapped] = useState(false);

  const nav = [
    ...site.nav,
    ...(customLinks.length > 0
      ? [
          {
            label: "More",
            children: customLinks.map((link) => ({
              label: link.label,
              href: link.href,
            })),
          },
        ]
      : []),
  ];

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

  function closeMobileMenu() {
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }
  }

  const showTopBar = topBar.enabled !== false;
  const hasRichText = hasLexicalText(topBar.content);
  const hasPhone = Boolean(topBar.phone?.trim());
  const hasIcons = topBar.icons.length > 0;
  const hasButtons = topBar.buttons.length > 0;

  // Dynamically detect the exact pixel width where the top bar's text, phone,
  // and buttons no longer fit on a single row, and switch to a centered layout.
  useEffect(() => {
    if (!showTopBar) return;
    const container = topBarContainerRef.current;
    if (!container) return;

    const checkWrap = () => {
      const style = window.getComputedStyle(container);
      const padX =
        parseFloat(style.paddingLeft || "0") +
        parseFloat(style.paddingRight || "0");
      const available = container.clientWidth - padX;
      const leftW = leftMeasureRef.current?.scrollWidth ?? 0;
      const centerW = centerMeasureRef.current?.scrollWidth ?? 0;
      const rightW = rightMeasureRef.current?.scrollWidth ?? 0;
      const needed = hasPhone
        ? Math.max(leftW, rightW) * 2 + centerW + 48
        : leftW + rightW + 32;
      setTopBarWrapped(needed > available);
    };

    checkWrap();
    const ro = new ResizeObserver(checkWrap);
    ro.observe(container);
    return () => ro.disconnect();
  }, [
    showTopBar,
    hasPhone,
    hasRichText,
    hasIcons,
    hasButtons,
    topBar.phone,
    topBar.buttons.length,
    topBar.icons.length,
  ]);

  return (
    <header className="bg-anchor text-cream">
      {/* Optional Top Utility Bar */}
      {showTopBar && (
        <div
          style={{
            backgroundColor: topBar.backgroundColor || "#624e92",
            color: topBar.textColor || "#110d17",
          }}
        >
          <div
            ref={topBarContainerRef}
            className={`mx-auto max-w-7xl px-4 py-2 sm:px-6 ${
              topBarWrapped
                ? "flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
                : hasPhone
                  ? "grid grid-cols-[1fr_auto_1fr] items-center gap-x-4"
                  : "flex items-center justify-between gap-x-4"
            }`}
          >
            {/* Left: optional rich text + icons (stays on line 1 with phone when wrapped) */}
            <div className="flex min-w-0 items-center justify-start">
              <div
                ref={leftMeasureRef}
                className="flex w-fit flex-wrap items-center gap-x-4 gap-y-1"
              >
                {hasRichText && (
                  <div className="gh-topbar-text text-[clamp(1rem,1.75vw,1.625rem)] leading-none tracking-[-0.01em] [&_a]:underline [&_a]:underline-offset-4 [&_p]:m-0">
                    <RichText data={topBar.content as never} />
                  </div>
                )}
                {hasIcons && (
                  <div className="flex shrink-0 items-center gap-2.5">
                    {topBar.icons.map((item, idx) => (
                      <a
                        key={`${item.icon}-${idx}`}
                        href={item.href}
                        aria-label={item.label}
                        title={item.label}
                        {...(item.openInNewTab
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="inline-flex items-center justify-center rounded-full p-1 opacity-90 transition hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <TopBarIconSvg name={item.icon} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Center: optional phone number (stays on line 1 with text when wrapped) */}
            {hasPhone && topBar.phone && (
              <div className="flex items-center justify-center">
                <div ref={centerMeasureRef} className="w-fit">
                  <a
                    href={(() => {
                      const digits = topBar.phone.replace(/[^\d+]/g, "");
                      return digits.length === 10 && !digits.startsWith("+")
                        ? `tel:+1${digits}`
                        : `tel:${digits}`;
                    })()}
                    className="gh-topbar-text whitespace-nowrap text-[clamp(1rem,1.75vw,1.625rem)] leading-none tracking-[-0.01em] hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {topBar.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Right: action buttons (drops to line 2 centered when wrapped) */}
            {hasButtons && (
              <div
                className={`flex items-center ${
                  topBarWrapped ? "basis-full justify-center" : "justify-end"
                }`}
              >
                <div
                  ref={rightMeasureRef}
                  className={`flex w-fit flex-wrap items-center gap-2 sm:gap-3 ${
                    topBarWrapped ? "justify-center" : "flex-nowrap"
                  }`}
                >
                  {topBar.buttons.map((btn, idx) => {
                    const isExternal =
                      btn.openInNewTab || /^https?:\/\//i.test(btn.href);
                    const classes =
                      "inline-flex shrink-0 items-center justify-center rounded-lg px-3.5 py-1 text-center font-sans text-[11px] font-semibold tracking-wider uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5 sm:py-1.5 sm:text-xs";
                    const style = {
                      backgroundColor: btn.bgColor || "#9e5640",
                      color: btn.textColor || "#ffffff",
                    };
                    return isExternal ? (
                      <a
                        key={`${btn.label}-${idx}`}
                        href={btn.href}
                        target={btn.openInNewTab ? "_blank" : undefined}
                        rel={btn.openInNewTab ? "noopener noreferrer" : undefined}
                        style={style}
                        className={classes}
                      >
                        {btn.label}
                      </a>
                    ) : (
                      <Link
                        key={`${btn.label}-${idx}`}
                        href={btn.href}
                        style={style}
                        className={classes}
                      >
                        {btn.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Header Strip — automatically adjusts height & alignment when Top Bar is off */}
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6 lg:gap-8 ${
          showTopBar ? "py-2.5 lg:py-4" : "py-2 lg:py-[18px]"
        }`}
      >
        {/* Crown + wordmark */}
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-3 sm:gap-4 xl:gap-5"
        >
          <Image
            src="/images/crown.png"
            alt=""
            width={217}
            height={78}
            priority
            style={{ width: "auto" }}
            className="h-8 shrink-0 sm:h-11 md:h-12 xl:h-14 2xl:h-[72px]"
          />
          <span className="min-w-0">
            <span className="font-heading text-[clamp(1.5rem,3vw,3.25rem)] block leading-none font-normal tracking-[0.04em] text-white sm:whitespace-nowrap">
              {site.name}
            </span>
            <span className="text-gold mt-0.5 block font-sans text-[clamp(0.7rem,1.25vw,1.35rem)] leading-none font-medium tracking-wide uppercase sm:whitespace-nowrap">
              {site.tagline}
            </span>
          </span>
        </Link>

        {/* Right column: when Top Bar is off, restore Donate button above nav links */}
        <div
          className={`flex shrink-0 flex-col items-end ${
            showTopBar ? "justify-center" : "gap-2.5 sm:gap-3.5 lg:gap-5"
          }`}
        >
          {!showTopBar && (
            <Link
              href="/support"
              style={{ borderRadius: "8px" }}
              className="bg-lift text-anchor hover:bg-gold inline-flex shrink-0 items-center justify-center px-3 py-0.5 text-center font-sans text-[11px] font-medium tracking-wider uppercase sm:px-4 sm:py-1 sm:text-[13px] lg:px-5 lg:py-1 lg:text-sm"
            >
              <span className="translate-y-px">Donate</span>
            </Link>
          )}

          <nav
            className={`hidden items-center gap-1 text-[13px] lg:flex xl:text-[15px] 2xl:text-[16px] ${
              showTopBar ? "mt-0" : "mt-[24px]"
            }`}
            aria-label="Main"
          >
            {nav.map((l) =>
              l.children ? (
                <div key={l.label} className="group relative">
                  <button
                    type="button"
                    className="border-cream/25 text-cream/90 hover:text-lift flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 font-sans font-medium whitespace-nowrap focus-visible:outline-lift focus-visible:outline-2 focus-visible:outline-offset-2 xl:gap-1.5 xl:px-3 xl:py-1.5"
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
                  </button>
                  <div className="invisible absolute left-0 top-full z-20 pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
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
                  className="border-cream/25 text-cream/90 hover:text-lift rounded-md border px-2 py-1 font-sans font-medium whitespace-nowrap xl:px-3 xl:py-1.5"
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
            <div className="bg-anchor ring-cream/20 absolute right-0 z-20 mt-2 w-60 rounded-md p-2 shadow-lg ring-1">
              {nav.map((l) => (
                <div key={l.label}>
                  {l.children ? (
                    <>
                      <p className="text-gold px-3 pt-2 pb-1 text-xs font-bold tracking-wider uppercase">
                        {l.label}
                      </p>
                      {l.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={closeMobileMenu}
                          className="text-cream/90 hover:bg-cream/10 block rounded-md px-3 py-2 text-base"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={l.href}
                      onClick={closeMobileMenu}
                      className="text-cream/90 hover:bg-cream/10 block rounded-md px-3 py-2 text-base"
                    >
                      {l.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>

      {/* 2px gold divider with a 1px dark hairline beneath so it stays crisp on light pages */}
      <div
        aria-hidden="true"
        className="bg-gold border-anchor/35 h-[3px] border-b"
      />
    </header>
  );
}
