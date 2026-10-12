import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";

import { Events } from "@/payload/collections/Events";
import { Hero } from "@/payload/collections/Hero";
import { Intro } from "@/payload/collections/Intro";
import { Media } from "@/payload/collections/Media";
import { MissionPage } from "@/payload/collections/MissionPage";
import { Users } from "@/payload/collections/Users";
import {
  seedEvents,
  seedHero,
  seedIntro,
  seedMissionPage,
} from "@/payload/seed";

const siteURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export default buildConfig({
  collections: [Users, Events, Media, MissionPage, Hero, Intro],
  serverURL: siteURL,
  cors: [siteURL],
  csrf: [siteURL],
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
    // Disable dev-time schema push so `next dev` never alters/drops columns.
    // Schema changes are managed through migrations (`payload migrate`).
    push: false,
  }),
  plugins: [
    // Only enabled when R2 variables are present (Render), so local dev
    // keeps using local disk without needing credentials.
    ...(process.env.R2_BUCKET
      ? [
          s3Storage({
            collections: { media: true }, // must match the slug in Media.ts
            bucket: process.env.R2_BUCKET,
            config: {
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
              },
              region: "auto",
              endpoint: process.env.R2_ENDPOINT,
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: "payload-types.ts" },
  // On first init, seed the events that already exist in the app
  // (src/content/events.ts) so the admin panel starts with real data.
  onInit: async (payload) => {
    try {
      const { totalDocs } = await payload.count({ collection: "events" });
      if (totalDocs === 0) {
        await seedEvents(payload);
      }
      const mission = await payload.count({ collection: "mission-page" });
      if (mission.totalDocs === 0) {
        await seedMissionPage(payload);
      }
      const hero = await payload.count({ collection: "hero" });
      if (hero.totalDocs === 0) {
        await seedHero(payload);
      }
      const intro = await payload.count({ collection: "intro" });
      if (intro.totalDocs === 0) {
        await seedIntro(payload);
      }
    } catch (error) {
      payload.logger.warn(
        "Seed: skipped (could not check the events collection).",
      );
      payload.logger.debug({ error });
    }
  },
});
