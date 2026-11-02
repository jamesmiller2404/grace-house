import { getPayload } from 'payload';
import config from '@payload-config';
import { seedFAQ } from './src/payload/seed.ts';

// Ensure env vars are set (normally loaded from .env by Next.js)
if (!process.env.PAYLOAD_SECRET) {
  process.env.PAYLOAD_SECRET = '569c5f0f8854cf464506644d9b0b24b72e4b0dc010290540d1b328500c96ca52';
}
if (!process.env.DATABASE_URI) {
  process.env.DATABASE_URI = 'postgres://postgres:Rolarin69*@127.0.0.1:5432/grace_house';
}

const payload = await getPayload({ config });
await seedFAQ(payload);
console.log('FAQ seeded successfully');
process.exit(0);
