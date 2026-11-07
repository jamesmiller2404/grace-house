import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_stories_body_type" ADD VALUE 'Photo';
    ALTER TYPE "public"."enum_events_blocks_type" ADD VALUE 'Photo';
    ALTER TYPE "public"."enum_donate_blocks_type" ADD VALUE 'Photo';

    ALTER TABLE "stories_body" ALTER COLUMN "text" DROP NOT NULL;
    ALTER TABLE "stories_body" ADD COLUMN "image_id" integer;
    ALTER TABLE "stories_body" ADD COLUMN "caption" varchar;
    ALTER TABLE "stories_body" ADD CONSTRAINT "stories_body_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "stories_body_image_idx" ON "stories_body" USING btree ("image_id");

    ALTER TABLE "events_blocks" ALTER COLUMN "text" DROP NOT NULL;
    ALTER TABLE "events_blocks" ADD COLUMN "image_id" integer;
    ALTER TABLE "events_blocks" ADD COLUMN "caption" varchar;
    ALTER TABLE "events_blocks" ADD CONSTRAINT "events_blocks_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "events_blocks_image_idx" ON "events_blocks" USING btree ("image_id");

    ALTER TABLE "donate_blocks" ALTER COLUMN "text" DROP NOT NULL;
    ALTER TABLE "donate_blocks" ADD COLUMN "image_id" integer;
    ALTER TABLE "donate_blocks" ADD COLUMN "caption" varchar;
    ALTER TABLE "donate_blocks" ADD CONSTRAINT "donate_blocks_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "donate_blocks_image_idx" ON "donate_blocks" USING btree ("image_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "stories_body" SET "type" = 'Paragraph', "text" = '' WHERE "type" = 'Photo';
    UPDATE "events_blocks" SET "type" = 'Paragraph', "text" = '' WHERE "type" = 'Photo';
    UPDATE "donate_blocks" SET "type" = 'Paragraph', "text" = '' WHERE "type" = 'Photo';
    UPDATE "stories_body" SET "text" = '' WHERE "text" IS NULL;
    UPDATE "events_blocks" SET "text" = '' WHERE "text" IS NULL;
    UPDATE "donate_blocks" SET "text" = '' WHERE "text" IS NULL;

    DROP INDEX "stories_body_image_idx";
    ALTER TABLE "stories_body" DROP CONSTRAINT "stories_body_image_id_media_id_fk";
    ALTER TABLE "stories_body" DROP COLUMN "image_id";
    ALTER TABLE "stories_body" DROP COLUMN "caption";
    ALTER TABLE "stories_body" ALTER COLUMN "text" SET NOT NULL;

    DROP INDEX "events_blocks_image_idx";
    ALTER TABLE "events_blocks" DROP CONSTRAINT "events_blocks_image_id_media_id_fk";
    ALTER TABLE "events_blocks" DROP COLUMN "image_id";
    ALTER TABLE "events_blocks" DROP COLUMN "caption";
    ALTER TABLE "events_blocks" ALTER COLUMN "text" SET NOT NULL;

    DROP INDEX "donate_blocks_image_idx";
    ALTER TABLE "donate_blocks" DROP CONSTRAINT "donate_blocks_image_id_media_id_fk";
    ALTER TABLE "donate_blocks" DROP COLUMN "image_id";
    ALTER TABLE "donate_blocks" DROP COLUMN "caption";
    ALTER TABLE "donate_blocks" ALTER COLUMN "text" SET NOT NULL;

    ALTER TABLE "stories_body" ALTER COLUMN "type" DROP DEFAULT;
    ALTER TABLE "stories_body" ALTER COLUMN "type" TYPE text USING "type"::text;
    DROP TYPE "public"."enum_stories_body_type";
    CREATE TYPE "public"."enum_stories_body_type" AS ENUM('Paragraph', 'Heading');
    ALTER TABLE "stories_body" ALTER COLUMN "type" TYPE "public"."enum_stories_body_type" USING "type"::"public"."enum_stories_body_type";
    ALTER TABLE "stories_body" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_stories_body_type";

    ALTER TABLE "events_blocks" ALTER COLUMN "type" DROP DEFAULT;
    ALTER TABLE "events_blocks" ALTER COLUMN "type" TYPE text USING "type"::text;
    DROP TYPE "public"."enum_events_blocks_type";
    CREATE TYPE "public"."enum_events_blocks_type" AS ENUM('Paragraph', 'Heading');
    ALTER TABLE "events_blocks" ALTER COLUMN "type" TYPE "public"."enum_events_blocks_type" USING "type"::"public"."enum_events_blocks_type";
    ALTER TABLE "events_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_events_blocks_type";

    ALTER TABLE "donate_blocks" ALTER COLUMN "type" DROP DEFAULT;
    ALTER TABLE "donate_blocks" ALTER COLUMN "type" TYPE text USING "type"::text;
    DROP TYPE "public"."enum_donate_blocks_type";
    CREATE TYPE "public"."enum_donate_blocks_type" AS ENUM('Paragraph', 'Heading');
    ALTER TABLE "donate_blocks" ALTER COLUMN "type" TYPE "public"."enum_donate_blocks_type" USING "type"::"public"."enum_donate_blocks_type";
    ALTER TABLE "donate_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_donate_blocks_type";
  `)
}
