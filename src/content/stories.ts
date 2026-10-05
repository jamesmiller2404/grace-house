/**
 * Lives Changed / Stories — the people the homepage cards link to.
 *
 * One source of truth for who is being profiled (graduates, staff, volunteers,
 * family members — whoever the client wants to highlight). Later this becomes
 * a Payload `stories` collection: each entry's fields map 1:1 to that
 * collection's fields, and each `href` points at that person's story/profile
 * page under /stories.
 */
export type StoryItem = {
  name: string;
  /** Small gold pill label, e.g. "Graduate - 2026". */
  tag: string;
  /** Short pull quote shown on the card. */
  excerpt: string;
  image: string;
  /** Where the card links — the person's story/profile page. */
  href: string;
  /** Text for the card link, e.g. "Read her story". */
  readLabel: string;
};

export const stories: StoryItem[] = [
  {
    name: "Maria",
    tag: "Graduate - 2026",
    excerpt: "“I finally felt like I belonged somewhere.”",
    image: "/images/person1.jpg",
    href: "/stories/maria",
    readLabel: "Read her story",
  },
  {
    name: "John",
    tag: "Graduate - 2026",
    excerpt: "“I've made life-long friends at Grace House.”",
    image: "/images/person2.jpg",
    href: "/stories/john",
    readLabel: "Read her story",
  },
  {
    name: "Brandon",
    tag: "Graduate - 2026",
    excerpt: "“Grace House taught me who I am.”",
    image: "/images/person3.jpg",
    href: "/stories/brandon",
    readLabel: "Read her story",
  },
];
