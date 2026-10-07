import Image from "next/image";
import Link from "next/link";

export type FourPillarsProps = {
  eyebrow?: string;
  heading: string;
  /** Small gold tagline shown under the heading (e.g. "- THE WAY -"). */
  subtitle?: string;
  pillars: { title: string; text: string; image: string }[];
  cta?: { label: string; href: string };
};

export default function FourPillars({
  eyebrow,
  heading,
  subtitle,
  pillars,
  cta,
}: FourPillarsProps) {
  return (
    <section id="pillars" className="bg-anchor text-cream px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {eyebrow && (
          <p className="text-gold text-center text-[21px] font-semibold tracking-[0.2em]">
            {eyebrow}
          </p>
        )}
        <h2 className="font-heading mt-3 text-center text-4xl sm:text-5xl">
          {heading}
        </h2>
        {subtitle && (
          <p className="text-gold mt-3 text-center text-xl font-bold tracking-[0.25em]">
            {subtitle}
          </p>
        )}

        {/* Timeline: gold rule threaded through the numbered circles */}
        <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div
            aria-hidden
            className="bg-gold absolute top-6 right-[5%] left-[5%] hidden h-1 rounded lg:block"
          />
          {pillars.map((p, i) => {
            const last = i === pillars.length - 1;
            return (
              <li key={p.title} className="relative flex flex-col">
                <span
                  className={`border-anchor bg-gold font-heading text-anchor relative z-10 mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full border-4 text-lg ${
                    last
                      ? "ring-gold ring-offset-anchor ring-2 ring-offset-2"
                      : ""
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className={`flex flex-1 flex-col overflow-hidden rounded-xl border ${
                    last
                      ? "border-gold bg-gold text-ink"
                      : "border-gold/45 bg-white/10"
                  }`}
                >
                  <div className="bg-anchor/60 relative h-40 shrink-0">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(min-width:1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading text-center text-2xl">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed">{p.text}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        {cta && (
          <Link
            href={cta.href}
            className="text-gold hover:text-lift mt-10 block text-center text-xl font-semibold"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
