import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'

export default buildConfig({
  collections: [], // add collections next
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } }),
  typescript: { outputFile: 'payload-types.ts' },
})
