import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_home_layout_sections_section" ADD VALUE 'custom-page';
  ALTER TABLE "home_layout_sections" ADD COLUMN "custom_page_id" integer;
  ALTER TABLE "home_layout_sections" ADD CONSTRAINT "home_layout_sections_custom_page_id_custom_pages_id_fk" FOREIGN KEY ("custom_page_id") REFERENCES "public"."custom_pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_layout_sections_custom_page_idx" ON "home_layout_sections" USING btree ("custom_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_layout_sections" DROP CONSTRAINT "home_layout_sections_custom_page_id_custom_pages_id_fk";
  
  ALTER TABLE "home_layout_sections" ALTER COLUMN "section" SET DATA TYPE text;
  DROP TYPE "public"."enum_home_layout_sections_section";
  CREATE TYPE "public"."enum_home_layout_sections_section" AS ENUM('hero', 'help-strip', 'welcome', 'four-pillars', 'stories', 'upcoming-events');
  ALTER TABLE "home_layout_sections" ALTER COLUMN "section" SET DATA TYPE "public"."enum_home_layout_sections_section" USING "section"::"public"."enum_home_layout_sections_section";
  DROP INDEX "home_layout_sections_custom_page_idx";
  ALTER TABLE "home_layout_sections" DROP COLUMN "custom_page_id";`)
}
