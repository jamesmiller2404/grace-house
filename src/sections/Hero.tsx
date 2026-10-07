import Image from "next/image";
import Link from "next/link";

export type HeroProps = {
  eyebrow?: string;
  heading: string;
  body?: string;
  image?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export default function Hero({
  eyebrow,
  heading,
  body,
  image = "/images/hero.jpg",
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden text-center">
      {/* Drop your Photoshop export at public/images/hero.jpg (about 2400px wide) */}
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Light scrim only — the mockup keeps the photo bright */}
      <div className="absolute inset-0 -z-10 bg-ink/10" />

      {/* Dark translucent card holding the copy, anchored toward the top */}
      <div className="mx-auto flex min-h-[42rem] max-w-7xl items-start justify-center px-6 pt-10 pb-24 md:min-h-[52rem] md:pt-14">
        <div className="bg-slate-900/55 rounded-xl px-6 py-8 text-cream shadow-lg md:px-14 md:py-10">
          <h1 className="font-heading text-5xl text-white md:text-8xl">
            {heading}
          </h1>
          {eyebrow && (
            <p className="text-gold mt-4 text-base font-bold tracking-[0.08em] uppercase">
              {eyebrow}
            </p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="bg-terra hover:bg-terra/90 rounded-lg px-10 py-3.5 text-xl font-bold text-white"
                >
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="bg-white text-ink hover:bg-cream rounded-lg px-10 py-3.5 text-xl font-bold"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
