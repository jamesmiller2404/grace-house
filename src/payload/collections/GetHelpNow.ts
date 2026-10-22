import type { CollectionConfig } from "payload";

import { ContactSelectField } from "@/payload/fields/ContactSelect";

/**
 * "Get Help Now" strip — the Payload version of `helpStripDefaults` in
 * `src/content/helpStrip.ts` (each field maps 1:1 to the HelpStrip section's
 * props). The same strip renders on the front page and the standalone
 * /get-help page (both read it through src/payload/queries.ts), so the admin
 * panel is the single source of truth and the two can never drift apart.
 *
 * The admin panel (/admin/collections/get-help-now) gives an editor:
 *  - the main heading ("Need help now?") and the opening line
 *  - the phone number (picked from the numbers registered in the Contact Info
 *    panel, or entered manually) and the office hours shown beneath it
 *  - the checklist of quick facts (✓ lines) on the right
 *  - the 24/7 crisis-resources heading and its three lines
 *  - the "Show assessment call-to-action" checkbox — untick it to hide the
 *    assessment sentence ("Or you can fill out the assessment below..."),
 *    the Start Assessment button and its note ("← Fill out the Grace House
 *    Assessment Form") from the strip
 *
 * Only one document should exist here; the site reads the first one.
 */
export const GetHelpNow: CollectionConfig = {
  slug: "get-help-now",
  labels: {
    singular: "Get Help Now",
    plural: "Get Help Now",
  },
  // Public site content — allow anonymous reads of the REST API.
  // (The site itself reads through the Local API, which bypasses
  // access control; this opens the public /api/get-help-now endpoint.)
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
    useAsTitle: "heading",
    defaultColumns: ["heading", "phoneChoice", "showAssessment", "updatedAt"],
    description:
      'The "Get Help Now" strip, shown on the front page and the /get-help page: the heading, the phone number (picked from the Contact Info panel or entered manually) and office hours, the quick facts, the 24/7 crisis resources, and the assessment call-to-action toggle.',
    // Custom Edit view wrapper that paints the mockup frame
    // (photoshop_assets/adminPanelMockup1.png) — the same #111115 page
    // background, rounded #2d2d33 panel around the fields and #101012 input
    // boxes as the Events, Hero and Intro create/edit pages. The same
    // elements are repainted for the Light theme.
    components: {
      views: {
        edit: {
          default: {
            Component: {
              path: "./src/payload/collections/GetHelpNow/EditView.tsx",
            },
          },
        },
      },
      // "Cancel" and "Done" buttons next to Save on the create/edit pages —
      // they render in the document controls bar (before the Save button, in
      // array order) so the bar reads "Cancel | Done | Save", exactly like
      // the Events and Hero pages. Cancel returns to the admin dashboard;
      // Done returns to the Get Help Now list.
      edit: {
        beforeDocumentControls: [
          {
            path: "./src/payload/collections/GetHelpNow/CancelToDashboardButton.tsx",
          },
          {
            path: "./src/payload/collections/GetHelpNow/DoneToListButton.tsx",
          },
        ],
      },
    },
  },
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
      // Placeholder-only look, like the Events form (the required marker is
      // painted by the Edit view — see ./GetHelpNow/EditView.tsx).
      label: false,
      admin: {
        placeholder: "Heading...",
        description: 'The strip\'s main heading (e.g. "Need help now?").',
      },
    },
    {
      name: "body",
      type: "textarea",
      required: true,
      label: false,
      admin: {
        placeholder: "Opening line...",
        description:
          'The opening line (e.g. "You don\'t have to figure this out alone. Talk to a real person.").',
      },
    },
    // The assessment toggle — the option that turns the whole assessment
    // call-to-action (sentence + button + note) off in one tick.
    {
      name: "showAssessment",
      type: "checkbox",
      defaultValue: true,
      label: "Show assessment call-to-action",
      admin: {
        description:
          "Untick to hide the assessment sentence, the Start Assessment button and its note from the strip.",
      },
    },
    // The assessment pieces — only visible while the toggle is ticked.
    {
      name: "assessmentNote",
      type: "textarea",
      label: "Assessment sentence",
      admin: {
        placeholder: "Assessment sentence...",
        description:
          'The sentence shown after the opening line (e.g. "Or you can fill out the assessment below and we will contact you within two business days.").',
        condition: (_data, sibling) => sibling?.showAssessment !== false,
      },
    },
    {
      name: "ctaLabel",
      type: "text",
      label: "Button label",
      admin: {
        placeholder: "Start Assessment",
        description: 'The assessment button text (e.g. "Start Assessment").',
        condition: (_data, sibling) => sibling?.showAssessment !== false,
      },
    },
    {
      name: "ctaHref",
      type: "text",
      label: "Button link",
      admin: {
        placeholder: "/assessment",
        description: 'Where the assessment button links to (e.g. "/assessment").',
        condition: (_data, sibling) => sibling?.showAssessment !== false,
      },
    },
    {
      name: "ctaNote",
      type: "text",
      label: "Button note",
      admin: {
        placeholder: "Fill out the Grace House Assessment Form",
        description:
          'The note next to the button (e.g. "Fill out the Grace House Assessment Form").',
        condition: (_data, sibling) => sibling?.showAssessment !== false,
      },
    },
    // Phone + hours, shown beneath the button. The phone is a picker of the
    // numbers registered in the Contact Info panel (a live reference — edit
    // the number there and this strip follows) with an "Other (enter
    // manually)" choice; the tel: link is derived at render time
    // (src/payload/queries.ts), so there is no link field to keep in sync.
    ContactSelectField("phone", {
      name: "phoneChoice",
      required: true,
      label: "Phone number",
      admin: {
        placeholder: "(916) 470-0408",
        description:
          'The phone number shown after "or call". Pick one registered in the Contact Info panel, or enter a custom one.',
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
    {
      name: "hours",
      type: "text",
      required: true,
      label: "Office hours",
      admin: {
        placeholder: "Mon–Fri, 9am–5pm",
        description: "The office hours shown under the phone number.",
      },
    },
    // The quick facts (the ✓ lines) on the right of the strip.
    {
      name: "facts",
      type: "array",
      labels: {
        singular: "Fact",
        plural: "Quick Facts",
      },
      admin: {
        description: "The ✓ lines shown on the right of the strip.",
      },
      fields: [
        {
          name: "text",
          type: "textarea",
          required: true,
          label: false,
          admin: {
            placeholder: "Fact...",
          },
        },
      ],
    },
    // The 24/7 crisis resources at the bottom of the strip.
    {
      name: "crisisTitle",
      type: "text",
      label: "Crisis heading",
      admin: {
        placeholder: "RESOURCES THAT ARE AVAILABLE 24/7",
        description:
          'The heading above the crisis resources (e.g. "RESOURCES THAT ARE AVAILABLE 24/7").',
      },
    },
    {
      name: "crisisLines",
      type: "array",
      labels: {
        singular: "Crisis Line",
        plural: "Crisis Lines",
      },
      admin: {
        description: "The 24/7 crisis resources shown at the bottom of the strip.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: false,
          admin: {
            placeholder: "Label... (e.g. Emergency or overdose)",
          },
        },
        {
          name: "text",
          type: "text",
          required: true,
          label: false,
          admin: {
            placeholder: "Text... (e.g. Call 911)",
          },
        },
        {
          name: "href",
          type: "text",
          required: true,
          label: false,
          admin: {
            placeholder: "Link... (e.g. tel:911)",
          },
        },
      ],
    },
  ],
};

