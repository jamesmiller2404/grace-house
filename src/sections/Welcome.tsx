import Image from "next/image";
import type { IntroBlock } from "@/content/intro";
import { splitBlockParagraphs } from "@/lib/splitBlockParagraphs";

export type WelcomeProps = {
  title: string;
  blocks: IntroBlock[];
};

/** Render the homepage "What is Grace House" section from its ordered blocks. */
export default function Welcome({ title, blocks }: WelcomeProps) {
  return (
    <section id="welcome" className="bg-cream px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h2 className="font-heading text-5xl text-anchor">{title}</h2>
        {blocks.map((block, index) => {
          if (block.type === "heading") {
            return (
              <h3 key={index} className="font-heading text-ink mt-10 text-3xl sm:text-4xl">
                {block.text}
              </h3>
            );
          }
          if (block.type === "photo") {
            return (
              <figure key={index} className="mt-10">
                <div className="border-ink relative aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-lg border-2">
                  <Image
                    src={block.image}
                    alt={block.alt}
                    fill
                    sizes="(min-width:1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-ink/80 mt-2 text-base">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }
          return splitBlockParagraphs(block.text).map((paragraph, paragraphIndex) => (
            <p
              key={index + "-" + paragraphIndex}
              className="text-ink/90 mt-6 max-w-[70ch] whitespace-pre-line text-lg leading-relaxed"
            >
              {paragraph}
            </p>
          ));
        })}
      </div>
    </section>
  );
}
