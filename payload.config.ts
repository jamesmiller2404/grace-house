import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";

import { Events } from "@/payload/collections/Events";
import { Media } from "@/payload/collections/Media";
import { Users } from "@/payload/collections/Users";
import { seedEvents } from "@/payload/seed";

export default buildConfig({
  collections: [Users, Events, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } }),
  typescript: { outputFile: "payload-types.ts" },
  // On first init, seed the events that already exist in the app
  // (src/content/events.ts) so the admin panel starts with real data.
  onInit: async (payload) => {
    try {
      const { totalDocs } = await payload.count({ collection: "events" });
      if (totalDocs === 0) {
        await seedEvents(payload);
      }
    } catch (error) {
      payload.logger.warn(
        "Seed: skipped (could not check the events collection).",
      );
      payload.logger.debug({ error });
    }
  },
});
