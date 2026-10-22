
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,

  access: {
    admin: ({ req }) => req.user?.role === 'admin',
    create: () => false,
    read: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: () => false,
  },

  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
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
        update: () => false,
      },
    },
  ],
}
