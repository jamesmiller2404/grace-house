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
    <section className="bg-anchor text-cream relative isolate overflow-hidden text-center">
      {/* Drop your Photoshop export at public/images/hero.jpg (about 2400px wide) */}
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="bg-anchor/80 absolute inset-0 -z-10" />
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        {eyebrow && (
          <p className="text-gold text-sm font-semibold tracking-[0.18em]">
            {eyebrow}
          </p>
        )}
        <h1 className="font-heading mt-3 text-5xl leading-[1.05] md:text-7xl">
          {heading}
        </h1>
        {body && <p className="mx-auto mt-4 max-w-xl text-xl">{body}</p>}
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="bg-terra rounded-md px-6 py-3 font-semibold text-white"
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="border-cream rounded-md border-2 px-6 py-3 font-semibold"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
