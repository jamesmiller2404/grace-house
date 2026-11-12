import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StoryProfile from "@/components/StoryProfile";
import { getStoryProfileBySlug, getStoryProfiles } from "@/payload/queries";

type Params = { params: Promise<{ slug: string }> };

/** How many "More lives changed..." cards a story page shows at most. */
const MAX_MORE_PROFILES = 4;

function hashString(value: string): number {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }

  return hash >>> 0;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getStoryProfileBySlug(slug);
  if (!profile) return {};
  return {
    title: `${profile.name}'s Story — Grace House`,
  };
}

/**
 * A single story profile page, rendered from the `stories` collection in the
 * database (managed in /admin/collections/stories). The slug is derived from
 * the person's name, so every story in the database gets a page automatically,
 * and all `/stories/<slug>` routes share the same layout via StoryProfile.
 * Pages render at request time, so edits made in the admin panel show up
 * immediately.
 */
export default async function StoryPage({ params }: Params) {
  const { slug } = await params;
  const profile = await getStoryProfileBySlug(slug);
  if (!profile) notFound();
  const allProfiles = await getStoryProfiles();

   // "More lives changed..." — up to MAX_MORE_PROFILES other profiles.
  // The deterministic ordering varies between stories but remains stable
  // across renders, avoiding impure operations during rendering.
  const candidates = allProfiles.filter(
    (other) => other.slug !== profile.slug,
  );

  const others = candidates
    .sort((a, b) => {
      const difference =
        hashString(`${slug}:${a.slug}`) -
        hashString(`${slug}:${b.slug}`);

      return difference || a.slug.localeCompare(b.slug);
    })
    .slice(0, MAX_MORE_PROFILES);

  return (
    <>
      <main className="flex-1">
        <StoryProfile profile={profile} others={others} />
      </main>
    </>
  );
}
