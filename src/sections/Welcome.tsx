import Link from "next/link";
import {
  introBgClass,
  introDefaults,
  introHoverTextClass,
  introTextClass,
  type IntroColor,
} from "@/content/intro";

export type WelcomeProps = {
  heading: string;
  body: string;
  /** Italic tail of the body sentence (e.g. "to see families restored..."). */
  pullQuote?: string;
  /** The link below the paragraph: its text and where it points. */
  linkLabel?: string;
  linkHref?: string;
  /**
   * Design-token names for the section's colors (see src/content/intro.ts).
   * Unknown or missing values fall back to the section defaults.
   */
  bgColor?: string;
  textColor?: string;
  linkColor?: string;
  linkHoverColor?: string;
};

/** Look up a token's Tailwind class, falling back to the section default. */
function classFor(
  map: Record<IntroColor, string>,
  token: string | undefined,
  fallback: IntroColor,
): string {
  return map[token as IntroColor] ?? map[fallback];
}

export default function Welcome({
  heading,
  body,
  pullQuote,
  linkLabel = introDefaults.linkLabel,
  linkHref = introDefaults.linkHref,
  bgColor,
  textColor,
  linkColor,
  linkHoverColor,
}: WelcomeProps) {
  const bg = classFor(introBgClass, bgColor, introDefaults.bgColor);
  const text = classFor(introTextClass, textColor, introDefaults.textColor);
  const link = classFor(introTextClass, linkColor, introDefaults.linkColor);
  const linkHover = classFor(
    introHoverTextClass,
    linkHoverColor,
    introDefaults.linkHoverColor,
  );

  return (
    <section id="welcome" className={`${bg} px-6 py-14`}>
      <div className="mx-auto max-w-6xl">
        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h2 className={`font-heading text-5xl ${text}`}>{heading}</h2>
        <p className={`mt-4 max-w-[60ch] text-lg leading-relaxed ${text}`}>
          {body} {pullQuote && <em>{pullQuote}</em>}
        </p>
        {linkLabel && linkHref && (
          <Link
            href={linkHref}
            className={`${link} ${linkHover} mt-8 inline-flex items-center gap-2 text-xl font-semibold`}
          >
            {linkLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
