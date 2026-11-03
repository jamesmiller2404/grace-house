import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import Link from "next/link";
import CustomPageBlocks from "@/components/CustomPageBlocks";

export const metadata = {
  title: "Feeding the Streets — Grace House",
  description:
    "Community outreach at Grace House — volunteer, partner, and feed the streets.",
};

/**
 * Feeding the Streets page — rendered from the `feeding-the-streets`
 * collection in the database (managed in /admin/collections/feeding-the-streets).
 * The Title and blocks come from the admin panel; nothing is hardcoded here.
 */
export default async function FeedingTheStreetsPage() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "feeding-the-streets",
    limit: 1,
  });
  const doc = docs[0];
  if (!doc) notFound();

  const blocks = (doc.blocks ?? []).map((block) => {
    if (block.type === "Photo") {
      return {
        type: "photo",
        image:
          typeof block.image === "object" && block.image
            ? ((block.image as { url?: string }).url ?? "")
            : "",
        alt:
          typeof block.image === "object" && block.image
            ? ((block.image as { alt?: string }).alt ?? "")
            : "",
        caption: block.caption ?? undefined,
      } as { type: "photo"; image: string; alt: string; caption?: string };
    }
    return {
      type: block.type === "Heading" ? "heading" : "paragraph",
      text: block.text ?? "",
      linkLabel: block.linkLabel ?? undefined,
      linkHref: block.linkHref ?? undefined,
    } as { type: "heading" | "paragraph"; text: string; linkLabel?: string; linkHref?: string };
  });

  return (
    <>
      <main className="bg-sand flex-1 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <nav
            aria-label="Breadcrumb"
            className="text-terra pb-1 text-base font-bold"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="underline-offset-4 hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-ink/60 font-normal">
                ›
              </li>
              <li aria-current="page">{doc.title}</li>
            </ol>
          </nav>

          <div className="bg-gold mt-8 h-1 w-28 rounded-full" />
          <h1 className="font-heading text-anchor mt-4 text-5xl">{doc.title}</h1>
          <div className="max-w-[70ch] mt-4">
            <CustomPageBlocks blocks={blocks} />
          </div>
        </div>
      </main>
    </>
  );
}