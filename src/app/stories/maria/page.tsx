import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import MemoriesGallery, { type Memory } from "@/components/MemoriesGallery";
import { pillars } from "@/content/pillars";

export const metadata = {
  title: "Maria's Story — Grace House",
};

/** Index (0-based) of the pillar that mattered most to Maria. */
const KEY_PILLAR_INDEX = 0;

/** Personal photos from Maria's time at Grace House (placeholders). */
const memories: Memory[] = [
  {
    image: "/images/extraImage1.jpg",
    alt: "Maria laughing with friends on the porch",
    caption: "Porch nights with the house. Used with permission.",
  },
  {
    image: "/images/extraImage2.jpg",
    alt: "Maria serving dinner at a house celebration",
    caption: "Cooking her first holiday dinner. Used with permission.",
  },
  {
    image: "/images/extraImage3.jpg",
    alt: "Maria on a group trip with housemates",
    caption: "The house camping trip. Used with permission.",
  },
  {
    image: "/images/person2.jpg",
    alt: "Maria with her sponsor at her graduation",
    caption: "Graduation day with her sponsor. Used with permission.",
  },
  {
    image: "/images/pillar-4.jpg",
    alt: "Maria and her daughter reunited",
    caption: "Reunited with her daughter. Used with permission.",
  },
  {
    image: "/images/person3.jpg",
    alt: "Maria speaking at a house meeting",
    caption: "Sharing her story at a Friday meeting. Used with permission.",
  },
];

/**
 * Mockup: full profile page for a single graduate, matching
 * photoshop_assets/story-page-section1.png. Background is `bg-sand`
 * (#e7d8c3); all colors come from the design tokens in globals.css.
 */
export default function MariaStoryPage() {
  return (
    <>
      <Nav />
      <main className="bg-sand px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="text-terra flex flex-wrap items-center gap-2 font-semibold">
              <li>
                <Link href="/" className="hover:text-anchor underline-offset-4 hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-ink/60">›</li>
              <li>
                <Link href="/#stories" className="hover:text-anchor underline-offset-4 hover:underline">
                  Lives Changed
                </Link>
              </li>
              <li aria-hidden className="text-ink/60">›</li>
              <li aria-current="page" className="text-ink">
                Maria&rsquo;s Story
              </li>
            </ol>
          </nav>

          {/* Hero: photo + name / tag / pull quote */}
          <div className="mt-10 grid items-center gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="border-anchor relative aspect-[4/5] overflow-hidden rounded-2xl border-2">
              <Image
                src="/images/person1.jpg"
                alt="Maria, a Grace House graduate"
                fill
                priority
                sizes="(min-width:768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="font-heading text-anchor text-5xl sm:text-6xl">Maria</h1>
              <span className="bg-lift text-ink mt-4 inline-block rounded-md px-4 py-1.5 text-sm font-bold tracking-[0.05em] uppercase">
                Graduate — 2026
              </span>
              <p className="font-heading text-anchor mt-6 max-w-[28ch] text-3xl leading-snug sm:text-4xl">
                &ldquo;Grace House gave me my life back.&rdquo;
              </p>
              <p className="text-ink/80 mt-4 text-lg">
                Read about her time at Grace House, in her own words.
              </p>
            </div>
          </div>

          {/* Story body: narrow reading column */}
          <article className="mx-auto mt-16 max-w-[65ch] space-y-8 text-lg leading-relaxed">
            <p>
              When Maria arrived at Grace House, she had been sober for three
              days and had nowhere left to go. What she found was a room of her
              own, a bed she didn&rsquo;t have to fight for, and housemates who
              understood what the first week feels like.
            </p>
            <p>
              The structure helped. Morning meetings, weekly check-ins with her
              case manager, and the simple rhythm of shared meals and chores
              gave her days a shape they hadn&rsquo;t had in years. She started
              working the steps with a sponsor from the house&rsquo;s Thursday
              meeting.
            </p>
            <h2 className="font-heading text-anchor text-3xl">
              Finding her footing
            </h2>
            <p>
              By her second month, Maria was volunteering in the kitchen and
              reconnecting with her daughter over Sunday phone calls. &ldquo;The
              house didn&rsquo;t just keep me sober,&rdquo; she says. &ldquo;It
              taught me how to live again.&rdquo;
            </p>
            <p>
              She graduated from the program in the spring, moved into her own
              apartment nearby, and still comes back to cook dinner for the
              house on the first Friday of every month.
            </p>
          </article>

          {/* Full-width pull-quote band */}
          <section className="bg-anchor text-cream mt-16 -mx-4 px-4 py-16 sm:-mx-6 sm:px-6 text-center sm:py-20">
            <div className="bg-gold mx-auto h-1 w-24 rounded-full" />
            <blockquote className="font-heading mx-auto mt-8 max-w-[24ch] text-4xl leading-snug text-white sm:max-w-[28ch] sm:text-5xl">
              &ldquo;I walked in broken. I walked out whole.&rdquo;
            </blockquote>
            <p className="text-gold mt-6 text-sm font-semibold tracking-[0.2em] uppercase">
              Maria — Grace House Graduate
            </p>
          </section>

          {/* Closing section */}
          <div className="mx-auto mt-16 max-w-[65ch] space-y-8 text-lg leading-relaxed">
            <h2 className="font-heading text-anchor text-3xl">Where she is today</h2>
            <p>
              Maria has been sober for over a year, works full-time at a local
              nonprofit, and shares a home with her daughter. She&rsquo;s
              planning to sponsor women coming through the program next year
              &mdash; the same hand that was extended to her.
            </p>
            <p className="text-terra font-semibold">
              <Link href="/#stories" className="underline underline-offset-4 hover:text-anchor">
                Meet more lives changed <span aria-hidden>→</span>
              </Link>
            </p>
          </div>

          {/* The pillar that mattered most to this graduate */}
          <section
            aria-labelledby="key-pillar-heading"
            className="relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-lg"
          >
            {/* Gold edge on the left, dark gradient card body */}
            <div className="bg-gold absolute inset-y-0 left-0 w-1.5" />
            <div className="bg-gradient-to-br from-anchor to-[#241b2e] flex flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:gap-8 sm:px-10 sm:py-10">
              <span
                aria-hidden
                className="font-heading text-gold shrink-0 self-start text-5xl leading-none sm:self-center sm:text-6xl"
              >
                {String(KEY_PILLAR_INDEX + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-gold text-sm font-bold tracking-[0.15em] uppercase">
                  The pillar that mattered most to Maria
                </p>
                <h2
                  id="key-pillar-heading"
                  className="font-heading mt-2 text-3xl text-white sm:text-4xl"
                >
                  {pillars[KEY_PILLAR_INDEX].title}
                </h2>
                <p className="text-cream mt-3 text-lg leading-relaxed">
                  {pillars[KEY_PILLAR_INDEX].text}{" "}
                  <Link
                    href="/#pillars"
                    className="text-gold font-bold underline underline-offset-4 hover:text-lift"
                  >
                    Read more about The Four Pillars <span aria-hidden>→</span>
                  </Link>
                </p>
              </div>
            </div>
          </section>

          {/* Personal photo memories */}
          <MemoriesGallery name="Maria" memories={memories} />
        </div>
      </main>
    </>
  );
}