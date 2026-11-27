import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events_blocks" ADD COLUMN IF NOT EXISTS "divider_image_path" varchar;
    ALTER TABLE "stories_body" ADD COLUMN IF NOT EXISTS "divider_image_path" varchar;
    ALTER TABLE "_stories_v_version_body" ADD COLUMN IF NOT EXISTS "divider_image_path" varchar;
    ALTER TABLE "feeding_the_streets_blocks" ADD COLUMN IF NOT EXISTS "divider_image_path" varchar;
    ALTER TABLE "intro_blocks" ADD COLUMN IF NOT EXISTS "divider_image_path" varchar;
    ALTER TABLE "mission_page_blocks" ADD COLUMN IF NOT EXISTS "divider_image_path" varchar;
    ALTER TABLE "donate_blocks" ADD COLUMN IF NOT EXISTS "divider_image_path" varchar;
    ALTER TABLE "custom_pages_blocks" ADD COLUMN IF NOT EXISTS "divider_image_path" varchar;

    ALTER TABLE "events_blocks" DROP COLUMN IF EXISTS "divider_image_id" CASCADE;
    ALTER TABLE "stories_body" DROP COLUMN IF EXISTS "divider_image_id" CASCADE;
    ALTER TABLE "_stories_v_version_body" DROP COLUMN IF EXISTS "divider_image_id" CASCADE;
    ALTER TABLE "feeding_the_streets_blocks" DROP COLUMN IF EXISTS "divider_image_id" CASCADE;
    ALTER TABLE "intro_blocks" DROP COLUMN IF EXISTS "divider_image_id" CASCADE;
    ALTER TABLE "mission_page_blocks" DROP COLUMN IF EXISTS "divider_image_id" CASCADE;
    ALTER TABLE "donate_blocks" DROP COLUMN IF EXISTS "divider_image_id" CASCADE;
    ALTER TABLE "custom_pages_blocks" DROP COLUMN IF EXISTS "divider_image_id" CASCADE;
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "divider_images_id" CASCADE;
    DROP TABLE IF EXISTS "divider_images" CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events_blocks" DROP COLUMN IF EXISTS "divider_image_path";
    ALTER TABLE "stories_body" DROP COLUMN IF EXISTS "divider_image_path";
    ALTER TABLE "_stories_v_version_body" DROP COLUMN IF EXISTS "divider_image_path";
    ALTER TABLE "feeding_the_streets_blocks" DROP COLUMN IF EXISTS "divider_image_path";
    ALTER TABLE "intro_blocks" DROP COLUMN IF EXISTS "divider_image_path";
    ALTER TABLE "mission_page_blocks" DROP COLUMN IF EXISTS "divider_image_path";
    ALTER TABLE "donate_blocks" DROP COLUMN IF EXISTS "divider_image_path";
    ALTER TABLE "custom_pages_blocks" DROP COLUMN IF EXISTS "divider_image_path";
  `)
}
