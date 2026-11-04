import type { CollectionConfig } from 'payload'

export const Faq: CollectionConfig = {
  slug: 'faq',
  labels: { singular: 'Common Question', plural: 'Common Questions' },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order', 'published', 'updatedAt'],
    // Custom Edit view wrapper that paints the mockup frame
    // (photoshop_assets/adminPanelMockup1.png) — the same #111115 page
    // background, rounded #2d2d33 panel around the fields and #101012 input
    // boxes as the Events and Custom Pages create/edit pages. The same
    // elements are repainted for the Light theme.
    components: {
      views: {
        edit: {
          default: {
            Component: {
              path: './src/payload/collections/Faq/EditView.tsx',
            },
          },
        },
      },
      // "Cancel" and "Done" buttons next to Save on the create/edit pages —
      // they render in the document controls bar (before the Save button, in
      // array order) so the bar reads "Cancel | Done | Save", exactly like
      // the Events and Custom Pages pages. Cancel returns to the admin
      // dashboard; Done returns to the Faq list.
      edit: {
        beforeDocumentControls: [
          {
            path: './src/payload/collections/Faq/CancelToDashboardButton.tsx',
          },
          {
            path: './src/payload/collections/Faq/DoneToListButton.tsx',
          },
        ],
      },
    },
  },
  defaultSort: 'order',
  access: {
    // Public visitors only see published items; logged-in staff see everything
    read: ({ req: { user } }) => (user ? true : { published: { equals: true } }),
  },
  hooks: {
    beforeChange: [
      async ({ operation, data, req }) => {
        // On create, default the order to the last existing order + 10
        // (or 10 if there are no entries yet), so new questions always
        // appear after the current list instead of always defaulting to 100.
        if (operation === 'create' && data.order === undefined) {
          const { docs } = await req.payload.find({
            collection: 'faq',
            sort: '-order',
            limit: 1,
          });
          data.order = (docs?.[0]?.order ?? 0) + 10;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: false,
      admin: {
        placeholder: 'Question...',
      },
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      label: false,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: async ({ req }) => {
        const { docs } = await req.payload.find({
          collection: 'faq',
          sort: '-order',
          limit: 1,
        });
        return (docs?.[0]?.order ?? 0) + 10;
      },
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first (10, 20, 30...). Defaults to the last order + 10 on create.',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}