import type { CollectionConfig } from 'payload'

/**
 * Admin users for the Payload panel (/admin). Payload handles the email and
 * password columns automatically via `auth: true` — this config only adds the
 * extra fields we care about.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
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
      defaultValue: 'admin',
      required: true,
    },
  ],
}

