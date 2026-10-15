import type { GlobalConfig } from "payload";

import { ContactSelectField } from "@/payload/fields/ContactSelect";

/**
 * Footer contact — the admin panel page (/admin/globals/footer) where an
 * editor picks the phone number, email address and street address shown in
 * the site footer's "Get Help" column.
 *
 * All three are pickers of the numbers/addresses registered in the Contact
 * Info panel (/admin/globals/contact-info) — the same pickers the Get Help
 * Now collection uses — with an "Other (enter manually)" choice for a
 * one-off contact point that isn't registered there.
 *
 * Picking a registered entry stores a live reference (not a copy): edit the
 * number once in the Contact Info panel and the footer follows. The tel: and
 * mailto: links are derived automatically from the chosen values, so there
 * are no link fields to keep in sync.
 *
 * Only one document exists; the site reads it through the Local API
 * (src/payload/queries.ts -> getFooterContact), which falls back to the
 * first registered entry, then to the static defaults in src/content/site.ts,
 * so the footer never breaks even before this global is filled in.
 */
export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  // Public site content — allow anonymous reads of the REST API.
  access: {
    read: () => true,
  },
  admin: {
    description:
      "The phone number, email address and street address shown in the footer's 'Get Help' column. Pick each one from the entries registered in the Contact Info panel (editing them there updates the footer automatically), or choose 'Other (enter manually)' for a one-off.",
    // Custom Edit view wrapper that paints the admin panel style the other
    // panels use (photoshop_assets/adminPanelMockup1.png): the #111115 page
    // background, the rounded #2d2d33 panel around the fields and the #101012
    // input boxes and pickers — the same palette as the Get Help Now, Events
    // and Hero pages. The same elements are repainted for the Light theme.
    components: {
      views: {
        edit: {
          default: {
            Component: {
              path: "./src/payload/globals/Footer/EditView.tsx",
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
            path: "./src/payload/globals/Footer/CancelToDashboardButton.tsx",
          },
          {
            path: "./src/payload/globals/Footer/DoneToDashboardButton.tsx",
          },
        ],
      },
    },
  },
  fields: [
    ContactSelectField("phone", {
      name: "phoneChoice",
      required: true,
      label: "Phone number",
      admin: {
        description:
          "The phone number shown in the footer. Pick one registered in the Contact Info panel, or enter a custom one.",
      },
    }),
    {
      name: "phoneCustom",
      type: "text",
      label: "Custom phone number",
      admin: {
        placeholder: "(916) 470-0408",
        description:
          "The custom phone number — e.g. (916) 470-0408. The tel: link is derived automatically.",
        // Only shown (and only validated) when "Other (enter manually)" is
        // the picked choice — Payload skips validation of hidden fields.
        condition: (_data, sibling) => sibling?.phoneChoice === "custom",
      },
    },
    ContactSelectField("email", {
      name: "emailChoice",
      required: true,
      label: "Email address",
      admin: {
        description:
          "The email address shown in the footer. Pick one registered in the Contact Info panel, or enter a custom one.",
      },
    }),
    {
      name: "emailCustom",
      type: "email",
      label: "Custom email address",
      admin: {
        placeholder: "gracehouse6121@gmail.com",
        description:
          "The custom email address — e.g. gracehouse6121@gmail.com. The mailto: link is derived automatically.",
        condition: (_data, sibling) => sibling?.emailChoice === "custom",
      },
    },
    ContactSelectField("address", {
      name: "addressChoice",
      required: true,
      label: "Address",
      admin: {
        description:
          "The address shown in the footer below the office hours. Pick one registered in the Contact Info panel, or enter a custom one.",
      },
    }),
    {
      name: "addressCustom",
      type: "textarea",
      label: "Custom address",
      admin: {
        placeholder: "6121 Marwick Way, Carmichael, CA 95608",
        description:
          "The custom address — e.g. 6121 Marwick Way, Carmichael, CA 95608.",
        // Only shown (and only validated) when "Other (enter manually)" is
        // the picked choice — Payload skips validation of hidden fields.
        condition: (_data, sibling) => sibling?.addressChoice === "custom",
      },
    },
  ],
};
