import type { CollectionConfig } from "payload";
import { StatusSelectField } from "@/payload/fields/StatusSelect";

/**
 * Donate page copy — the Payload version of `donateDefaults` in
 * `src/content/donate.ts` (each field maps 1:1 to that type's fields).
 *
 * The admin panel (/admin/collections/donate) gives an editor:
 *  - the page Title and intro paragraph
 *  - the PayPal card: heading, the sentence split around the email link,
 *    the email, and the donate button
 *  - the Venmo card: heading, the sentence split around the username link,
 *    the username and its profile URL, and the donate button
 *  - the 501(c)(3) note, with its phone number
 *  - content sections: generic headings with paragraphs under them (each
 *    paragraph may carry one optional link)
 *
 * Only one document should exist here; the site reads the first one.
 */
export const Donate: CollectionConfig = {
  slug: "donate",
  labels: {
    singular: "Donate",
    plural: "Donate",
  },
  // Public site content — allow anonymous reads of the REST API.
  // (The site itself reads through the Local API, which bypasses
  // access control; this opens the public /api/donate endpoint.)
  access: {
    read: () => true,
    create: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "editor",
    update: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "editor",
    delete: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "editor",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "updatedAt"],
    description:
      "The Donate page (/support): the title and intro, the PayPal and Venmo cards, the 501(c)(3) note and the content sections (generic headings and paragraphs).",
    // Custom Edit view wrapper that paints the mockup frame
    // (photoshop_assets/adminPanelMockup1.png) — the same #111115 page
    // background, rounded #2d2d33 panel around the fields and #101012 input
    // boxes as the Events and Hero create/edit pages. The same elements are
    // repainted for the Light theme.
    components: {
      views: {
        edit: {
          default: {
            Component: {
              path: "./src/payload/collections/Donate/EditView.tsx",
            },
          },
        },
      },
      // "Cancel" and "Done" buttons next to Save on the create/edit pages —
      // they render in the document controls bar (before the Save button, in
      // array order) so the bar reads "Cancel | Done | Save", exactly like
      // the Events and Hero pages. Cancel returns to the admin dashboard;
      // Done returns to the Donate list.
      edit: {
        beforeDocumentControls: [
          {
            path: "./src/payload/collections/Donate/CancelToDashboardButton.tsx",
          },
          {
            path: "./src/payload/collections/Donate/DoneToListButton.tsx",
          },
        ],
      },
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      // Placeholder-only look, like the Events and Hero forms (the required
      // marker is painted by the Edit view — see ./Donate/EditView.tsx).
      label: false,
      admin: {
        placeholder: "Title...",
        description:
          'The page heading (e.g. "Donate to Grace House") and breadcrumb label.',
      },
    },
    {
      name: "intro",
      type: "textarea",
      required: true,
      label: false,
      admin: {
        placeholder: "Intro text...",
        description: "The paragraph shown under the heading.",
      },
    },
    {
      // The PayPal card. Its sentence renders as bodyStart + email link +
      // bodyEnd, so the editor writes the two halves and never touches HTML.
      name: "paypal",
      type: "group",
      label: "PayPal Card",
      fields: [
        {
          name: "heading",
          type: "text",
          required: true,
          label: false,
          admin: {
            placeholder: "Card heading... (e.g. PayPal)",
            description: "The PayPal card's heading.",
          },
        },
        {
          name: "bodyStart",
          type: "text",
          label: false,
          admin: {
            placeholder: "Sentence before the link...",
            description:
              'The sentence before the email link (e.g. "...you can do so directly via PayPal using").',
          },
        },
        {
          name: "email",
          type: "text",
          label: false,
          admin: {
            placeholder: "PayPal email...",
            description: "The PayPal email, shown as a mailto link.",
          },
        },
        {
          name: "bodyEnd",
          type: "text",
          label: false,
          admin: {
            placeholder: "Text after the link...",
            description:
              'The text after the email link (e.g. "or click the following button.").',
          },
        },
        {
          name: "buttonLabel",
          type: "text",
          required: true,
          label: false,
          admin: {
            placeholder: "Button label... (e.g. Donate with PayPal)",
            description: "The card's donate button text.",
          },
        },
        {
          name: "buttonHref",
          type: "text",
          required: true,
          label: false,
          admin: {
            placeholder: "Button URL...",
            description:
              "The PayPal donation URL. The button opens it in a new tab.",
          },
        },
      ],
    },
    {
      // The Venmo card — same sentence-split pattern as the PayPal card.
      name: "venmo",
      type: "group",
      label: "Venmo Card",
      fields: [
        {
          name: "heading",
          type: "text",
          required: true,
          label: false,
          admin: {
            placeholder: "Card heading... (e.g. Venmo)",
            description: "The Venmo card's heading.",
          },
        },
        {
          name: "bodyStart",
          type: "text",
          label: false,
          admin: {
            placeholder: "Sentence before the link...",
            description:
              'The sentence before the username link (e.g. "...you can do so via Venmo with the username").',
          },
        },
        {
          name: "username",
          type: "text",
          label: false,
          admin: {
            placeholder: "Venmo username... (e.g. @Gracehouse-NorCal)",
            description: "The Venmo username, shown as a link to the profile.",
          },
        },
        {
          name: "profileHref",
          type: "text",
          required: true,
          label: false,
          admin: {
            placeholder: "Profile URL...",
            description:
              "The Venmo profile URL. The username link and the donate button open it in a new tab.",
          },
        },
        {
          name: "bodyEnd",
          type: "text",
          label: false,
          admin: {
            placeholder: "Text after the link...",
            description: 'The text after the username link (e.g. ".").',
          },
        },
        {
          name: "buttonLabel",
          type: "text",
          required: true,
          label: false,
          admin: {
            placeholder: "Button label... (e.g. Donate with Venmo)",
            description: "The card's donate button text.",
          },
        },
        {
          name: "buttonHref",
          type: "text",
          required: true,
          label: false,
          admin: {
            placeholder: "Button URL...",
            description:
              "The Venmo URL the donate button opens in a new tab (usually the profile URL).",
          },
        },
      ],
    },
    {
      // The 501(c)(3) note: text, then the phone number as a tel: link.
      name: "note",
      type: "group",
      label: "501(c)(3) Note",
      fields: [
        {
          name: "text",
          type: "textarea",
          label: false,
          admin: {
            placeholder: "Note text...",
            description:
              "The nonprofit note, without the phone number (it renders after the text).",
          },
        },
        {
          name: "phone",
          type: "text",
          label: false,
          admin: {
            placeholder: "Phone number...",
            description: "The phone number shown as a tel: link.",
          },
        },
        {
          name: "phoneHref",
          type: "text",
          label: false,
          admin: {
            placeholder: "Phone URL... (e.g. tel:+19164700408)",
            description: "Where the phone link points.",
          },
        },
      ],
    },
    {
      // Additional content at the bottom of the page: an ordered list of text
      // blocks, each either a Heading or a Paragraph (the same text-block
      // pattern as the Stories body), so headings and paragraphs can be added
      // and stacked in any order. A block may carry one optional link after
      // its text. The live page's "Underground Clothing Connection" copy is
      // seeded as these blocks.
      name: "blocks",
      type: "array",
      labels: {
        singular: "Block",
        plural: "Text Blocks",
      },
      admin: {
        // Keep every block open so the paragraph/heading order is visible at
        // a glance.
        initCollapsed: false,
        description:
          "Add headings and paragraphs in the order they should appear. Newlines render as line breaks (e.g. \"Hours:\\nWednesdays: 11am to 4pm.\"). To turn words into a link, fill in the two Link fields on the block; leave both empty for plain text.",
        // Friendly row labels ("1. Heading: Underground Clothing Connection")
        // instead of Payload's default "Block 01" — see ./Donate/BlockRowLabel.tsx.
        components: {
          RowLabel: {
            path: "./src/payload/collections/Donate/BlockRowLabel.tsx",
          },
        },
      },
      fields: [
        {
          // The same Heading/Paragraph dropdown the Stories body blocks use.
          ...StatusSelectField({
            name: "type",
            options: ["Paragraph", "Heading"],
            defaultValue: "Paragraph",
            required: true,
          }),
        },
        {
          name: "text",
          type: "textarea",
          required: true,
          label: false,
          admin: {
            placeholder: "Text...",
          },
        },
        {
          name: "linkLabel",
          type: "text",
          label: "Link Text (optional)",
          admin: {
            placeholder: "e.g. (916) 470-0408 or Facebook",
            description:
              "The clickable words shown after the block's text. Example: for the text \"Call us at\" this would be \"(916) 470-0408\". Leave empty for a plain paragraph with no link.",
          },
        },
        {
          name: "linkHref",
          type: "text",
          label: "Link URL (optional)",
          admin: {
            placeholder: "e.g. tel:+19169529797 or https://example.com",
            description:
              "Where the link goes. Use https://... for a website (opens in a new tab), tel:+1... for a phone number (opens the phone's dialer) or mailto:... for an email (opens the mail app). Only used when Link Text is filled in.",
          },
        },
      ],
    },
  ],
};