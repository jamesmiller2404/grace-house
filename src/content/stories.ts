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
  /** Small gold pill label — one of "Graduate", "Volunteer", "Staff". */
  tag: string;
  /** ISO date string — e.g. the person's graduation date.
   *  Accepts "MM/DD/YYYY" (full date) or "MM/YYYY" (month and year only). */
  date: string;
  /** Short pull quote shown on the card. */
  excerpt: string;
  image: string;
  /** Where the card links — the person's story/profile page. */
  href: string;
  /** Text for the card link, e.g. "Read her story". */
  readLabel: string;
  /**
   * Index (0-based) into `pillars` of the pillar that mattered most to this
   * person — shown and sorted as "The Pillar" column in list view.
   */
  pillarIndex: number;
};

export const stories: StoryItem[] = [
  {
    name: "Maria",
    tag: "Graduate",
    date: "05/30/2026",
    excerpt: "“I finally felt like I belonged somewhere.”",
    image: "/images/person1.jpg",
    href: "/stories/maria",
    readLabel: "Read her story",
    pillarIndex: 0,
  },
  {
    name: "John",
    tag: "Graduate",
    date: "06/30/2026",
    excerpt: "“I've made life-long friends at Grace House.”",
    image: "/images/person2.jpg",
    href: "/stories/john",
    readLabel: "Read his story",
    pillarIndex: 1,
  },
  {
    name: "Brandon",
    tag: "Graduate",
    date: "08/15/2026",
    excerpt: "“Grace House taught me who I am.”",
    image: "/images/person3.jpg",
    href: "/stories/brandon",
    readLabel: "Read his story",
    pillarIndex: 2,
  },
  {
    name: "Denise",
    tag: "Staff",
    date: "03/2019",
    excerpt: "“Every graduate who walks out that door is family now.”",
    image: "/images/noPhotoAvailable_horizontall.png",
    href: "/stories/denise",
    readLabel: "Read her story",
    pillarIndex: 0,
  },
  {
    name: "Marcus",
    tag: "Staff",
    date: "08/12/2021",
    excerpt: "“I run the house the way someone once ran it for me.”",
    image: "/images/noPhotoAvailable_horizontall.png",
    href: "/stories/marcus",
    readLabel: "Read his story",
    pillarIndex: 1,
  },
  {
    name: "Elena",
    tag: "Volunteer",
    date: "01/15/2023",
    excerpt: "“I came to serve dinner. I stayed for the people.”",
    image: "/images/noPhotoAvailable_horizontall.png",
    href: "/stories/elena",
    readLabel: "Read her story",
    pillarIndex: 2,
  },
];
