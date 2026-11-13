import type { CollectionConfig, PayloadRequest } from "payload";
import { storySlug } from "@/lib/storySlug";
import { ImagePositionField } from "@/payload/fields/ImagePosition";
import { BlockTypeButtonsField } from "@/payload/fields/BlockTypeButtons";
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
 *  - the closing "Where they are today" section and the memories photo gallery
 *  - gender-derived pronouns for generated profile links
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
    defaultColumns: ["name", "role", "gender", "date", "pillar"],
    description:
      "The Lives Changed section: the people of Grace House — graduates, volunteers and staff — in their own words.",
    // Custom Edit view wrapper that paints the mockup frame
    // (photoshop_assets/adminPanelMockup1.png): the same #111115 page
    // background, rounded #2d2d33 panel around the fields and #101012 input
    // boxes as the Events and Intro create/edit pages. The same elements are
    // repainted for the Light theme.
    components: {
      beforeList: [
        { path: "./src/payload/components/DashboardListButton.tsx" },
      ],
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
    {
      type: "ui",
      name: "storyPreview",
      admin: {
        components: {
          Field: {
            path: "./src/payload/collections/Stories/StoryPreviewField.tsx",
          },
        },
      },
    },
    // Keep the identity fields in a predictable vertical column at every
    // viewport width: Name, Role, conditional Other label, Gender, Date.
    {
      name: "name",
      type: "text",
      required: true,
      label: "Name",
      admin: {
        className: "gh-story-name-field",
        placeholder: "Name...",
      },
      // The public web address is derived from this name (see
      // src/lib/storySlug.ts), so two profiles with the same name — or two
      // names that produce the same URL segment — would silently share one
      // page: every link points at the same /stories/<slug> URL and only the
      // first story wins it (see getStoryProfileBySlug in
      // src/payload/queries.ts). Block that at save time, comparing the
      // derived slugs so case and punctuation differences are caught too.
      validate: async (
        value: string | null | undefined,
        { req, id }: { req: PayloadRequest; id?: number | string },
      ) => {
        const name = typeof value === "string" ? value.trim() : "";
        // Empty names are reported by required: true above.
        if (!name) return true;
        const slug = storySlug(name);
        if (!slug) return true;
        // Small collection — the same limit the story queries use.
        const { docs } = await req.payload.find({
          collection: "stories",
          limit: 100,
        });
        const clash = docs.find(
          (doc) => doc.id !== id && storySlug(doc.name) === slug,
        );
        return clash
          ? `Another profile ("${clash.name}") already uses this name — two profiles with the same name would share one web address. Please add something to distinguish them (for example a middle name).`
          : true;
      },
    },
    {
      // Plain dropdown (not Payload's default searchable combobox).
      ...StatusSelectField({
        name: "role",
        options: ["Graduate", "Volunteer", "Staff", "Other"],
        defaultValue: "Graduate",
        // Role defaults to Graduate, so omit Payload's required-field asterisk.
        // Keep validation so the field cannot be cleared before saving.
        required: false,
        admin: {
          className: "gh-story-role-field",
        },
        validate: (value: unknown) =>
          typeof value === "string" && value.trim()
            ? true
            : "Please select a role.",
      }),
    },
    {
      name: "roleLabel",
      type: "text",
      label: false,
      admin: {
        className: "gh-story-role-label-field",
        condition: (_data, siblingData) => siblingData?.role === "Other",
        placeholder: "Enter role label...",
        description: "Enter the role label displayed on this profile.",
      },
      validate: (
        value: string | string[] | null | undefined,
        { siblingData }: { siblingData?: { role?: string } },
      ) => {
        if (
          (siblingData?.role === "Other" &&
            typeof value === "string" &&
            !value) ||
          (typeof value === "string" && !value.trim())
        ) {
          return "Please enter a role label when Role is Other.";
        }
        return true;
      },
    },
    {
      // Optional so existing stories can be updated without guessing.
      ...StatusSelectField({
        name: "gender",
        options: ["Male", "Female"],
        admin: {
          className: "gh-story-gender-field",
        },
      }),
    },
    {
      // Graduation date appears beneath Gender in the same vertical column.
      // A standard Payload date field — the same picker the Events collection
      // uses (/admin/collections/events) — so the editing UI stays consistent.
      // Stores a real date timestamp; formatStoryDate renders it on the site.
      name: "date",
      type: "date",
      label: "Date",
      admin: {
        className: "gh-story-date-field",
        placeholder: "Date...",
        date: {
          pickerAppearance: "dayOnly",
              displayFormat: "MMMM d, yyyy",
        },
      },
    },
    {
      // The portrait photo. Optional — the site falls back to a placeholder
      // image when it is empty.
      name: "image",
      type: "upload",
      relationTo: "media",
      label: false,
      admin: {
            components: {
              Field: {
                path: "./src/payload/fields/MediaPickerUploadField.tsx",
              },
            },
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
      // The story body: an ordered list of Paragraph and Heading blocks. The
      // site renders headings as subheadings and paragraphs as body text, and
      // gives the first paragraph the drop cap (see
      // src/components/StoryProfile.tsx).
      name: "body",
      type: "array",
      label: "Their Story",
      labels: {
        singular: "Block",
        plural: "Story Blocks",
      },
      admin: {
        // Keep every block open so the paragraph/heading order is visible at
        // a glance.
        initCollapsed: false,
        description:
          "Add headers, paragraphs and photos in the order they should appear. The first paragraph gets the drop cap on the site.",
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
          ...BlockTypeButtonsField({
            name: "type",
            options: [
              { label: "Heading", value: "Heading" },
              { label: "Paragraph", value: "Paragraph" },
              { label: "Photo", value: "Photo" },
            ],
            defaultValue: "Paragraph",
            required: true,
          }),
        },
        {
          name: "text",
          type: "textarea",
          label: false,
          admin: {
            condition: (_data, siblingData) => (siblingData as { type?: string } | undefined)?.type !== "Photo",
            components: {
              Field: { path: "./src/payload/fields/BlockTextInput/Field.tsx" },
            },
            placeholder: "Text...",
          },
          validate: (value: unknown, { siblingData }: { siblingData?: unknown }) =>
            (siblingData as { type?: string } | undefined)?.type === "Photo" ||
            (typeof value === "string" && value.trim().length > 0)
              ? true
              : "Enter text for this Header or Paragraph block.",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: false,
          admin: {
            components: {
              Field: {
                path: "./src/payload/fields/MediaPickerUploadField.tsx",
              },
            },
            className: "gh-block-photo-input",
            condition: (_data, siblingData) => (siblingData as { type?: string } | undefined)?.type === "Photo",
            description: "Choose the photo shown inline in the story.",
          },
          validate: (value: unknown, { siblingData }: { siblingData?: unknown }) =>
            (siblingData as { type?: string } | undefined)?.type !== "Photo" || value
              ? true
              : "Choose a photo for this Photo block.",
        },
        {
          name: "caption",
          type: "text",
          label: false,
          admin: {
            condition: (_data, siblingData) => (siblingData as { type?: string } | undefined)?.type === "Photo",
            placeholder: "Photo caption (optional)...",
          },
        },
      ],
    },
    {
      name: "showPullQuote",
      type: "checkbox",
      label: "Include an Opening Pull Quote",
      defaultValue: false,
      admin: {
        className: "gh-opening-pull-quote-heading",
        description: "Check to show an opening pull quote next to the picture and on the summary card.",
      },
    },
    {
      name: "pullQuote",
      type: "text",
      label: false,
      admin: {
        condition: (data) => data?.showPullQuote === true,
        placeholder: "Opening pull quote...",
        description: "Opening pull quote placed next to the picture and on the summary card.",
      },
    },
    {
      name: "showBannerQuote",
      type: "checkbox",
      label: "Banner Pull Quote",
      defaultValue: false,
      admin: {
        className: "gh-banner-pull-quote-heading",
        description:
          "Check to display a full-width pull quote banner on this person's story page.",
      },
    },
    {
      // Optional full-width pull-quote band on the story page.
      name: "bannerQuote",
      type: "group",
      label: false,
      admin: {
        condition: (data) => data?.showBannerQuote === true,
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
      // The text of the card's link (e.g. "Read her story").
      name: "readLabel",
      type: "text",
      label: false,
      admin: {
        hidden: true,
      },
    },
    {
      // Retained for existing public profiles and backwards compatibility,
      // but removed from the editor as requested.
      name: "closing",
      type: "group",
      label: "Where They Are Today",
      admin: {
        hidden: true,
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
      // Kept in the database for backwards compatibility, but hidden from
      // editors. Public-facing pronouns are derived from the Gender field.
      name: "pronouns",
      type: "group",
      label: "Pronouns",
      admin: {
        hidden: true,
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
      name: "showMemories",
      type: "checkbox",
      label: "Their Photo Memories",
      defaultValue: false,
      admin: {
        className: "gh-photo-memories-heading",
        description: "Show a gallery of meaningful personal photos.",
      },
    },
    {
      // The personal photos in the "{name}'s memories..." gallery.
      name: "memories",
      type: "array",
      label: false,
      labels: {
        singular: "Photo",
        plural: "Memories Gallery",
      },
      admin: {
        className: "gh-memories-section",
        // The section heading above explains the purpose of this gallery.
        condition: (data) => data?.showMemories !== false,
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
          label: false,
          admin: {
            components: {
              Field: {
                path: "./src/payload/fields/MediaPickerUploadField.tsx",
              },
            },
            description: "Choose a memory photo.",
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
    {
      // Optional section: the checkbox controls whether the pillar appears
      // on the public profile.
      name: "showPillar",
      type: "checkbox",
      label: "The Pillar That Mattered Most to Them",
      defaultValue: false,
      admin: {
        className: "gh-pillar-heading",
        description:
          "Check to include the Most Important Pillar section on this person's profile.",
      },
    },
    {
      ...StatusSelectField({
        name: "pillar",
        label: false,
        options: [
          { label: "Select a pillar...", value: "Select a pillar..." },
          ...pillars.map((pillar) => ({
            label: pillar.title,
            value: pillar.title,
          })),
        ],
        defaultValue: "Select a pillar...",
        required: false,
        admin: {
          condition: (data) => data?.showPillar === true,
          description: "Choose the pillar that mattered most to this person.",
        },
        validate: (
          value: string | null | undefined,
          { siblingData }: { siblingData?: { showPillar?: boolean } },
        ) => {
          if (siblingData?.showPillar !== true) return true;
          return pillars.some((pillar) => pillar.title === value)
            ? true
            : "Choose a pillar before including this section.";
        },
      }),
    }
  ],
};
