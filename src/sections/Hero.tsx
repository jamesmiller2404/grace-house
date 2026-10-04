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
    <section className="relative isolate overflow-hidden bg-anchor text-center text-cream">
      {/* Drop your Photoshop export at public/images/hero.jpg (about 2400px wide) */}
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-anchor/80" />
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        {eyebrow && <p className="text-sm font-semibold tracking-[0.18em] text-gold">{eyebrow}</p>}
        <h1 className="mt-3 font-heading text-5xl leading-[1.05] md:text-7xl">{heading}</h1>
        {body && <p className="mx-auto mt-4 max-w-xl text-xl">{body}</p>}
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {primaryCta && (
              <Link href={primaryCta.href} className="rounded-md bg-terra px-6 py-3 font-semibold text-white">
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link href={secondaryCta.href} className="rounded-md border-2 border-cream px-6 py-3 font-semibold">
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
