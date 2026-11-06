import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,

  access: {
    admin: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    create: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
    // Custom Edit view wrapper that paints the mockup frame:
    // #111115 page background, rounded #2d2d33 panel around the fields,
    // #101012 input boxes — the DARK scheme. The same elements are repainted
    // for the Light theme.
    components: {
      views: {
        edit: {
          default: {
            Component: {
              path: "./src/payload/collections/UsersEditView.tsx",
            },
          },
        },
      },
      // "Cancel" and "Done" buttons next to Save on the create/edit pages —
      // they render in the document controls bar (before the Save button, in
      // array order) so the bar reads "Cancel | Done | Save". Cancel returns
      // to the previous screen; Done returns to the Users list.
      edit: {
        beforeDocumentControls: [
          {
            path: "./src/payload/collections/UsersCancelToDashboardButton.tsx",
          },
          {
            path: "./src/payload/collections/UsersDoneToListButton.tsx",
          },
        ],
      },
    },
  },

  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'editor'],
      defaultValue: 'editor',
      required: true,
      access: {
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
}
