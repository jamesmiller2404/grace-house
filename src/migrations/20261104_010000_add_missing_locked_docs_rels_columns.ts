import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "events_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "mission_page_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "hero_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "intro_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "stories_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "donate_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "custom_pages_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "get_help_now_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faq_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "feeding_the_streets_id" integer;

    CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
    CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
    CREATE INDEX "payload_locked_documents_rels_mission_page_id_idx" ON "payload_locked_documents_rels" USING btree ("mission_page_id");
    CREATE INDEX "payload_locked_documents_rels_hero_id_idx" ON "payload_locked_documents_rels" USING btree ("hero_id");
    CREATE INDEX "payload_locked_documents_rels_intro_id_idx" ON "payload_locked_documents_rels" USING btree ("intro_id");
    CREATE INDEX "payload_locked_documents_rels_stories_id_idx" ON "payload_locked_documents_rels" USING btree ("stories_id");
    CREATE INDEX "payload_locked_documents_rels_donate_id_idx" ON "payload_locked_documents_rels" USING btree ("donate_id");
    CREATE INDEX "payload_locked_documents_rels_custom_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("custom_pages_id");
    CREATE INDEX "payload_locked_documents_rels_get_help_now_id_idx" ON "payload_locked_documents_rels" USING btree ("get_help_now_id");
    CREATE INDEX "payload_locked_documents_rels_faq_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_id");
    CREATE INDEX "payload_locked_documents_rels_feeding_the_streets_id_idx" ON "payload_locked_documents_rels" USING btree ("feeding_the_streets_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "payload_locked_documents_rels_feeding_the_streets_id_idx";
    DROP INDEX "payload_locked_documents_rels_faq_id_idx";
    DROP INDEX "payload_locked_documents_rels_get_help_now_id_idx";
    DROP INDEX "payload_locked_documents_rels_custom_pages_id_idx";
    DROP INDEX "payload_locked_documents_rels_donate_id_idx";
    DROP INDEX "payload_locked_documents_rels_stories_id_idx";
    DROP INDEX "payload_locked_documents_rels_intro_id_idx";
    DROP INDEX "payload_locked_documents_rels_hero_id_idx";
    DROP INDEX "payload_locked_documents_rels_mission_page_id_idx";
    DROP INDEX "payload_locked_documents_rels_media_id_idx";
    DROP INDEX "payload_locked_documents_rels_events_id_idx";

    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "feeding_the_streets_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faq_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "get_help_now_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "custom_pages_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "donate_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "stories_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "intro_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "hero_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "mission_page_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "events_id";
  `)
}