/**
 * Custom (spare) pages — the types shared by the site's reader for the
 * `custom-pages` collection (src/payload/queries.ts) and the page renderer
 * (src/app/(frontend)/pages/[slug]/page.tsx).
 *
 * The admin panel (/admin/collections/custom-pages) owns the content; these
 * types describe the shape the front end renders, not the collection config.
 */

/** One block of a custom page body, in the order the editor stacked them. */
export type CustomPageBlock =
  | {
      type: "paragraph";
      text: string;
      /** The clickable words shown after the text, if any. */
      linkLabel?: string;
      /** Where that link points (https://…, tel:… or mailto:…). */
      linkHref?: string;
    }
  | { type: "heading"; text: string; linkLabel?: string; linkHref?: string }
  | { type: "photo"; image: string; alt: string; caption?: string };

/** One custom page as the front end renders it. */
export type CustomPageContent = {
  /** The page name — the heading on the page and the nav link label. */
  title: string;
  /** The URL slug (/pages/<slug>), derived from the title. */
  slug: string;
  blocks: CustomPageBlock[];
};

/** One "More" dropdown entry for an enabled custom page. */
export type CustomNavLink = { label: string; href: string };

/** "Our History!" → "our-history" (the URL slug) — same rule as events. */
export function customPageSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
