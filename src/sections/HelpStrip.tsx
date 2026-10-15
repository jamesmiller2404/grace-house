import Link from "next/link";

export type HelpStripProps = {
  heading: string;
  body: string;
  /**
   * The assessment sentence ("Or you can fill out the assessment below...")
   * shown right after the body while the assessment call-to-action is on.
   */
  assessmentNote?: string;
  phone: string;
  phoneHref: string;
  /**
   * The assessment button. Optional — when the admin panel's "Show assessment
   * call-to-action" checkbox is unticked the button (and its note) are omitted
   * and the strip renders without them.
   */
  cta?: { label: string; href: string };
  ctaNote?: string;
  /** Office hours shown under the phone number (e.g. "Mon–Fri, 9am–5pm"). */
  hours: string;
  facts: string[];
  crisisTitle?: string;
  crisisLines: { label: string; text: string; href: string }[];
};

export default function HelpStrip({
  heading,
  body,
  assessmentNote,
  phone,
  phoneHref,
  cta,
  ctaNote,
  hours,
  facts,
  crisisTitle,
  crisisLines,
}: HelpStripProps) {
  return (
    <section
      id="help"
      aria-labelledby="help-title"
      className="bg-sand text-ink"
    >
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-8 md:grid-cols-[3fr_2fr] md:gap-12">
          <div>
            <h2
              id="help-title"
              className="font-heading text-ink text-3xl font-bold md:text-4xl"
            >
              {heading}
            </h2>
            <p className="mt-2 text-lg">
              {body}
              {assessmentNote && ` ${assessmentNote}`}
            </p>

            {cta && (
              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-4 max-lg:w-fit max-lg:flex-col max-lg:gap-0">
                  <Link
                    href={cta.href}
                    className="bg-terra hover:bg-terra/90 rounded-md px-4 py-2 text-lg font-bold text-white transition-colors"
                  >
                    {cta.label}
                  </Link>
                  {ctaNote && (
                    <span className="text-base font-bold max-lg:hidden">← {ctaNote}</span>
                  )}
                  {ctaNote && (
                    <div className="mt-2 lg:hidden">
                      <span
                        aria-hidden="true"
                        className="block text-center text-base font-bold leading-none"
                      >
                        ↑
                      </span>
                      <span className="text-base font-bold">{ctaNote}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <p className="mt-5 text-2xl font-bold">
              or call{" "}
              <a href={phoneHref} className="whitespace-nowrap hover:underline">
                {phone}
              </a>
            </p>

            <p className="mt-2 text-xl font-semibold">
              Office hours: {hours}
            </p>
          </div>

          <ul className="space-y-3 text-base md:pt-1">
            {facts.map((f) => (
              <li
                key={f}
                className="before:text-terra flex gap-2 before:font-bold before:content-['✓']"
              >
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          {crisisTitle && (
            <p className="text-ink text-center text-xl font-bold tracking-[0.06em] uppercase">
              {crisisTitle}
            </p>
          )}
          <div className="border-anchor/30 mt-3 border-t pt-3">
            <ul className="grid gap-4 sm:grid-cols-3">
              {crisisLines.map((c) => (
                <li key={c.label}>
                  <span className="text-terra block text-sm font-bold tracking-[0.05em] uppercase">
                    {c.label}
                  </span>
                  <a href={c.href} className="text-ink font-bold underline">
                    {c.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-anchor/30 mt-4 border-t" />
        </div>
      </div>
    </section>
  );
}
