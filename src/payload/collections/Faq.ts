import type { CollectionConfig } from 'payload'

export const Faq: CollectionConfig = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order', 'published', 'updatedAt'],
  },
  defaultSort: 'order',
  access: {
    // Public visitors only see published items; logged-in staff see everything
    read: ({ req: { user } }) => (user ? true : { published: { equals: true } }),
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first (10, 20, 30...).',
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