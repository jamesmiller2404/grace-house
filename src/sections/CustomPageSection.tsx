import CustomPageBlocks from "@/components/CustomPageBlocks";
import type { CustomPageContent } from "@/content/customPages";

export type CustomPageSectionProps = {
  /** The custom (spare) page to show as a home page section. */
  page: CustomPageContent;
};

/**
 * A custom page rendered as a home page section — the row in the "Home Page
 * Layout" panel whose Section is "Custom Page" (see
 * src/app/(frontend)/page.tsx, which resolves the picked page and skips the
 * row when it is missing or no longer visible). Shows the page's name and its
 * blocks, styled like the standalone /pages/<slug> page (the same gold rule,
 * heading font and body width) but as a section of the front page rather than
 * a page of its own. The body markup is shared with that page through
 * src/components/CustomPageBlocks.tsx.
 */
export default function CustomPageSection({ page }: CustomPageSectionProps) {
  return (
    <section className="bg-cream text-ink px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h2 className="font-heading text-ink text-4xl sm:text-5xl">
          {page.title}
        </h2>
        <div className="max-w-[70ch]">
          <CustomPageBlocks blocks={page.blocks} />
        </div>
      </div>
    </section>
  );
}
