import type { CollectionConfig } from "payload";
import { ContactSelectField } from "@/payload/fields/ContactSelect";
import { ImagePositionField } from "@/payload/fields/ImagePosition";
import { BlockTypeButtonsField } from "@/payload/fields/BlockTypeButtons";
import { StatusSelectField } from "@/payload/fields/StatusSelect";
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
    create: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "editor",
    update: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "editor",
    delete: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "editor",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "startTime", "location", "city", "cost"],
    // Custom Edit view wrapper that paints the mockup frame
    // (photoshop_assets/adminPanelMockup1.png): #111115 page background,
    // rounded #2d2d33 panel around the fields, #101012 input boxes — the
    // DARK scheme. The same elements are repainted for the Light theme.
    components: {
      beforeList: [
        { path: "./src/payload/components/DashboardListButton.tsx" },
      ],
      views: {
        edit: {
          default: {
            Component: {
              path: "./src/payload/collections/Events/EditView.tsx",
            },
          },
        },
      },
      // "Cancel" and "Done" buttons next to Save on the create/edit pages —
      // they render in the document controls bar (before the Save button, in
      // array order) so the bar reads "Cancel | Done | Save". Cancel returns
      // to the admin dashboard; Done returns to the Events list.
      edit: {
        beforeDocumentControls: [
          {
            path: "./src/payload/collections/Events/CancelToDashboardButton.tsx",
          },
          {
            path: "./src/payload/collections/Events/DoneToListButton.tsx",
          },
        ],
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
          label: "Title",
          admin: {
            className: "gh-event-primary-field",
            placeholder: "Title...",
            width: "75%",
          },
        },
        {
          // Plain dropdown (not Payload's default searchable combobox) —
          // see src/payload/fields/StatusSelect.
          ...StatusSelectField({
            name: "status",
            options: ["Upcoming", "Past", "Cancelled"],
            defaultValue: "Upcoming",
            required: true,
            admin: {
              width: "25%",
            },
          }),
        },
      ],
    },
    {
      // Optional: an event can be saved without a one-line description —
      // the card and the event page simply skip the line when it's empty.
      name: "description",
      type: "textarea",
      label: "Description",
      admin: {
        className: "gh-event-primary-field",
        placeholder: "One-line description...",
      },
    },
    // Date is followed by the two time fields in their own stacked rows.
    {
      type: "row",
      fields: [
        {
          name: "date",
          type: "date",
          required: true,
          label: "Date",
          admin: {
            className: "gh-event-primary-field",
            placeholder: "Date...",
            date: {
              pickerAppearance: "dayOnly",
              displayFormat: "MMMM d, yyyy",
            },
          },
        },
      ],
    },
    {
      // Keep Start Time and End Time side by side while preserving the same
      // label and input alignment used by the other primary event fields.
      type: "row",
      admin: {
        className: "gh-event-time-row",
      },
      fields: [
        TimeField({
          name: "startTime",
          type: "text",
          label: "Start Time",
          admin: {
            className: "gh-event-primary-field",
            placeholder: "Start Time...",
            width: "100%",
          },
        }),
        TimeField({
          name: "endTime",
          type: "text",
          label: "End Time",
          admin: {
            className: "gh-event-primary-field",
            placeholder: "End Time...",
            width: "100%",
          },
        }),
      ],
    },
    {
      name: "location",
      type: "text",
      required: true,
      label: "Location",
      admin: {
        className: "gh-event-primary-field",
        placeholder: "Location...",
      },
    },
    {
      name: "city",
      type: "text",
      label: "Address",
      admin: {
        className: "gh-event-primary-field",
        placeholder: "Address...",
      },
    },
    {
      name: "cost",
      type: "text",
      label: "Cost",
      admin: {
        className: "gh-event-primary-field",
        placeholder: "Cost... (e.g. Free)",
      },
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
      }),
    },
    {
      name: "blocks",
      type: "array",
      labels: {
        singular: "Block",
        plural: "Content Blocks",
      },
      admin: {
        // Keep every block open so the paragraph/heading order is visible at
        // a glance.
        initCollapsed: false,
        description:
          "Add headers, paragraphs and photos in the order they should appear.",
        // Friendly row labels (e.g. "1. Heading: ...") instead of Payload's
        // default "Block 01" to see ./Events/BlockRowLabel.tsx.
        components: {
          RowLabel: {
            path: "./src/payload/collections/Events/BlockRowLabel.tsx",
          },
        },
      },
      fields: [
        {
          // The same Heading/Paragraph dropdown the Stories body blocks use.
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
            components: { Field: { path: "./src/payload/fields/BlockTextInput/Field.tsx" } },
            placeholder: "Text...",
          },
          validate: (value: unknown, { siblingData }: { siblingData?: unknown }) =>
            (siblingData as { type?: string } | undefined)?.type === "Photo" || (typeof value === "string" && value.trim().length > 0)
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
            description: "Choose the photo shown inline on the event page.",
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
    // Contact — the phone number and email shown on the event page's
    // "Contact" card. Both are pickers of the entries registered in the
    // Contact Info panel (/admin/globals/contact-info): picking a registered
    // entry stores a live reference (edit it there and every event using it
    // follows), and "Other (enter manually)" covers a one-off contact point.
    // Leaving a picker unset is fine — the event then shows the first
    // registered entry (see src/payload/queries.ts -> getEventBySlug).
    {
      name: "contact",
      type: "group",
      label: "Contact",
      fields: [
        ContactSelectField("phone", {
          name: "phoneChoice",
          label: false,
          admin: {
            placeholder: "Phone Number",
            description:
              "The phone number shown on the event page. Pick one registered in the Contact Info panel.",
          },
        }),
        {
          name: "phoneCustom",
          type: "text",
          label: false,
          admin: {
            placeholder: "Custom phone number",
            // Only shown when "Other (enter manually)" is the picked choice.
            condition: (_data, sibling) => sibling?.phoneChoice === "custom",
          },
        },
        ContactSelectField("email", {
          name: "emailChoice",
          label: false,
          admin: {
            placeholder: "Email",
            description:
              "The email address shown on the event page. Pick one registered in the Contact Info panel.",
          },
        }),
        {
          name: "emailCustom",
          type: "email",
          label: false,
          admin: {
            placeholder: "Custom email",
            // Only shown when "Other (enter manually)" is the picked choice.
            condition: (_data, sibling) => sibling?.emailChoice === "custom",
          },
        },
      ],
    },
  ],
};
