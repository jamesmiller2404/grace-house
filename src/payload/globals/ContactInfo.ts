import type { GlobalConfig } from "payload";

/**
 * Contact info — the admin panel page (/admin/globals/contact-info) where an
 * editor manages the site's phone numbers, email addresses and physical
 * addresses.
 *
 * Three lists are managed here:
 *  - "Phone Numbers", "Emails" and "Addresses", each a list of rows the
 *    editor can add to, remove from and reorder (drag a row, or use its
 *    "..." menu's Move Up / Move Down on a phone).
 *  - every row pairs a Label (what this contact point is used for — e.g.
 *    "Office", "Intake", "Church", "Mailing Address") with the number or
 *    address itself.
 *
 * Only one document exists; the seed (src/payload/seed.ts -> seedContactInfo)
 * fills it the first time with the organization's current number, address
 * and location, and an editor adds more rows from there.
 */
export const ContactInfo: GlobalConfig = {
  slug: "contact-info",
  label: "Contact Info",
  // Public site content — allow anonymous reads of the REST API.
  access: {
    read: () => true,
    update: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "editor",
  },
  admin: {
    description:
      "The site's phone numbers, email addresses and physical addresses. Add as many as needed — give each one a label (e.g. Office, Intake, Church, Mailing Address) so it's clear what it's for. Reorder rows by dragging, or with the '...' menu's Move Up / Move Down.",
    // Custom Edit view wrapper that paints the admin panel style the other
    // panels use (photoshop_assets/adminPanelMockup1.png and
    // adminPanelMockup1_homePageLayout.png): the #111115 page background and
    // the rounded #2d2d33 / #414141 cards that each contact row becomes — the
    // same palette as the Home Page Layout, Events and Hero pages. The same
    // elements are repainted for the Light theme.
    components: {
      views: {
        edit: {
          default: {
            Component: {
              path: "./src/payload/globals/ContactInfo/EditView.tsx",
            },
          },
        },
      },
      // "Cancel" and "Done" buttons next to Save — a global renders its
      // document controls bar from `elements` (not `edit`, which collections
      // use), in array order before the Save button, so the bar reads
      // "Cancel | Done | Save" like the Home Page Layout and Events pages.
      // Both return to the admin dashboard, since a global has no list view
      // to go back to.
      elements: {
        beforeDocumentControls: [
          {
            path: "./src/payload/globals/ContactInfo/CancelToDashboardButton.tsx",
          },
          {
            path: "./src/payload/globals/ContactInfo/DoneToDashboardButton.tsx",
          },
        ],
      },
    },
  },
  fields: [
    {
      name: "phoneNumbers",
      type: "array",
      labels: {
        singular: "Phone Number",
        plural: "Phone Numbers",
      },
      admin: {
        // Keep rows open so the label and the number are visible at a glance.
        initCollapsed: false,
        // Friendly row labels ("Office — (916) 470-0408") instead of Payload's
        // default "Phone Number 01" — see ./ContactInfo/RowLabel.tsx.
        components: {
          RowLabel: {
            path: "./src/payload/globals/ContactInfo/RowLabel.tsx",
          },
        },
      },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Label",
          admin: {
            description:
              'What this number is for — e.g. "Office", "Intake", "Donations".',
          },
        },
        {
          name: "value",
          type: "text",
          required: true,
          label: "Phone Number",
          admin: {
            description: "The phone number as it should be shown — e.g. (916) 470-0408.",
          },
        },
      ],
    },
    {
      name: "emails",
      type: "array",
      labels: {
        singular: "Email",
        plural: "Emails",
      },
      admin: {
        // Keep rows open so the label and the address are visible at a glance.
        initCollapsed: false,
        // Friendly row labels ("Office — gracehouse6121@gmail.com") instead of
        // Payload's default "Email 01" — see ./ContactInfo/RowLabel.tsx.
        components: {
          RowLabel: {
            path: "./src/payload/globals/ContactInfo/RowLabel.tsx",
          },
        },
      },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Label",
          admin: {
            description:
              'What this address is for — e.g. "Office", "Intake", "Volunteers".',
          },
        },
        {
          name: "value",
          type: "email",
          required: true,
          label: "Email Address",
          admin: {
            description: "The email address — e.g. gracehouse6121@gmail.com.",
          },
        },
      ],
    },
    {
      name: "addresses",
      type: "array",
      labels: {
        singular: "Address",
        plural: "Addresses",
      },
      admin: {
        // Keep rows open so the label and the address are visible at a glance.
        initCollapsed: false,
        // Friendly row labels ("Grace House — 6121 Marwick Way, Carmichael, CA
        // 95608") instead of Payload's default "Address 01" — see
        // ./ContactInfo/RowLabel.tsx (addresses share the phone/email shape).
        components: {
          RowLabel: {
            path: "./src/payload/globals/ContactInfo/RowLabel.tsx",
          },
        },
      },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Label",
          admin: {
            description:
              'What this address is — e.g. "Grace House", "Church", "Mailing Address".',
          },
        },
        {
          // Same field name as the phone/email lists ("value") so all three
          // lists share the { label, value } row shape — and with it the
          // shared RowLabel above and the toRegisteredContacts mapping in
          // src/payload/queries.ts.
          name: "value",
          type: "textarea",
          required: true,
          label: "Address",
          admin: {
            description:
              "The address as it should be shown — e.g. 6121 Marwick Way, Carmichael, CA 95608.",
          },
        },
      ],
    },
  ],
};
