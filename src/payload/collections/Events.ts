import type { CollectionConfig } from "payload";
import { ImagePositionField } from "@/payload/fields/ImagePosition";
import { TimeField } from "@/payload/fields/TimePicker";

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
  // Events are public site content — allow anonymous reads of the REST API.
  // (The site itself reads events through the Local API, which bypasses
  // access control; this opens the public /api/events endpoint.)
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "startTime", "location", "city", "cost"],
    // Custom Edit view wrapper that paints the mockup frame
    // (photoshop_assets/adminPanelMockup1.png): #111115 page background,
    // rounded #2d2d33 panel around the fields, #101012 input boxes.
    components: {
      views: {
        edit: {
          default: {
            Component: {
              path: "./src/payload/collections/Events/EditView.tsx",
            },
          },
        },
      },
    },
  },
  // Default order in the admin list view: soonest event first.
  defaultSort: "date",
  fields: [
    // Title (wide) + Status dropdown (top right), like the mockup's first row.
    {
      type: "row",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          label: false,
          admin: {
            placeholder: "Title...",
            width: "75%",
          },
        },
        {
          name: "status",
          type: "select",
          options: ["Upcoming", "Past", "Cancelled"],
          defaultValue: "Upcoming",
          required: true,
          admin: {
            width: "25%",
          },
        },
      ],
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: false,
      admin: {
        placeholder: "One-line description...",
      },
    },
    // Date + Start Time + End Time share one row in the mockup.
    {
      type: "row",
      fields: [
        {
          name: "date",
          type: "date",
          required: true,
          label: false,
          admin: {
            placeholder: "Date...",
            width: "33%",
            date: {
              pickerAppearance: "dayOnly",
            },
          },
        },
        {
          ...TimeField({
            name: "startTime",
            type: "text",
            required: true,
            label: false,
            admin: {
              placeholder: "Start Time...",
              width: "33%",
            },
          }),
        },
        {
          ...TimeField({
            name: "endTime",
            type: "text",
            label: false,
            admin: {
              placeholder: "End Time...",
              width: "33%",
            },
          }),
        },
      ],
    },
    {
      name: "location",
      type: "text",
      required: true,
      label: false,
      admin: {
        placeholder: "Location...",
      },
    },
    {
      name: "city",
      type: "text",
      label: false,
      admin: {
        placeholder: "Address...",
      },
    },
    {
      name: "cost",
      type: "text",
      defaultValue: "Free",
      label: false,
      admin: {
        placeholder: "Cost... (e.g. Free)",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: false,
      admin: {
        description:
          "Optional image shown on the event page and the event card.",
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
      ...ImagePositionField({
        name: "imagePositionY",
        label: false,
        defaultValue: 50,
        min: 0,
        max: 100,
        admin: {
          description:
            "Drag the preview to choose which part of the image shows in the event page frame.",
        },
      }),
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
          label: false,
          admin: {
            placeholder: "Add more information...",
          },
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
          label: false,
          admin: {
            placeholder: "What to Expect...",
          },
        },
      ],
    },
    {
      name: "contact",
      type: "group",
      label: "Contact",
      fields: [
        {
          name: "phone",
          type: "text",
          label: false,
          admin: {
            placeholder: "Phone Number",
          },
        },
        {
          name: "email",
          type: "email",
          label: false,
          admin: {
            placeholder: "Email",
          },
        },
      ],
    },
  ],
};
