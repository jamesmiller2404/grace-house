export type FaqBlock = { p: string } | { list: string[] };

export interface FaqDefault {
  question: string;
  answer: FaqBlock[];
}

export const faqDefaults: FaqDefault[] = [
  {
    question: "What is Grace House?",
    answer: [
      {
        p: "Grace House Nor Cal is a faith-based recovery program in Carmichael, California. We’ve been part of our community for years and are a go-to recovery resource for agencies throughout the greater Sacramento area. Our program includes a men’s house, a women’s house, and a men’s transitional home.",
      },
      {
        p: "Drugs are the leading cause of most crimes, and our mission is to see our streets safe once again, families restored, and hope given to the homeless.",
      },
    ],
  },
  {
    question: "Why choose Grace House?",
    answer: [
      { p: "Our approach rests on four pillars of recovery:" },
      {
        list: [
          "**Self-forgiveness.** Residents forgive themselves for the pain they caused their families and themselves during addiction.",
          "**Trusting God’s timing.** We believe things happen in His time, not before we’re ready for them.",
          "**Becoming a giver, not a taker.** Addiction steals love, joy, affection, peace, and harmony. Residents learn to give of themselves and to receive the good things they deserve.",
          "**Restoration.** As residents work through the first three pillars, relationships are restored: families, friends, spouses, children, and parents.",
        ],
      },
      {
        p: "We’re also a community. Most of our past residents stay connected after graduation by teaching or sitting in on classes, joining outreach events, sponsoring current residents, or simply coming home for dinner.",
      },
    ],
  },
  {
    question: "How much does Grace House cost?",
    answer: [
      {
        p: "Grace House is private pay. We do not accept Medi-Cal or any other insurance. The cost is $700 per month. Beds are divided into full-pay (70%), half-pay (20%), and scholarship (10%). Please contact us to find out your cost.",
      },
    ],
  },
  {
    question: "How do residents get placed at Grace House?",
    answer: [
      {
        p: "We work with partner agencies for resident placement and have well-established relationships with the court system in multiple counties across California.",
      },
    ],
  },
  {
    question: "How long is the program?",
    answer: [
      {
        p: "We offer 3-month, 6-month, 9-month, and year-long stays. Men may move into our transitional house once they complete the requirements at our main home.",
      },
    ],
  },
  {
    question: "Is there staff at Grace House?",
    answer: [
      {
        p: "Yes. Grace House is staffed 24 hours a day, and most staff live on-site. Our team includes a board of directors, a program director, a house manager, an assistant house manager, and support staff. They enforce house rules and guidelines, oversee safety, coordinate activities and meetings, and help residents with their support needs.",
      },
    ],
  },
  {
    question: "What does a day at Grace House look like?",
    answer: [
      {
        p: "Residents follow a set daily schedule posted on the announcement board outside the office. Staff read it aloud every morning during morning inspiration. The schedule includes:",
      },
      {
        list: [
          "Narcotics Anonymous and Alcoholics Anonymous meetings",
          "Study groups, peer support groups, and life skills groups",
          "Bible studies and morning inspiration",
          "Weekly church",
          "Anger management",
        ],
      },
      {
        p: "Residents are also expected to shower daily, complete daily chores, and do a weekly deep clean of the house.",
      },
    ],
  },
  {
    question: "Are residents required to attend appointments?",
    answer: [
      {
        p: "Yes. Residents keep all medical, dental, court, probation, Department of Human Services, mental health, and Social Security appointments. Appointments are added to the business list at our house meetings on Monday, Wednesday, and Friday.",
      },
    ],
  },
  {
    question: "Can residents use their phones or leave the house?",
    answer: [
      {
        p: "New residents have a two-week blackout from all electronics, including cell phones and the internet. For the first 30 days, residents may only go out escorted by staff, case managers, or senior residents, never alone. After 30 days, residents must either look for work or attend school.",
      },
    ],
  },
  {
    question: "Are there curfews or passes?",
    answer: [
      {
        p: "Yes. Residents have a nightly curfew and can earn weekend passes that build over time, in 3-, 6-, 9-, and 12-hour increments. Passes can be used to attend meetings and spend time with family. We’re passionate about family reunification and work hard to help residents regain their family units.",
      },
    ],
  },
  {
    question: "How does Grace House serve the community?",
    answer: [
      {
        p: "We hold outreach events throughout the week, including a weekly feeding of our unhoused neighbors and a monthly senior breakfast. We also help neighbors with yard work, moving, and other needs, and we pitch in at community events whenever we can.",
      },
    ],
  },
  {
    question: "What happens after graduation?",
    answer: [
      {
        p: "Graduates remain part of the Grace House family. Many return to teach or attend classes, join outreach events, sponsor current residents, or come home for dinner.",
      },
    ],
  },
];