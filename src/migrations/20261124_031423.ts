import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_events_blocks_type" ADD VALUE 'Video';
  ALTER TYPE "public"."enum_stories_body_type" ADD VALUE 'Video';
  ALTER TYPE "public"."enum_feeding_the_streets_blocks_type" ADD VALUE 'Video';
  ALTER TYPE "public"."enum_intro_blocks_type" ADD VALUE 'Video';
  ALTER TYPE "public"."enum_donate_blocks_type" ADD VALUE 'Video';
  ALTER TYPE "public"."enum_custom_pages_blocks_type" ADD VALUE 'Video';
  ALTER TABLE "events_blocks" ADD COLUMN "video_url" varchar;
  ALTER TABLE "stories_body" ADD COLUMN "video_url" varchar;
  ALTER TABLE "feeding_the_streets_blocks" ADD COLUMN "video_url" varchar;
  ALTER TABLE "intro_blocks" ADD COLUMN "video_url" varchar;
  ALTER TABLE "donate_blocks" ADD COLUMN "video_url" varchar;
  ALTER TABLE "custom_pages_blocks" ADD COLUMN "video_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
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
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_feeding_the_streets_blocks_type";
  CREATE TYPE "public"."enum_feeding_the_streets_blocks_type" AS ENUM('Heading', 'Paragraph', 'Photo');
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_feeding_the_streets_blocks_type";
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_feeding_the_streets_blocks_type" USING "type"::"public"."enum_feeding_the_streets_blocks_type";
  ALTER TABLE "intro_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "intro_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_intro_blocks_type";
  CREATE TYPE "public"."enum_intro_blocks_type" AS ENUM('Heading', 'Paragraph', 'Photo');
  ALTER TABLE "intro_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_intro_blocks_type";
  ALTER TABLE "intro_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_intro_blocks_type" USING "type"::"public"."enum_intro_blocks_type";
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
  ALTER TABLE "events_blocks" DROP COLUMN "video_url";
  ALTER TABLE "stories_body" DROP COLUMN "video_url";
  ALTER TABLE "feeding_the_streets_blocks" DROP COLUMN "video_url";
  ALTER TABLE "intro_blocks" DROP COLUMN "video_url";
  ALTER TABLE "donate_blocks" DROP COLUMN "video_url";
  ALTER TABLE "custom_pages_blocks" DROP COLUMN "video_url";`)
}
