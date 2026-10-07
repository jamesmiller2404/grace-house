import Link from "next/link";

export type WelcomeProps = {
  heading: string;
  body: string;
  pullQuote?: string;
  cta?: { label: string; href: string };
};

export default function Welcome({ heading, body, pullQuote, cta }: WelcomeProps) {
  return (
    <section id="welcome" className="bg-cream px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h2 className="font-heading text-anchor text-5xl">{heading}</h2>
        <p className="mt-4 max-w-[60ch] text-lg leading-relaxed">
          {body}{" "}
          {pullQuote && <em className="text-anchor">{pullQuote}</em>}
        </p>
        {cta && (
          <Link
            href={cta.href}
            className="text-terra hover:text-lift mt-8 inline-flex items-center gap-2 text-xl font-semibold"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
