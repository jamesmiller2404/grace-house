import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";

import { Events } from "@/payload/collections/Events";
import { Hero } from "@/payload/collections/Hero";
import { Intro } from "@/payload/collections/Intro";
import { Media } from "@/payload/collections/Media";
import { MissionPage } from "@/payload/collections/MissionPage";
import { Stories } from "@/payload/collections/Stories";
import { Users } from "@/payload/collections/Users";
import { Donate } from "@/payload/collections/Donate";
import { CustomPages } from "@/payload/collections/CustomPages";
import { GetHelpNow } from "@/payload/collections/GetHelpNow";
import { HomeLayout } from "@/payload/globals/HomeLayout";
import { ContactInfo } from "@/payload/globals/ContactInfo";
import { Footer } from "@/payload/globals/Footer";
import {
  seedEvents,
  seedHero,
  seedHomeLayout,
  seedIntro,
  seedMissionPage,
  seedStories,
  seedDonate,
  seedCustomPages,
  seedGetHelpNow,
  seedContactInfo,
  seedFooter,
} from "@/payload/seed";

const siteURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

const trustedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
  "https://mockup1.offworldcreations.com",
  "https://payload-app-nxg2.onrender.com",
];

export default buildConfig({
  collections: [Users, Events, Media, MissionPage, Hero, Intro, Stories, Donate, CustomPages, GetHelpNow],
  globals: [HomeLayout, ContactInfo, Footer],
  serverURL: siteURL,
  cors: trustedOrigins,
  csrf: trustedOrigins,
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
              // @aws-sdk/client-s3 >= 3.729 defaults to flexible checksums
              // ("WHEN_SUPPORTED" + CRC32). Cloudflare R2 does not implement
              // the resulting headers (`x-amz-checksum-algorithm` on
              // PutObject, `x-amz-checksum-mode` on GetObject/HeadObject), so
              // with the defaults every upload stalls/retries and every
              // proxied file request 500s. Only send/validate checksums when
              // the operation actually requires them.
              // See https://developers.cloudflare.com/r2/api/s3/api/ (Checksum Types)
              requestChecksumCalculation: "WHEN_REQUIRED",
              responseChecksumValidation: "WHEN_REQUIRED",
            },
          }),
        ]
      : []),
  ],
  // Gmail SMTP adapter for transactional emails (admin "Forgot Password").
  // Only enabled when SMTP variables are present, so local dev still boots
  // (and password resets simply can't send mail) without credentials.
  ...(process.env.SMTP_HOST
    ? {
        email: await nodemailerAdapter({
          defaultFromAddress:
            process.env.PAYLOAD_FROM_EMAIL || process.env.SMTP_USER!,
          defaultFromName: "Grace House",
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 465,
            secure: (Number(process.env.SMTP_PORT) || 465) === 465,
            auth: {
              user: process.env.SMTP_USER!,
              pass: process.env.SMTP_PASS!,
            },
          },
        }),
      }
    : []),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  // Keep the admin panel (dashboard, login, collections) out of search results.
  // Payload's per-view generateMetadata spreads admin.meta into the Next
  // metadata of every admin page, emitting the robots tag there.
  admin: {
    // Lock the admin panel to the dark scheme. Payload's default is `"all"`,
    // which lets every user pick Light / Dark / Auto in Account -> Settings
    // (the radio group rendered by Payload's ToggleTheme). Setting `"dark"`
    // forces the dark palette server-side (`data-theme="dark"` on <html>, no
    // cookie or OS lookup) and hides those Light / Dark / Auto options, so
    // the panel always matches the dark schemes in
    // src/app/(payload)/custom.css and the EditView palettes.
    theme: "dark",
    meta: {
      robots: "noindex, nofollow",
    },
    // Custom avatar for the account icon in the upper-right corner of the
    // admin panel (the icon that links to /admin/account): keeps Payload's
    // person icon and adds the logged-in user's name and access level
    // (admin / editor) beneath it.
    // See src/payload/components/AccountAvatar.tsx
    avatar: {
      Component: {
        path: "./src/payload/components/AccountAvatar.tsx",
      },
    },
  },
  typescript: { outputFile: "payload-types.ts" },
  // On first init, seed the collections that already have content in the app
  // (src/content/*.ts) so the admin panel starts with real data.
  onInit: async (payload) => {
    try {
      // Contact Info first — the events, footer and Get Help Now seeds below
      // pick their phone/email from the numbers/emails it registers.
      await seedContactInfo(payload);
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
      const stories = await payload.count({ collection: "stories" });
      if (stories.totalDocs === 0) {
        await seedStories(payload);
      }
      const donate = await payload.count({ collection: "donate" });
      if (donate.totalDocs === 0) {
        await seedDonate(payload);
      }
      const customPages = await payload.count({ collection: "custom-pages" });
      if (customPages.totalDocs === 0) {
        await seedCustomPages(payload);
      }
      // Contact Info is seeded at the top of this function; the footer and
      // Get Help Now seeds below pick their phone/email from its rows.
      const getHelpNow = await payload.count({ collection: "get-help-now" });
      if (getHelpNow.totalDocs === 0) {
        await seedGetHelpNow(payload);
      }
      await seedFooter(payload);
      await seedHomeLayout(payload);
    } catch (error) {
      payload.logger.warn(
        "Seed: skipped (could not check the events collection).",
      );
      payload.logger.debug({ error });
    }
  },
});
