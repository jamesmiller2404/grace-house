export type HeroCta = {
  label: string;
  href: string;
  bgColor?: string;
  textColor?: string;
};

export type HeroTextShadow = {
  enabled: boolean;
  color: string;
  opacity: number;
  distance: number;
  angle: number;
  fuzziness: number;
  extent: number;
};

export type HeroContent = {
  heading: string;
  eyebrow: string;
  subtext: string;
  image: string;
  showCard: boolean;
  cardColor: string;
  cardOpacity: number;
  headingColor: string;
  eyebrowColor: string;
  subtextColor: string;
  headingFontSize: number;
  eyebrowFontSize: number;
  subtextFontSize: number;
  textShadow: HeroTextShadow;
  cardPositionX: number;
  cardPositionY: number;
  cardWidth?: number;
  cardHeight?: number;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
};

/**
 * Convert a HeroTextShadow config into a CSS `text-shadow` value.
 * Supports angle, distance, fuzziness (blur), color, opacity, and extent (spread
 * via layered offsets around the shadow center).
 */
export function buildHeroTextShadow(
  shadow?: Partial<HeroTextShadow>,
): string | undefined {
  if (!shadow?.enabled) return undefined;
  const hex =
    typeof shadow.color === "string" && /^#[0-9a-fA-F]{6}$/.test(shadow.color.trim())
      ? shadow.color.trim()
      : "#000000";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const opacity =
    typeof shadow.opacity === "number"
      ? Math.max(0, Math.min(100, shadow.opacity)) / 100
      : 0.75;
  const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;

  const distance = typeof shadow.distance === "number" ? shadow.distance : 4;
  const angle = typeof shadow.angle === "number" ? shadow.angle : 135;
  const blur = Math.max(0, typeof shadow.fuzziness === "number" ? shadow.fuzziness : 6);
  const extent = Math.max(0, Math.min(20, typeof shadow.extent === "number" ? shadow.extent : 0));

  const rad = (angle * Math.PI) / 180;
  const ox = Math.round(Math.cos(rad) * distance * 10) / 10;
  const oy = Math.round(Math.sin(rad) * distance * 10) / 10;

  if (extent <= 0) {
    return `${ox}px ${oy}px ${blur}px ${rgba}`;
  }

  // Simulate spread/extent on text by layering 8 radial offsets around (ox, oy)
  const layers: string[] = [`${ox}px ${oy}px ${blur}px ${rgba}`];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [0.707, 0.707],
    [-0.707, 0.707],
    [0.707, -0.707],
    [-0.707, -0.707],
  ];
  for (const [dx, dy] of dirs) {
    const sx = Math.round((ox + dx * extent) * 10) / 10;
    const sy = Math.round((oy + dy * extent) * 10) / 10;
    layers.push(`${sx}px ${sy}px ${blur}px ${rgba}`);
  }
  return layers.join(", ");
}

/**
 * Front-page hero copy and styling defaults. These are the defaults the site
 * falls back to before the `hero` collection in the database has a document,
 * and the values used when optional style fields are unset. Mirrors the admin
 * panel fields in src/payload/collections/Hero.ts.
 */
export const heroDefaults: HeroContent = {
  /** The main heading over the hero image (e.g. "Hope Starts Here"). */
  heading: "Hope Starts Here",
  /** The subline shown beneath the heading (the "eyebrow"). */
  eyebrow: "Faith-Based Recovery",
  /** Optional third text line shown beneath the eyebrow. */
  subtext: "",
  /** Default background image — a path in public/ (also used by the seed). */
  image: "/images/hero1a.jpg",
  /** Whether the translucent overlay card is shown over the hero image. */
  showCard: true,
  /** Default card background color (matches Tailwind slate-900). */
  cardColor: "#0f172a",
  /** Default card background opacity percentage (0-100, matches /55). */
  cardOpacity: 55,
  /** Default heading text color. */
  headingColor: "#ffffff",
  /** Default eyebrow text color (matches --color-gold). */
  eyebrowColor: "#c9a45c",
  /** Default third-line text color (matches --color-cream). */
  subtextColor: "#f7f3eb",
  /** Default heading font size in px (matches md:text-6xl = 60px). */
  headingFontSize: 60,
  /** Default eyebrow font size in px (matches 1.2rem ≈ 19px). */
  eyebrowFontSize: 19,
  /** Default third-line font size in px. */
  subtextFontSize: 18,
  /** Default text drop shadow (disabled by default to preserve current look). */
  textShadow: {
    enabled: false,
    color: "#000000",
    opacity: 75,
    distance: 4,
    angle: 135,
    fuzziness: 6,
    extent: 0,
  },
  /** Default horizontal card placement percentage (0 = left, 50 = center, 100 = right). */
  cardPositionX: 50,
  /** Default vertical card placement percentage (0 = top, 50 = middle, 100 = bottom). */
  cardPositionY: 5,
  /** Optional explicit card width in px (undefined = auto). */
  cardWidth: undefined,
  /** Optional explicit card height in px (undefined = auto). */
  cardHeight: undefined,
  /** Default primary CTA button. */
  primaryCta: {
    label: "Get Help",
    href: "#help",
    bgColor: "#9e5640",
    textColor: "#ffffff",
  },
  /** Default secondary CTA button. */
  secondaryCta: {
    label: "Our Stories",
    href: "/#stories",
    bgColor: "#ffffff",
    textColor: "#242725",
  },
};
