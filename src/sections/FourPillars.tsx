import Image from "next/image";
import Link from "next/link";

export type FourPillarsProps = {
  eyebrow?: string;
  heading: string;
  intro?: string;
  pillars: { title: string; text: string; image: string }[];
  cta?: { label: string; href: string };
};

export default function FourPillars({ eyebrow, heading, intro, pillars, cta }: FourPillarsProps) {
  return (
    <section className="bg-anchor px-6 py-14 text-cream">
      <div className="mx-auto max-w-6xl">
        {eyebrow && (
          <p className="text-center text-sm font-semibold tracking-[0.16em] text-gold">{eyebrow}</p>
        )}
        <h2 className="mt-2 text-center font-heading text-4xl">{heading}</h2>
        {intro && <p className="mx-auto mt-2 max-w-xl text-center">{intro}</p>}

        <ol className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div aria-hidden className="absolute left-[6%] right-[6%] top-5 hidden h-0.5 bg-gold/70 lg:block" />
          {pillars.map((p, i) => {
            const last = i === pillars.length - 1;
            return (
              <li key={p.title} className="relative flex flex-col">
                <span className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-gold font-heading text-anchor">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className={`flex-1 overflow-hidden rounded-xl border ${
                    last ? "border-gold bg-gold text-anchor" : "border-gold/45 bg-white/10"
                  }`}
                >
                  <div className="relative h-32 bg-anchor/60">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(min-width:1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-xl">{p.title}</h3>
                    <p className="mt-1 text-base">{p.text}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        {cta && (
          <Link href={cta.href} className="mt-8 block text-center font-semibold text-gold">
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
