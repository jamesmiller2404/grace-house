/**
 * The /stories/<slug> URL segment for a Lives Changed profile, derived from
 * the person's name: "Maria" -> "maria", "Ann Lee" -> "ann-lee".
 *
 * Shared by the story queries (which build links and resolve slugs — see
 * src/payload/queries.ts) and the Stories collection's Name validation
 * (which blocks names that would produce the same URL — see
 * src/payload/collections/Stories.ts).
 */
export function storySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}