import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "events_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_events_blocks_type";
  CREATE TYPE "public"."enum_events_blocks_type" AS ENUM('Heading', 'Paragraph', 'Photo');
  ALTER TABLE "events_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_events_blocks_type";
  ALTER TABLE "events_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_events_blocks_type" USING "type"::"public"."enum_events_blocks_type";
  ALTER TABLE "stories_body" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "stories_body" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_stories_body_type";
  CREATE TYPE "public"."enum_stories_body_type" AS ENUM('Heading', 'Paragraph', 'Photo');
  ALTER TABLE "stories_body" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_stories_body_type";
  ALTER TABLE "stories_body" ALTER COLUMN "type" SET DATA TYPE "public"."enum_stories_body_type" USING "type"::"public"."enum_stories_body_type";
  ALTER TABLE "donate_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "donate_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_donate_blocks_type";
  CREATE TYPE "public"."enum_donate_blocks_type" AS ENUM('Heading', 'Paragraph', 'Photo');
  ALTER TABLE "donate_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_donate_blocks_type";
  ALTER TABLE "donate_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_donate_blocks_type" USING "type"::"public"."enum_donate_blocks_type";
  ALTER TABLE "custom_pages_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "custom_pages_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_custom_pages_blocks_type";
  CREATE TYPE "public"."enum_custom_pages_blocks_type" AS ENUM('Heading', 'Paragraph', 'Photo');
  ALTER TABLE "custom_pages_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_custom_pages_blocks_type";
  ALTER TABLE "custom_pages_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_custom_pages_blocks_type" USING "type"::"public"."enum_custom_pages_blocks_type";
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_feeding_the_streets_blocks_type";
  CREATE TYPE "public"."enum_feeding_the_streets_blocks_type" AS ENUM('Heading', 'Paragraph', 'Photo');
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_feeding_the_streets_blocks_type";
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_feeding_the_streets_blocks_type" USING "type"::"public"."enum_feeding_the_streets_blocks_type";
  ALTER TABLE "stories" ALTER COLUMN "show_pillar" SET DEFAULT false;
  ALTER TABLE "stories" ALTER COLUMN "show_pillar" DROP NOT NULL;
  ALTER TABLE "stories" ALTER COLUMN "pillar" SET DEFAULT 'Select a pillar...';
  ALTER TABLE "stories" ALTER COLUMN "pillar" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "events_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_events_blocks_type";
  CREATE TYPE "public"."enum_events_blocks_type" AS ENUM('Paragraph', 'Heading', 'Photo');
  ALTER TABLE "events_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_events_blocks_type";
  ALTER TABLE "events_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_events_blocks_type" USING "type"::"public"."enum_events_blocks_type";
  ALTER TABLE "stories_body" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "stories_body" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_stories_body_type";
  CREATE TYPE "public"."enum_stories_body_type" AS ENUM('Paragraph', 'Heading', 'Photo');
  ALTER TABLE "stories_body" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_stories_body_type";
  ALTER TABLE "stories_body" ALTER COLUMN "type" SET DATA TYPE "public"."enum_stories_body_type" USING "type"::"public"."enum_stories_body_type";
  ALTER TABLE "donate_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "donate_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_donate_blocks_type";
  CREATE TYPE "public"."enum_donate_blocks_type" AS ENUM('Paragraph', 'Heading', 'Photo');
  ALTER TABLE "donate_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_donate_blocks_type";
  ALTER TABLE "donate_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_donate_blocks_type" USING "type"::"public"."enum_donate_blocks_type";
  ALTER TABLE "custom_pages_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "custom_pages_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_custom_pages_blocks_type";
  CREATE TYPE "public"."enum_custom_pages_blocks_type" AS ENUM('Paragraph', 'Heading', 'Photo');
  ALTER TABLE "custom_pages_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_custom_pages_blocks_type";
  ALTER TABLE "custom_pages_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_custom_pages_blocks_type" USING "type"::"public"."enum_custom_pages_blocks_type";
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_feeding_the_streets_blocks_type";
  CREATE TYPE "public"."enum_feeding_the_streets_blocks_type" AS ENUM('Paragraph', 'Heading', 'Photo');
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_feeding_the_streets_blocks_type";
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_feeding_the_streets_blocks_type" USING "type"::"public"."enum_feeding_the_streets_blocks_type";
  ALTER TABLE "stories" ALTER COLUMN "show_pillar" SET DEFAULT false;
  ALTER TABLE "stories" ALTER COLUMN "show_pillar" SET NOT NULL;
  ALTER TABLE "stories" ALTER COLUMN "pillar" DROP DEFAULT;
  ALTER TABLE "stories" ALTER COLUMN "pillar" SET NOT NULL;`)
}
