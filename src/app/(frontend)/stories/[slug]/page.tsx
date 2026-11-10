import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StoryProfile from "@/components/StoryProfile";
import { getStoryProfileBySlug, getStoryProfiles } from "@/payload/queries";

type Params = { params: Promise<{ slug: string }> };

/** How many "More lives changed..." cards a story page shows at most. */
const MAX_MORE_PROFILES = 4;

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

  // "More lives changed..." — up to MAX_MORE_PROFILES other profiles in
  // random order, never including the profile being viewed. Pages render at
  // request time, so the pick changes from visit to visit. The shuffle runs
  // on the filtered copy, never on the request-cached array that
  // getStoryProfiles() returns, and happens here on the server because
  // StoryProfile is a client component (randomizing there would break
  // hydration between the server and browser renders).
  const candidates = allProfiles.filter(
    (other) => other.slug !== profile.slug,
  );
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  const others = candidates.slice(0, MAX_MORE_PROFILES);

  return (
    <>
      <main className="flex-1">
        <StoryProfile profile={profile} others={others} />
      </main>
    </>
  );
}
