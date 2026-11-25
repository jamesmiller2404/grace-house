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

  // Scale font sizes gracefully on narrow screens while preserving exact px on desktop
  const responsiveHeadingSize = `clamp(${Math.max(18, Math.round(headingFontSize * 0.6))}px, ${(headingFontSize / 12.8).toFixed(2)}vw, ${headingFontSize}px)`;
  const responsiveEyebrowSize = `clamp(${Math.max(11, Math.round(eyebrowFontSize * 0.72))}px, ${(eyebrowFontSize / 12.8).toFixed(2)}vw, ${eyebrowFontSize}px)`;
  const responsiveSubtextSize = `clamp(${Math.max(12, Math.round(subtextFontSize * 0.78))}px, ${(subtextFontSize / 12.8).toFixed(2)}vw, ${subtextFontSize}px)`;

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
      <div className="absolute inset-0 mx-auto max-w-7xl px-6 py-4">
        {showCard && (
          <div
            className="absolute flex flex-col items-center justify-center rounded-xl px-6 py-6 text-cream shadow-lg md:px-10 md:py-8"
            style={{
              left: `${clampedX}%`,
              top: `${clampedY}%`,
              transform: `translate(-${clampedX}%, -${clampedY}%)`,
              backgroundColor: hexToRgba(cardColor, cardOpacity),
              width: cardWidth ? `min(${cardWidth}px, calc(100% - 2rem))` : undefined,
              maxWidth: "calc(100% - 2rem)",
              minHeight: cardHeight ? `${cardHeight}px` : undefined,
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
                className={`${hasHeading ? "mt-4" : ""} leading-none font-bold tracking-[0.08em] uppercase`}
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
                className={`${hasHeading || hasEyebrow ? "mt-3" : ""} leading-snug`}
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
                className={`${hasHeading || hasEyebrow || hasSubtext ? "mt-6" : ""} flex flex-wrap justify-center gap-4`}
              >
                {hasPrimary && primaryCta && (
                  <Link
                    href={primaryCta.href}
                    className="rounded-lg px-8 py-3 text-lg font-bold transition-opacity hover:opacity-90"
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
                    className="rounded-lg px-8 py-3 text-lg font-bold transition-opacity hover:opacity-90"
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
