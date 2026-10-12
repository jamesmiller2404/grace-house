import type { CollectionConfig } from "payload";
import { introColorLabels, introColorTokens } from "@/content/intro";

/**
 * Front-page Intro — the Payload version of the "What is Grace House" section
 * in `src/content/homePage.ts` (each field maps 1:1 to that section's props).
 *
 * The admin panel (/admin/collections/intro) gives an editor:
 *  - the title heading ("What is Grace House")
 *  - the body text
 *  - the pull quote (the italic tail of the body sentence)
 *  - the link text and where it points
 *  - the section background, text, link and link-hover colors
 *
 * Only one document should exist here; the site reads the first one.
 */

/** The four color fields offer the same set of design-token choices. */
const colorOptions = introColorTokens.map((value) => ({
  label: introColorLabels[value],
  value,
}));

export const Intro: CollectionConfig = {
  slug: "intro",
  labels: {
    singular: "Intro",
    plural: "Intro",
  },
  // Public site content — allow anonymous reads of the REST API.
  // (The site itself reads through the Local API, which bypasses
  // access control; this opens the public /api/intro endpoint.)
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "heading",
    defaultColumns: ["heading", "updatedAt"],
    description:
      'The "What is Grace House" section on the home page: its heading, body text, link and colors.',
  },
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
      admin: {
        description: 'The section heading (e.g. "What is Grace House").',
      },
    },
    {
      name: "body",
      type: "textarea",
      required: true,
      admin: {
        description: "The main paragraph shown under the heading.",
      },
    },
    {
      name: "pullQuote",
      type: "text",
      admin: {
        description:
          'Optional italic tail of the body sentence (e.g. "to see families restored and give hope to the hopeless.").',
      },
    },
    {
      name: "linkLabel",
      type: "text",
      admin: {
        description:
          'The text of the link below the paragraph (e.g. "Read our mission").',
      },
    },
    {
      name: "linkHref",
      type: "text",
      admin: {
        description: 'Where the link points (e.g. "/about/mission").',
      },
    },
    {
      name: "bgColor",
      type: "select",
      defaultValue: "cream",
      options: colorOptions,
      admin: {
        description: "The section background color.",
      },
    },
    {
      name: "textColor",
      type: "select",
      defaultValue: "anchor",
      options: colorOptions,
      admin: {
        description: "The color of the heading and body text.",
      },
    },
    {
      name: "linkColor",
      type: "select",
      defaultValue: "terra",
      options: colorOptions,
      admin: {
        description: "The color of the link.",
      },
    },
    {
      name: "linkHoverColor",
      type: "select",
      defaultValue: "lift",
      options: colorOptions,
      admin: {
        description: "The color of the link while the pointer is over it.",
      },
    },
  ],
};
