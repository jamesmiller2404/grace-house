import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StoryProfile from "@/components/StoryProfile";
import { getStoryProfileBySlug, getStoryProfiles } from "@/payload/queries";

type Params = { params: Promise<{ slug: string }> };

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
  const others = await getStoryProfiles();

  return (
    <>
      <main className="flex-1">
        <StoryProfile profile={profile} others={others} />
      </main>
    </>
  );
}
