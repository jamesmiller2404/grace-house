import Link from "next/link";
import {
  buildHeroTextShadow,
  type HeroCta,
  type HeroTextShadow,
} from "@/content/hero";

export type HeroProps = {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  body?: string;
  image?: string;
  showCard?: boolean;
  cardColor?: string;
  cardOpacity?: number;
  headingColor?: string;
  eyebrowColor?: string;
  subtextColor?: string;
  headingFontSize?: number;
  eyebrowFontSize?: number;
  subtextFontSize?: number;
  textShadow?: Partial<HeroTextShadow>;
  cardPositionX?: number;
  cardPositionY?: number;
  cardWidth?: number;
  cardHeight?: number;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
};

function hexToRgba(hex: string, opacityPercent: number): string {
  const clean = /^#[0-9a-fA-F]{6}$/.test(hex.trim()) ? hex.trim() : "#0f172a";
  const r = parseInt(clean.slice(1, 3), 16);
  const g = parseInt(clean.slice(3, 5), 16);
  const b = parseInt(clean.slice(5, 7), 16);
  const a = Math.max(0, Math.min(100, opacityPercent)) / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export default function Hero({
  eyebrow,
  heading,
  subtext,
  image = "/images/hero1a.jpg",
  showCard = true,
  cardColor = "#0f172a",
  cardOpacity = 55,
  headingColor = "#ffffff",
  eyebrowColor = "#c9a45c",
  subtextColor = "#f7f3eb",
  headingFontSize = 60,
  eyebrowFontSize = 19,
  subtextFontSize = 18,
  textShadow,
  cardPositionX = 50,
  cardPositionY = 5,
  cardWidth,
  cardHeight,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  const clampedX = Math.max(0, Math.min(100, cardPositionX));
  const clampedY = Math.max(0, Math.min(100, cardPositionY));
  const hasHeading = Boolean(heading?.trim());
  const hasEyebrow = Boolean(eyebrow?.trim());
  const hasSubtext = Boolean(subtext?.trim());
  const hasPrimary = Boolean(primaryCta?.label?.trim() && primaryCta?.href?.trim());
  const hasSecondary = Boolean(secondaryCta?.label?.trim() && secondaryCta?.href?.trim());
  const computedTextShadow = buildHeroTextShadow(textShadow);

  // Scale font sizes proportionally across phones, tablets, and desktop while
  // preserving the exact chosen px at desktop width (1280px+).
  const responsiveHeadingSize = `clamp(${Math.max(14, Math.round(headingFontSize * 0.28))}px, ${(headingFontSize / 12.8).toFixed(2)}vw, ${headingFontSize}px)`;
  const responsiveEyebrowSize = `clamp(${Math.max(9, Math.round(eyebrowFontSize * 0.42))}px, ${(eyebrowFontSize / 12.8).toFixed(2)}vw, ${eyebrowFontSize}px)`;
  const responsiveSubtextSize = `clamp(${Math.max(10, Math.round(subtextFontSize * 0.45))}px, ${(subtextFontSize / 12.8).toFixed(2)}vw, ${subtextFontSize}px)`;

  return (
    <section className="relative isolate overflow-hidden border-gold border-b-4 text-center">
      {/* Full-width natural-aspect-ratio image so there is never top/bottom cropping */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        className="block w-full h-auto select-none"
      />
      {/* Light scrim only — the mockup keeps the photo bright */}
      <div className="pointer-events-none absolute inset-0 bg-ink/10" />

      {/* Overlay positioning stage spanning the exact image bounds */}
      <div className="absolute inset-0 mx-auto max-w-7xl px-2 py-2 sm:px-6 sm:py-4">
        {showCard && (
          <div
            className="absolute flex flex-col items-center justify-center rounded-lg px-3 py-2.5 text-cream shadow-lg sm:rounded-xl sm:px-6 sm:py-4 md:px-10 md:py-8"
            style={{
              left: `${clampedX}%`,
              top: `${clampedY}%`,
              transform: `translate(-${clampedX}%, -${clampedY}%)`,
              backgroundColor: hexToRgba(cardColor, cardOpacity),
              width: cardWidth
                ? `min(${cardWidth}px, ${(cardWidth / 12.8).toFixed(2)}vw, calc(100% - 1rem))`
                : undefined,
              maxWidth: "calc(100% - 1rem)",
              minHeight: cardHeight
                ? `min(${cardHeight}px, ${(cardHeight / 12.8).toFixed(2)}vw)`
                : undefined,
            }}
          >
            {hasHeading && (
              <h1
                className="font-heading leading-tight"
                style={{
                  color: headingColor,
                  fontSize: responsiveHeadingSize,
                  textShadow: computedTextShadow,
                }}
              >
                {heading}
              </h1>
            )}
            {hasEyebrow && (
              <p
                className={`${hasHeading ? "mt-1.5 sm:mt-3 md:mt-4" : ""} leading-none font-bold tracking-[0.08em] uppercase`}
                style={{
                  color: eyebrowColor,
                  fontSize: responsiveEyebrowSize,
                  textShadow: computedTextShadow,
                }}
              >
                {eyebrow}
              </p>
            )}
            {hasSubtext && (
              <p
                className={`${hasHeading || hasEyebrow ? "mt-1.5 sm:mt-2.5 md:mt-3" : ""} leading-snug`}
                style={{
                  color: subtextColor,
                  fontSize: responsiveSubtextSize,
                  textShadow: computedTextShadow,
                }}
              >
                {subtext}
              </p>
            )}
            {(hasPrimary || hasSecondary) && (
              <div
                className={`${hasHeading || hasEyebrow || hasSubtext ? "mt-2 sm:mt-4 md:mt-6" : ""} flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4`}
              >
                {hasPrimary && primaryCta && (
                  <Link
                    href={primaryCta.href}
                    className="rounded-md px-3 py-1.5 text-xs font-bold transition-opacity hover:opacity-90 sm:rounded-lg sm:px-5 sm:py-2 sm:text-sm md:px-8 md:py-3 md:text-lg"
                    style={{
                      backgroundColor: primaryCta.bgColor || "#9e5640",
                      color: primaryCta.textColor || "#ffffff",
                    }}
                  >
                    {primaryCta.label}
                  </Link>
                )}
                {hasSecondary && secondaryCta && (
                  <Link
                    href={secondaryCta.href}
                    className="rounded-md px-3 py-1.5 text-xs font-bold transition-opacity hover:opacity-90 sm:rounded-lg sm:px-5 sm:py-2 sm:text-sm md:px-8 md:py-3 md:text-lg"
                    style={{
                      backgroundColor: secondaryCta.bgColor || "#ffffff",
                      color: secondaryCta.textColor || "#242725",
                    }}
                  >
                    {secondaryCta.label}
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
