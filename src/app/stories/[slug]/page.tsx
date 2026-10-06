import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import StoryProfile from "@/components/StoryProfile";
import { getStoryProfile, storyProfiles } from "@/content/storyProfiles";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return storyProfiles.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const profile = getStoryProfile(slug);
  if (!profile) return {};
  return {
    title: `${profile.name}'s Story — Grace House`,
  };
}

/**
 * A single graduate's profile page, rendered from `storyProfiles` content.
 * All `/stories/<slug>` routes share the same layout via StoryProfile.
 */
export default async function StoryPage({ params }: Params) {
  const { slug } = await params;
  const profile = getStoryProfile(slug);
  if (!profile) notFound();

  return (
    <>
      <Nav />
      <main>
        <StoryProfile profile={profile} />
      </main>
    </>
  );
}