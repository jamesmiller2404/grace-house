import type { CollectionConfig } from "payload";

/**
 * Upcoming events — the Payload version of `EventItem`/`EventDetail` in
 * `src/content/events.ts` (each field maps 1:1 to that file's fields).
 *
 * The admin panel (/admin/collections/events) gives you:
 *  - an ordered list of all events (default sort: date, soonest first)
 *  - "Create New" form to add an upcoming event with all relevant info
 *    plus the image that accompanies the event page
 *  - delete buttons on the list view and the edit view
 */
export const Events: CollectionConfig = {
  slug: "events",
  labels: {
    singular: "Event",
    plural: "Events",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "startTime", "location", "city", "cost"],
  },
  // Default order in the admin list view: soonest event first.
  defaultSort: "date",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      admin: {
        description: "One-line description shown on cards and under the title.",
      },
    },
    {
      name: "status",
      type: "select",
      options: ["Upcoming", "Past", "Cancelled"],
      defaultValue: "Upcoming",
      required: true,
    },
    {
      name: "date",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "startTime",
      type: "text",
      required: true,
      admin: {
        description: 'e.g. "4:00 PM"',
      },
    },
    {
      name: "endTime",
      type: "text",
      admin: {
        description: 'e.g. "6:00 PM"',
      },
    },
    {
      name: "location",
      type: "text",
      label: "Venue",
      required: true,
      admin: {
        description: 'e.g. "Grace House"',
      },
    },
    {
      name: "city",
      type: "text",
      admin: {
        description: 'e.g. "Sacramento, CA"',
      },
    },
    {
      name: "cost",
      type: "text",
      defaultValue: "Free",
      admin: {
        description: 'e.g. "Free"',
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description: "Image shown on the event page.",
      },
    },
    {
      name: "about",
      type: "array",
      labels: {
        singular: "Paragraph",
        plural: "About Event",
      },
      fields: [
        {
          name: "text",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "whatToExpect",
      type: "array",
      labels: {
        singular: "Paragraph",
        plural: "What to Expect",
      },
      fields: [
        {
          name: "text",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "contact",
      type: "group",
      fields: [
        {
          name: "phone",
          type: "text",
          admin: {
            description: 'e.g. "(916) 555-5555"',
          },
        },
        {
          name: "email",
          type: "email",
        },
      ],
    },
  ],
};
