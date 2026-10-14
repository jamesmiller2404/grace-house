import { site } from "./site";

/**
 * Donate page (/support) content — the Payload version lives in the `donate`
 * collection (each field maps 1:1 to that collection's fields). These are the
 * defaults the page falls back to before the database has a document, and the
 * values the seed writes on first run.
 *
 * The PayPal / Venmo cards split their sentence around the link ("...via
 * PayPal using <email> or click the following button."), so the editor writes
 * the sentence in two parts with the link between them — no rich text needed.
 */
export type DonatePage = {
  /** The page heading and breadcrumb label. */
  title: string;
  /** The paragraph under the heading. */
  intro: string;
  paypal: {
    heading: string;
    /** Sentence before the email link. */
    bodyStart: string;
    /** Shown as a mailto link between bodyStart and bodyEnd. */
    email: string;
    /** Text after the email link. */
    bodyEnd: string;
    buttonLabel: string;
    /** The PayPal donation URL (opens in a new tab). */
    buttonHref: string;
  };
  venmo: {
    heading: string;
    /** Sentence before the username link. */
    bodyStart: string;
    /** Shown as a link to profileHref between bodyStart and bodyEnd. */
    username: string;
    /** Text after the username link. */
    bodyEnd: string;
    buttonLabel: string;
    /** The Venmo profile URL (username link and the donate button's fallback). */
    profileHref: string;
    /** The Venmo URL the donate button opens (usually the profile URL). */
    buttonHref: string;
  };
  /** The 501(c)(3) note — phone link rendered after the text. */
  note: {
    text: string;
    phone: string;
    phoneHref: string;
  };
  /**
   * Additional content under the note: an ordered list of text blocks, each
   * either a Heading or a Paragraph, stacked in the order they appear. The
   * live page's "Underground Clothing Connection" copy is seeded as these
   * blocks. (The same text-block pattern as the Stories body.)
   */
  blocks: DonateBlock[];
};

/** One text block: a heading or a paragraph, with an optional link. */
export type DonateBlock = {
  /** Whether the block renders as a heading or a paragraph. */
  type: "Heading" | "Paragraph";
  /**
   * The block text. Newlines render as line breaks, so a labeled block
   * (e.g. "Hours:\nWednesdays: 11am to 4pm.") can share one block.
   */
  text: string;
  /** Optional link text shown after the block (punctuation may be included). */
  linkLabel?: string;
  /** Where the optional link points (opens in a new tab). */
  linkHref?: string;
};

export const donateDefaults: DonatePage = {
  title: "Donate to Grace House",
  intro:
    "Your generosity helps Grace House restore families and give hope to the hopeless. If you would like to donate to Grace House, you can do so via PayPal or Venmo below. Every gift makes a difference.",
  paypal: {
    heading: "PayPal",
    bodyStart:
      "If you would like to donate to the Grace House you can do so directly via PayPal using",
    email: site.paypal.email,
    bodyEnd: "or click the following button.",
    buttonLabel: "Donate with PayPal",
    buttonHref: site.paypal.donateHref,
  },
  venmo: {
    heading: "Venmo",
    bodyStart:
      "If you would like to donate to Grace House you can do so via Venmo with the username",
    username: site.venmo.username,
    bodyEnd: ".",
    buttonLabel: "Donate with Venmo",
    profileHref: site.venmo.profileHref,
    buttonHref: site.venmo.profileHref,
  },
  note: {
    text: "Grace House is a 501(c)(3) nonprofit organization. Thank you for supporting faith-based recovery in Northern California. For questions about donating, call us at",
    phone: site.phone,
    phoneHref: site.phoneHref,
  },
  blocks: [
    { type: "Heading", text: "Underground Clothing Connection" },
    {
      type: "Paragraph",
      text: "Grace House thanks you for your donations. We would like to see clothing donations go to those families who need them the most. As a result we would suggest that donations go to the Underground Clothing Connection in Sunrise Mall. It is a clothing school for homeless students and students in the San Juan Unified School District. The kids and their families are able to go shop for free clothing where they might not otherwise get clothes for school. This service is free. We feel this is the best way to donate right now. Thank you.",
    },
    {
      type: "Paragraph",
      text: "A free clothing store located in Sunrise Mall, exclusively for students and their families of San Juan Unified School District (by school referral only).",
    },
    {
      type: "Paragraph",
      text: "Hours:\nWednesdays: 11am to 4pm. Saturdays: 11am to 3pm.",
    },
    {
      type: "Paragraph",
      text: "Location:\n5932 Sunrise Mall, Citrus Heights, CA 95610 (Next to the theater inside Sunrise Mall)",
    },
    {
      type: "Paragraph",
      text: "Contact:",
      linkLabel: "916-952-9797",
      linkHref: "tel:+19169529797",
    },
    {
      type: "Paragraph",
      text: "Email:",
      linkLabel: "TheUnderground411@gmail.com",
      linkHref: "mailto:TheUnderground411@gmail.com",
    },
    {
      type: "Paragraph",
      text: "For Donations and Volunteer inquires please call or email.\nFollow them on",
      linkLabel: "Facebook.",
      linkHref: "https://www.facebook.com/TheUnderground411",
    },
    {
      type: "Paragraph",
      text: "For more information please visit their website:",
      linkLabel: "https://citrusheightshart.org/programs/underground-clothing-connection",
      linkHref: "https://citrusheightshart.org/programs/underground-clothing-connection",
    },
  ],
};