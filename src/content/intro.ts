/**
 * "What is Grace House" — homepage section content and fallback values.
 * The admin collection supplies a title and ordered Heading/Paragraph/Photo
 * blocks; these defaults keep the homepage populated before the first save.
 */
export type IntroBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text?: string; content?: unknown }
  | { type: "photo"; image: string; alt: string; caption?: string };

export type IntroContent = {
  title: string;
  blocks: IntroBlock[];
};

export const introDefaults: IntroContent = {
  title: "What is Grace House",
  blocks: [
    {
      type: "paragraph",
      text: "Grace House NorCal is a faith-based discipleship program in Sacramento, California, dedicated to helping men and women overcome life’s challenges, rebuild their lives, and discover lasting hope through spiritual growth, personal accountability, and strong moral values. Through compassionate support and lasting relationships, we strive to see families restored and give hope to the hopeless.",
    },
  ],
};
