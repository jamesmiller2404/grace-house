/**
 * Front-page hero copy. These are the defaults the site falls back to before
 * the `hero` collection in the database has a document, and the values the
 * seed writes on first run. Mirrors the admin panel fields in
 * src/payload/collections/Hero.ts, so the swap is trivial.
 */
export const heroDefaults = {
  /** The main heading over the hero image (e.g. "Hope Starts Here"). */
  heading: "Hope Starts Here",
  /** The subline shown beneath the heading (the "eyebrow"). */
  eyebrow: "Faith-Based Recovery",
  /** Default background image — a path in public/ (also used by the seed). */
  image: "/images/hero1a.jpg",
};
