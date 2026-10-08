import type { Memory } from "@/components/MemoriesGallery";

/**
 * Full content for each graduate's profile page (the mockups in
 * photoshop_assets/story-page-section1/2/4.png). Each entry maps to one
 * `/stories/<slug>` page. Later this becomes a Payload `storyProfiles`
 * collection; the fields here map 1:1 to that collection's fields.
 */
export type StoryProfile = {
  slug: string;
  name: string;
  /** Gold pill label — one of "Graduate", "Volunteer", "Staff". */
  tag: string;
  /** Portrait photo. */
  image: string;
  /** Pull quote shown in the hero. */
  heroQuote: string;
  /** Story body: a sequence of plain paragraphs and subheadings. */
  body: Array<{ type: "p"; text: string } | { type: "h2"; text: string }>;
  /** Copy for the full-width dark pull-quote band. */
  quoteBand: { quote: string; attribution: string };
  /** "Where she is today" closing section. */
  closing: { heading: string; paragraphs: string[] };
  /** Index (0-based) into `pillars` of the pillar that mattered most. */
  pillarIndex: number;
  /** Grammar for copy like "shared her story" / "Read her story". */
  pronouns: { subject: string; possessive: string };
  /** Personal photos for the memories gallery. */
  memories: Memory[];
};

export const storyProfiles: StoryProfile[] = [
  {
    slug: "maria",
    name: "Maria",
    tag: "Graduate",
    image: "/images/person1.jpg",
    heroQuote: "Grace House gave me my life back.",
    body: [
      {
        type: "p",
        text: "When Maria arrived at Grace House, she had been sober for three days and had nowhere left to go. What she found was a room of her own, a bed she didn't have to fight for, and housemates who understood what the first week feels like.",
      },
      {
        type: "p",
        text: "The structure helped. Morning meetings, weekly check-ins with her case manager, and the simple rhythm of shared meals and chores gave her days a shape they hadn't had in years. She started working the steps with a sponsor from the house's Thursday meeting.",
      },
      { type: "h2", text: "Finding her footing" },
      {
        type: "p",
        text: "By her second month, Maria was volunteering in the kitchen and reconnecting with her daughter over Sunday phone calls. \"The house didn't just keep me sober,\" she says. \"It taught me how to live again.\"",
      },
      {
        type: "p",
        text: "She graduated from the program in the spring, moved into her own apartment nearby, and still comes back to cook dinner for the house on the first Friday of every month.",
      },
    ],
    quoteBand: {
      quote: "I walked in broken. I walked out whole.",
      attribution: "Maria — Grace House Graduate",
    },
    closing: {
      heading: "Where she is today",
      paragraphs: [
        "Maria has been sober for over a year, works full-time at a local nonprofit, and shares a home with her daughter. She's planning to sponsor women coming through the program next year — the same hand that was extended to her.",
      ],
    },
    pillarIndex: 0,
    pronouns: { subject: "she", possessive: "her" },
    memories: [
      {
        image: "/images/person1.jpg",
        alt: "Maria laughing with friends on the porch",
        caption: "Porch nights with the house. Used with permission.",
      },
      {
        image: "/images/pillar-2.jpg",
        alt: "Maria serving dinner at a house celebration",
        caption: "Cooking her first holiday dinner. Used with permission.",
      },
      {
        image: "/images/pillar-1.jpg",
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
    ],
  },
  {
    slug: "john",
    name: "John",
    tag: "Graduate",
    image: "/images/person2.jpg",
    heroQuote: "I've made life-long friends at Grace House.",
    body: [
      {
        type: "p",
        text: "John came to Grace House after his third treatment center. He says he arrived angry, certain nothing would work this time either. What he didn't expect was the quiet welcome — no lectures, just a hot meal and a bed.",
      },
      {
        type: "p",
        text: "The other men in the house became the difference. Older graduates took him to meetings, sat with him through the hard evenings, and showed him what long-term sobriety actually looks like day to day.",
      },
      { type: "h2", text: "Brothers in the house" },
      {
        type: "p",
        text: "John started leading the Tuesday night discussion in his fifth month. \"I came here with nothing and nobody,\" he says. \"Now I've got brothers who call me when they're struggling — and I pick up.\"",
      },
    ],
    quoteBand: {
      quote: "I found the family I thought addiction had taken from me.",
      attribution: "John — Grace House Graduate",
    },
    closing: {
      heading: "Where he is today",
      paragraphs: [
        "John works in construction, sponsors two men from his home group, and helps maintain the Grace House property on weekends. He's saving for his own place and talks to his mother every Sunday.",
      ],
    },
    pillarIndex: 1,
    pronouns: { subject: "he", possessive: "his" },
    memories: [
      {
        image: "/images/person2.jpg",
        alt: "John at his graduation ceremony",
        caption: "Graduation day. Used with permission.",
      },
      {
        image: "/images/pillar-3.jpg",
        alt: "John working on a service project",
        caption: "Weekend service project. Used with permission.",
      },
      {
        image: "/images/pillar-2.jpg",
        alt: "John at a house dinner",
        caption: "Sunday dinner with the house. Used with permission.",
      },
    ],
  },
  {
    slug: "brandon",
    name: "Brandon",
    tag: "Graduate",
    image: "/images/person3.jpg",
    heroQuote: "Grace House taught me who I am.",
    body: [
      {
        type: "p",
        text: "Brandon was twenty-three when he walked through the door, the youngest man in the house at the time. He says the first honest conversation of his adult life happened at that kitchen table, two days in.",
      },
      {
        type: "p",
        text: "Learning to be a giver came hardest. The house's third pillar — being a giver, not a taker — felt foreign to him at first. Then he started tutoring housemates working on their GEDs and something shifted.",
      },
      { type: "h2", text: "Learning to give back" },
      {
        type: "p",
        text: "By graduation, Brandon was running the house's Tuesday study nights. \"Helping somebody else was the thing that kept me sober,\" he says. \"I finally like who I am.\"",
      },
    ],
    quoteBand: {
      quote: "I spent years taking. Grace House taught me to give.",
      attribution: "Brandon — Grace House Graduate",
    },
    closing: {
      heading: "Where he is today",
      paragraphs: [
        "Brandon finished his GED, enrolled in community college, and works part-time at a local garage. He comes back to lead study nights and says he'll stay involved \"as long as they'll have me.\"",
      ],
    },
    pillarIndex: 2,
    pronouns: { subject: "he", possessive: "his" },
    memories: [
      {
        image: "/images/person3.jpg",
        alt: "Brandon celebrating his GED completion",
        caption: "The day he passed his GED. Used with permission.",
      },
      {
        image: "/images/pillar-1.jpg",
        alt: "Brandon with housemates on the porch",
        caption: "Study night regulars. Used with permission.",
      },
      {
        image: "/images/hero.jpg",
        alt: "Brandon at a Grace House gathering",
        caption: "House barbecue last summer. Used with permission.",
      },
    ],
  },
  {
    slug: "denise",
    name: "Denise",
    tag: "Staff",
    image: "/images/noPhotoAvailable_vertical.png",
    heroQuote: "Every graduate who walks out that door is family now.",
    body: [
      {
        type: "p",
        text: "Denise has been the house manager at Grace House since March of 2019. She keeps the schedules, stocks the pantry, checks the rooms, and — most evenings — sits at the kitchen table with whoever needs to talk.",
      },
      {
        type: "p",
        text: "\"People think running a house like this is about rules,\" she says. \"It's not. It's about making the house feel like a home, because for most of the men and women who arrive here, nothing has felt like a home in years.\"",
      },
      { type: "h2", text: "The steady one" },
      {
        type: "p",
        text: "Graduates returning to visit head straight for Denise. She remembers every name, every graduation date, and which housemates kept in touch. When a new resident has a hard first week, it's usually Denise who notices first.",
      },
    ],
    quoteBand: {
      quote: "This house works because somebody treats it like it matters. That somebody is me.",
      attribution: "Denise — Grace House Staff",
    },
    closing: {
      heading: "Where she is today",
      paragraphs: [
        "Denise still runs the house day to day and has watched more than a hundred residents come through the program. She says she plans to keep the kitchen table open \"for as long as the house needs me.\"",
      ],
    },
    pillarIndex: 0,
    pronouns: { subject: "she", possessive: "her" },
    memories: [
      {
        image: "/images/noPhotoAvailable_horizontall.png",
        alt: "Denise in the Grace House kitchen",
        caption: "Sunday dinner prep. Used with permission.",
      },
      {
        image: "/images/noPhotoAvailable_horizontall.png",
        alt: "Denise with residents at a house gathering",
        caption: "Summer barbecue with the house. Used with permission.",
      },
      {
        image: "/images/noPhotoAvailable_horizontall.png",
        alt: "Denise serving dinner",
        caption: "Friends Giving, her favorite night of the year. Used with permission.",
      },
    ],
  },

  {
    slug: "marcus",
    name: "Marcus",
    tag: "Staff",
    image: "/images/noPhotoAvailable_vertical.png",
    heroQuote: "I run the house the way someone once ran it for me.",
    body: [
      {
        type: "p",
        text: "Marcus joined the Grace House staff in August of 2021 as program coordinator, the person who pairs new residents with mentors, schedules meetings, and keeps the first ninety days on track.",
      },
      {
        type: "p",
        text: "He knows the program from the inside — years earlier he sat at the same kitchen table as a resident. \"Somebody ran the schedule for me when I couldn't run it myself,\" he says. \"This is me paying that forward with interest.\"",
      },
      { type: "h2", text: "Showing what long-term looks like" },
      {
        type: "p",
        text: "Residents say Marcus's strength is that he never promises it will be easy — only that they won't do it alone. He shows up to every anniversary chip night, and his list of graduates who call him on their milestone dates keeps growing.",
      },
    ],
    quoteBand: {
      quote: "I got a second chance here. My job is making sure everyone else gets theirs.",
      attribution: "Marcus — Grace House Staff",
    },
    closing: {
      heading: "Where he is today",
      paragraphs: [
        "Marcus continues to lead the mentorship program and coordinates with local treatment centers to bring new residents into the house. He also hosts the monthly alumni meeting, which he started in 2022.",
      ],
    },
    pillarIndex: 1,
    pronouns: { subject: "he", possessive: "his" },
    memories: [
      {
        image: "/images/noPhotoAvailable_horizontall.png",
        alt: "Marcus leading a house meeting",
        caption: "Monday house meeting. Used with permission.",
      },
      {
        image: "/images/noPhotoAvailable_horizontall.png",
        alt: "Marcus on the porch with housemates",
        caption: "Porch conversations, where the real work happens. Used with permission.",
      },
      {
        image: "/images/noPhotoAvailable_horizontall.png",
        alt: "Marcus at the spring open house",
        caption: "Spring Open House, meeting the next class. Used with permission.",
      },
    ],
  },


  {
    slug: "elena",
    name: "Elena",
    tag: "Volunteer",
    image: "/images/noPhotoAvailable_vertical.png",
    heroQuote: "I came to serve dinner. I stayed for the people.",
    body: [
      {
        type: "p",
        text: "Elena started volunteering at Grace House in January of 2023, signing up to help serve Tuesday dinners through her church. She figured she'd give it a month. Three years later she's still there every week.",
      },
      {
        type: "p",
        text: "\"The first dinner I worked, I was nervous,\" she admits. \"By the second one, I knew everyone's name. By the third, I was getting recipe requests.\" Her Thursday cooking nights have become a fixture of the house.",
      },
      { type: "h2", text: "More than a meal" },
      {
        type: "p",
        text: "Residents say Elena's dinners do more than fill plates — they give the house one guaranteed evening a week where everyone sits down together. She keeps a notebook of favorite meals and makes sure every birthday gets a cake.",
      },
    ],
    quoteBand: {
      quote: "You don't have to be in recovery to need a second family. I found mine here too.",
      attribution: "Elena — Grace House Volunteer",
    },
    closing: {
      heading: "Where she is today",
      paragraphs: [
        "Elena still volunteers weekly and now coordinates the church group that provides dinners twice a month. She's training two new volunteers and jokes that her notebook of recipes \"might be the house's most important document.\"",
      ],
    },
    pillarIndex: 2,
    pronouns: { subject: "she", possessive: "her" },
    memories: [
      {
        image: "/images/noPhotoAvailable_horizontall.png",
        alt: "Elena serving dinner at Grace House",
        caption: "Tuesday dinner, week one hundred and something. Used with permission.",
      },
      {
        image: "/images/noPhotoAvailable_horizontall.png",
        alt: "Elena at the Friends Giving table",
        caption: "Friends Giving with the whole house. Used with permission.",
      },
      {
        image: "/images/noPhotoAvailable_horizontall.png",
        alt: "Elena at the Christmas dinner",
        caption: "Christmas Eve, her favorite shift. Used with permission.",
      },
    ],
  },
];

/** Look up a profile by URL slug. */
export function getStoryProfile(slug: string): StoryProfile | undefined {
  return storyProfiles.find((p) => p.slug === slug);
}