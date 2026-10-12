/**
 * "What is Grace House" — the Intro section on the home page.
 *
 * These are the defaults the site falls back to before the `intro` collection
 * in the database has a document, and the values the seed writes on first run.
 * They mirror the admin panel fields in src/payload/collections/Intro.ts 1:1,
 * so the swap is trivial.
 *
 * `bgColor`, `textColor`, `linkColor` and `linkHoverColor` are design-token
 * names (see the `--color-*` tokens in src/app/(frontend)/globals.css). The
 * class maps below turn a token into the Tailwind classes the section renders.
 * The values are written out as literal strings on purpose — Tailwind only
 * generates a class it can see in the source, so a computed name such as
 * `bg-${token}` would produce no CSS.
 */

/** The colors an editor can pick, keyed by design-token name. */
export const introColorTokens = [
  "cream",
  "sand",
  "gold",
  "terra",
  "lift",
  "anchor",
  "ink",
  "white",
] as const;

export type IntroColor = (typeof introColorTokens)[number];

/** Friendly labels (with their hex hints) for the admin dropdowns. */
export const introColorLabels: Record<IntroColor, string> = {
  cream: "Cream (#f7f3eb)",
  sand: "Sand (#e7d8c3)",
  gold: "Gold (#c9a45c)",
  terra: "Terracotta (#9e5640)",
  lift: "Amber / hover (#e3a857)",
  anchor: "Aubergine (#32243f)",
  ink: "Ink (#242725)",
  white: "White (#ffffff)",
};

/** `bg-*` class per token — the section background. */
export const introBgClass: Record<IntroColor, string> = {
  cream: "bg-cream",
  sand: "bg-sand",
  gold: "bg-gold",
  terra: "bg-terra",
  lift: "bg-lift",
  anchor: "bg-anchor",
  ink: "bg-ink",
  white: "bg-white",
};

/** `text-*` class per token — the heading, body and link colors. */
export const introTextClass: Record<IntroColor, string> = {
  cream: "text-cream",
  sand: "text-sand",
  gold: "text-gold",
  terra: "text-terra",
  lift: "text-lift",
  anchor: "text-anchor",
  ink: "text-ink",
  white: "text-white",
};

/** `hover:text-*` class per token — the link's hover color. */
export const introHoverTextClass: Record<IntroColor, string> = {
  cream: "hover:text-cream",
  sand: "hover:text-sand",
  gold: "hover:text-gold",
  terra: "hover:text-terra",
  lift: "hover:text-lift",
  anchor: "hover:text-anchor",
  ink: "hover:text-ink",
  white: "hover:text-white",
};

/** The Intro section content — the shape the section renders. */
export type IntroContent = {
  heading: string;
  body: string;
  pullQuote: string;
  linkLabel: string;
  linkHref: string;
  bgColor: IntroColor;
  textColor: IntroColor;
  linkColor: IntroColor;
  linkHoverColor: IntroColor;
};

export const introDefaults: IntroContent = {
  heading: "What is Grace House",
  body: "Grace House NorCal is a faith-based discipleship program in Sacramento, California, dedicated to helping men and women overcome life’s challenges, rebuild their lives, and discover lasting hope through spiritual growth, personal accountability, and strong moral values. Through compassionate support and lasting relationships, we strive...",
  pullQuote: "to see families restored and give hope to the hopeless.",
  linkLabel: "Read our mission",
  linkHref: "/about/mission",
  bgColor: "cream",
  textColor: "anchor",
  linkColor: "terra",
  linkHoverColor: "lift",
};
