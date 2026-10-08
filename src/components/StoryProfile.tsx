import Image from "next/image";
import Link from "next/link";
import type { StoryProfile as StoryProfileData } from "@/content/storyProfiles";
import { storyProfiles } from "@/content/storyProfiles";
import { pillars } from "@/content/pillars";
import MemoriesGallery from "@/components/MemoriesGallery";

export type StoryProfileProps = {
  profile: StoryProfileData;
};

/**
 * Full-page graduate profile (mockups in photoshop_assets/story-page-*.png).
 * Data-driven so every `/stories/<slug>` page renders the same layout with
 * its own copy and photos.
 */
export default function StoryProfile({ profile }: StoryProfileProps) {
  const pillar = pillars[profile.pillarIndex];

  return (
    <div className="bg-sand">
      {/* Thin gold bar across the very top */}
      <div className="bg-gold h-1.5 w-full" aria-hidden />

      {/* Breadcrumb — Lives Changed › <profile name> */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-6xl px-6 pt-8 text-base"
      >
        <ol className="text-terra flex flex-wrap items-center gap-2 font-bold">
          <li>
            <Link href="/stories" className="underline-offset-4 hover:underline">
              Lives Changed
            </Link>
          </li>
          <li aria-hidden className="text-ink/60 font-normal">›</li>
          <li aria-current="page">{profile.name}</li>
        </ol>
      </nav>

      {/* Hero: photo centered-left, name / tag / quote right */}
      <header className="mx-auto mt-10 max-w-4xl px-6">
        <div className="grid items-center justify-center gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="border-ink relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border-2 md:mx-0">
            <Image
              src={profile.image}
              alt={profile.name}
              fill
              priority
              sizes="(min-width:768px) 40vw, (min-width:640px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="font-heading text-anchor text-5xl sm:text-6xl">
              {profile.name}
            </h1>
            <span className="bg-lift text-ink mt-4 inline-block rounded-md px-4 py-1.5 text-sm font-bold tracking-[0.05em] uppercase">
              {profile.tag}
            </span>
            <blockquote className="mt-6 flex gap-3">
              <span className="bg-gold w-1 shrink-0 self-stretch" aria-hidden />
              <p className="font-heading text-anchor text-2xl leading-snug sm:text-3xl">
                &ldquo;{profile.heroQuote}&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </header>

      {/* Story body: narrow column, drop cap on the opening paragraph */}
      <article className="mx-auto max-w-[65ch] px-6 py-14 text-lg leading-relaxed">
        {profile.body.map((block, i) => {
          if (block.type === "h2") {
            return (
              <h2 key={i} className="font-heading text-anchor mt-10 text-3xl">
                {block.text}
              </h2>
            );
          }
          const isFirst = profile.body.findIndex((b) => b.type === "p") === i;
          return (
            <p key={i} className={`mt-6 ${isFirst ? "drop-cap" : ""}`}>
              {block.text}
            </p>
          );
        })}
      </article>

      {/* Full-width pull-quote band */}
      <section className="bg-anchor px-6 py-16 text-cream">
        <figure className="mx-auto max-w-4xl text-center">
          <div className="bg-gold mx-auto h-1 w-24 rounded-full" aria-hidden />
          <blockquote className="font-heading mt-10 text-3xl leading-snug text-white sm:text-4xl">
            &ldquo;{profile.quoteBand.quote}&rdquo;
          </blockquote>
          <figcaption className="text-terra mt-8 text-sm font-bold tracking-[0.2em] uppercase">
            {profile.quoteBand.attribution}
          </figcaption>
        </figure>
      </section>

      {/* Memories gallery (story-page-section4.png) */}
      <div className="mx-auto max-w-6xl px-6">
        <MemoriesGallery memories={profile.memories} name={profile.name} />
      </div>

      {/* Closing — where she/he is today */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="font-heading text-anchor text-3xl">
          {profile.closing.heading}
        </h2>
        {profile.closing.paragraphs.map((p, i) => (
          <p key={i} className="mt-6 text-lg leading-relaxed">
            {p}
          </p>
        ))}
        <div className="mt-10 border-ink/60 border-t" aria-hidden />
        <p className="text-ink/80 mt-4 text-base italic">
          Shared with {profile.name}&rsquo;s permission.
        </p>
      </section>

      {/* Pillar that mattered most (story-page-section2.png) */}
      {pillar && (
        <section
          aria-labelledby="key-pillar-heading"
          className="mx-auto max-w-4xl px-6 pb-4"
        >
          <div className="relative overflow-hidden rounded-lg">
            <div className="bg-gold absolute inset-y-0 left-0 w-1.5" aria-hidden />
            <div className="flex flex-col gap-4 bg-gradient-to-r from-[#674981] to-[#2b2830] px-6 py-6 sm:flex-row sm:items-center sm:gap-8 sm:px-10 sm:py-7">
              <span
                aria-hidden
                className="font-heading text-gold shrink-0 self-start text-5xl leading-none sm:self-center sm:text-6xl"
              >
                {String(profile.pillarIndex + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-gold text-sm font-bold tracking-[0.15em] uppercase">
                  The pillar that mattered most to {profile.name}
                </p>
                <h2
                  id="key-pillar-heading"
                  className="font-heading mt-2 text-3xl text-white sm:text-4xl"
                >
                  {pillar.title}
                </h2>
                <p className="text-cream mt-3 text-lg leading-relaxed">
                  {pillar.text}{" "}
                  <Link
                    href="/about/four-pillars"
                    className="text-gold font-bold hover:text-lift"
                  >
                    Read more about The Four Pillars
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Divider + other profiles */}
      <hr className="border-ink/15 mx-auto max-w-6xl" />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="font-heading text-anchor text-2xl italic">
          More lives changed...
        </h2>
        <ul className="mt-6 flex flex-wrap gap-4">
          {storyProfiles
            .filter((p) => p.slug !== profile.slug)
            .map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/stories/${other.slug}`}
                  className="group inline-flex items-center gap-3 bg-white px-4 py-3 shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
                >
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={other.image}
                      alt={other.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <span>
                    <span className="font-heading text-anchor block text-lg italic">
                      {other.name}
                    </span>
                    <span className="text-terra group-hover:text-lift text-sm font-semibold underline underline-offset-4">
                      Read {other.pronouns.possessive} story
                    </span>
                  </span>
                </Link>
              </li>
            ))}
        </ul>
        <Link
          href="/stories"
          className="text-terra hover:text-anchor mt-8 inline-flex items-center gap-2 text-xl font-semibold"
        >
          View all profiles and stories
        </Link>
      </section>
    </div>
  );
}
