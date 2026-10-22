import type { CollectionConfig } from "payload";
import { ImagePositionField } from "@/payload/fields/ImagePosition";
import { StatusSelectField } from "@/payload/fields/StatusSelect";
import { pillars } from "@/content/pillars";

/**
 * Lives Changed / Stories — the Payload version of `StoryProfile` in
 * `src/content/storyProfiles.ts` and `StoryItem` in `src/content/stories.ts`
 * (each field maps 1:1 to those files' fields).
 *
 * The admin panel (/admin/collections/stories) gives an editor the full set of
 * fields for one person's story:
 *  - the photo (portrait), the name and the role (Graduate / Volunteer / Staff)
 *  - the hero pull quote
 *  - the story body — an ordered list of Paragraph and Heading blocks (the
 *    first paragraph gets the drop cap on the site)
 *  - the second pull quote for the full-width banner, with its attribution
 *  - the pillar of the Four Pillars that mattered most to the person
 *  - the card fields shown in the Lives Changed index (graduation date, short
 *    quote, read label)
 *  - the closing "Where they are today" section, pronouns and the memories
 *    photo gallery
 *
 * The front page "Lives Changed" section, the /stories index and every
 * /stories/<slug> page read from this collection (see src/payload/queries.ts),
 * so the admin panel is the single source of truth.
 */
export const Stories: CollectionConfig = {
  slug: "stories",
  labels: {
    singular: "Story",
    plural: "Lives Changed",
  },
  // Public site content — allow anonymous reads of the REST API.
  // (The site itself reads through the Local API, which bypasses access
  // control; this opens the public /api/stories endpoint.)
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
    useAsTitle: "name",
    defaultColumns: ["name", "role", "date", "pillar"],
    description:
      "The Lives Changed section: the people of Grace House — graduates, volunteers and staff — in their own words.",
    // Custom Edit view wrapper that paints the mockup frame
    // (photoshop_assets/adminPanelMockup1.png): the same #111115 page
    // background, rounded #2d2d33 panel around the fields and #101012 input
    // boxes as the Events and Intro create/edit pages. The same elements are
    // repainted for the Light theme.
    components: {
      views: {
        edit: {
          default: {
            Component: {
              path: "./src/payload/collections/Stories/EditView.tsx",
            },
          },
        },
      },
      // "Cancel" and "Done" buttons next to Save on the create/edit pages —
      // they render in the document controls bar (before the Save button, in
      // array order) so the bar reads "Cancel | Done | Save", exactly like
      // the Events and Intro pages. Cancel returns to the admin dashboard;
      // Done returns to the Stories list.
      edit: {
        beforeDocumentControls: [
          {
            path: "./src/payload/collections/Stories/CancelToDashboardButton.tsx",
          },
          {
            path: "./src/payload/collections/Stories/DoneToListButton.tsx",
          },
        ],
      },
    },
  },
  // Default order in the admin list view: by name.
  defaultSort: "name",
  fields: [
    // Name (wide) + Role dropdown (top right), like the Events mockup's first
    // row (Title + Status).
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          // Placeholder-only look, like the Events and Intro forms (the
          // required marker is painted by the Edit view — see
          // ./Stories/EditView.tsx).
          label: false,
          admin: {
            placeholder: "Name...",
            width: "75%",
          },
        },
        {
          // Plain dropdown (not Payload's default searchable combobox) —
          // see src/payload/fields/StatusSelect.
          ...StatusSelectField({
            name: "role",
            options: ["Graduate", "Volunteer", "Staff"],
            defaultValue: "Graduate",
            required: true,
            admin: {
              width: "25%",
            },
          }),
        },
      ],
    },
    {
      // The portrait photo. Optional — the site falls back to a placeholder
      // image when it is empty.
      name: "image",
      type: "upload",
      relationTo: "media",
      label: false,
      admin: {
        description: "The portrait photo shown in the story hero.",
      },
    },
    {
      // The horizontal half of the image composition — driven by the
      // draggable preview on imagePositionY, so it stays out of the UI.
      name: "imagePositionX",
      type: "number",
      label: "Image Position X (%)",
      defaultValue: 50,
      min: 0,
      max: 100,
      admin: {
        hidden: true,
      },
    },
    {
      // The story hero renders the photo in a 4/5 portrait frame (see
      // src/components/StoryProfile.tsx).
      ...ImagePositionField(
        {
          name: "imagePositionY",
          label: false,
          defaultValue: 50,
          min: 0,
          max: 100,
        },
        { aspectRatio: "4 / 5" },
      ),
    },
    {
      name: "pullQuote",
      type: "text",
      label: false,
      admin: {
        placeholder: "Pull quote...",
        description: "The pull quote shown in the story hero.",
      },
    },
    {
      // The story body: an ordered list of Paragraph and Heading blocks. The
      // site renders headings as subheadings and paragraphs as body text, and
      // gives the first paragraph the drop cap (see
      // src/components/StoryProfile.tsx).
      name: "body",
      type: "array",
      required: true,
      minRows: 1,
      labels: {
        singular: "Block",
        plural: "Story Body",
      },
      admin: {
        // Keep every block open so the paragraph/heading order is visible at
        // a glance.
        initCollapsed: false,
        description:
          "Add paragraphs and headings in the order they should appear. The first paragraph gets the drop cap on the site.",
        // Friendly row labels ("1. Paragraph") instead of Payload's default
        // "Block 01" — see ./Stories/BodyRowLabel.tsx.
        components: {
          RowLabel: {
            path: "./src/payload/collections/Stories/BodyRowLabel.tsx",
          },
        },
      },
      fields: [
        {
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
      ],
    },
    {
      // The second pull quote — the full-width banner band on the story page.
      name: "bannerQuote",
      type: "group",
      label: "Banner Pull Quote",
      admin: {
        description: "The full-width pull-quote band on the story page.",
      },
      fields: [
        {
          name: "quote",
          type: "text",
          label: false,
          admin: {
            placeholder: "Quote...",
          },
        },
        {
          name: "attribution",
          type: "text",
          label: false,
          admin: {
            placeholder: "Attribution... (e.g. Maria — Grace House Graduate)",
          },
        },
      ],
    },
    {
      // Which of the Four Pillars mattered most to this person. The options
      // come from src/content/pillars.ts so the labels stay in sync.
      ...StatusSelectField({
        name: "pillar",
        options: pillars.map((pillar) => pillar.title),
        defaultValue: pillars[0].title,
        required: true,
        admin: {
          description: "The pillar that mattered most to this person.",
        },
      }),
    },
    {
      // The graduation date on the card and in the list view.
      name: "date",
      type: "text",
      label: false,
      admin: {
        placeholder: "Graduation date... (MM/DD/YYYY or MM/YYYY)",
        description:
          "Shown on the story card and in the list view (e.g. 05/30/2026 or 03/2019).",
      },
    },
    {
      // The short quote shown on the card and in the list view.
      name: "excerpt",
      type: "text",
      label: false,
      admin: {
        placeholder: "Short card quote...",
        description:
          "The short pull quote shown on the story card and in the list view.",
      },
    },
    {
      // The text of the card's link (e.g. "Read her story").
      name: "readLabel",
      type: "text",
      label: false,
      admin: {
        placeholder: "Read her story...",
        description: "The card link text (e.g. Read her story).",
      },
    },
    {
      // The closing section at the end of the story page.
      name: "closing",
      type: "group",
      label: "Where They Are Today",
      admin: {
        description:
          "The closing section of the story page (e.g. Where she is today).",
      },
      fields: [
        {
          name: "heading",
          type: "text",
          label: false,
          admin: {
            placeholder: "Heading... (e.g. Where she is today)",
          },
        },
        {
          name: "paragraphs",
          type: "array",
          labels: {
            singular: "Paragraph",
            plural: "Paragraphs",
          },
          fields: [
            {
              name: "text",
              type: "textarea",
              required: true,
              label: false,
              admin: {
                placeholder: "Paragraph...",
              },
            },
          ],
        },
      ],
    },
    {
      // Grammar for copy like "shared her story" / "Read her story".
      name: "pronouns",
      type: "group",
      label: "Pronouns",
      admin: {
        description:
          "Used for copy like Read her story / shared her story.",
      },
      fields: [
        {
          name: "subject",
          type: "text",
          label: false,
          admin: {
            placeholder: "Subject... (e.g. she)",
          },
        },
        {
          name: "possessive",
          type: "text",
          label: false,
          admin: {
            placeholder: "Possessive... (e.g. her)",
          },
        },
      ],
    },
    {
      // The personal photos in the "{name}'s memories..." gallery.
      name: "memories",
      type: "array",
      labels: {
        singular: "Photo",
        plural: "Memories Gallery",
      },
      admin: {
        description: "The personal photos shown in the memories gallery.",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
          label: false,
          admin: {
            description: "A personal photo.",
          },
        },
        {
          name: "alt",
          type: "text",
          label: false,
          admin: {
            placeholder: "Alt text...",
            description: "Describe the photo for screen readers.",
          },
        },
        {
          name: "caption",
          type: "text",
          label: false,
          admin: {
            placeholder: "Caption...",
          },
        },
      ],
    },
  ],
};
