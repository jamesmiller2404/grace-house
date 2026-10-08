import Image from "next/image";
import Link from "next/link";
import { formatStoryDate, storyDateLabel } from "@/lib/formatStoryDate";
import type { StoryItem } from "@/content/stories";

export type StoriesSectionProps = {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  stories: StoryItem[];
  cta?: { label: string; href: string };
};

/**
 * "Lives Changed" — profile cards linking to each person's story page.
 * The whole card is one link so graduates and other profiles are easy to reach.
 */
export default function StoriesSection({
  eyebrow,
  heading,
  subtitle,
  stories,
  cta,
}: StoriesSectionProps) {
  return (
    <section id="stories" className="bg-cream px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {eyebrow && (
          <p className="text-terra text-sm font-semibold tracking-[0.2em] uppercase">
            {eyebrow}
          </p>
        )}
        <h2 className="font-heading text-anchor mt-3 text-4xl sm:text-5xl">
          {heading}
        </h2>
        {subtitle && <p className="mt-4 text-lg">{subtitle}</p>}

        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <li key={story.href} className="flex">
              <Link
                href={story.href}
                className="group flex flex-1 flex-col overflow-hidden bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] focus-visible:outline-2 focus-visible:outline-terra"
              >
                <div className="relative h-64 shrink-0">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="bg-lift text-ink inline-block self-start rounded-md px-4 py-1.5 text-sm font-bold tracking-[0.05em] uppercase">
                    {story.tag}
                  </span>
                  <h3 className="font-heading text-anchor mt-4 text-3xl italic leading-tight">
                    {story.name}
                  </h3>
                  {story.date && (
                    <p className="text-ink/70 mt-1 text-sm font-semibold">
                      {storyDateLabel(story.tag)} {formatStoryDate(story.date)}
                    </p>
                  )}
                  <p className="mt-2 text-base leading-relaxed italic">
                    {story.excerpt}
                  </p>
                  <span className="text-terra group-hover:text-lift mt-auto inline-flex items-center gap-2 pt-6 text-lg font-semibold">
                    {story.readLabel}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {cta && (
          <Link
            href={cta.href}
            className="text-terra hover:text-lift mt-10 inline-flex items-center gap-2 text-xl font-semibold"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
