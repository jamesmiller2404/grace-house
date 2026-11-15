import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "mission_page"
      ALTER COLUMN "body" DROP NOT NULL;

    ALTER TABLE "donate"
      ALTER COLUMN "intro" DROP NOT NULL;

    ALTER TABLE "events_blocks"
      ADD COLUMN "content" jsonb;

    ALTER TABLE "mission_page"
      ADD COLUMN "body_content" jsonb;

    ALTER TABLE "stories_body"
      ADD COLUMN "content" jsonb;

    ALTER TABLE "donate_blocks"
      ADD COLUMN "content" jsonb;

    ALTER TABLE "donate"
      ADD COLUMN "intro_content" jsonb;

    ALTER TABLE "donate"
      ADD COLUMN "note_content" jsonb;

    ALTER TABLE "custom_pages_blocks"
      ADD COLUMN "content" jsonb;

    ALTER TABLE "get_help_now"
      ADD COLUMN "body_content" jsonb;

    ALTER TABLE "get_help_now"
      ADD COLUMN "assessment_note_content" jsonb;

    ALTER TABLE "feeding_the_streets_blocks"
      ADD COLUMN "content" jsonb;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Restore the previous NOT NULL constraints safely.
    UPDATE "mission_page" SET "body" = '' WHERE "body" IS NULL;
    UPDATE "donate" SET "intro" = '' WHERE "intro" IS NULL;

    ALTER TABLE "mission_page"
      ALTER COLUMN "body" SET NOT NULL;

    ALTER TABLE "donate"
      ALTER COLUMN "intro" SET NOT NULL;

    ALTER TABLE "events_blocks" DROP COLUMN "content";
    ALTER TABLE "mission_page" DROP COLUMN "body_content";
    ALTER TABLE "stories_body" DROP COLUMN "content";
    ALTER TABLE "donate_blocks" DROP COLUMN "content";
    ALTER TABLE "donate" DROP COLUMN "intro_content";
    ALTER TABLE "donate" DROP COLUMN "note_content";
    ALTER TABLE "custom_pages_blocks" DROP COLUMN "content";
    ALTER TABLE "get_help_now" DROP COLUMN "body_content";
    ALTER TABLE "get_help_now" DROP COLUMN "assessment_note_content";
    ALTER TABLE "feeding_the_streets_blocks" DROP COLUMN "content";
  `)
}
