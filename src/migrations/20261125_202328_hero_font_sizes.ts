import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero" ADD COLUMN IF NOT EXISTS "heading_font_size" numeric DEFAULT 60;
  ALTER TABLE "hero" ADD COLUMN IF NOT EXISTS "eyebrow_font_size" numeric DEFAULT 19;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero" DROP COLUMN IF EXISTS "heading_font_size";
  ALTER TABLE "hero" DROP COLUMN IF EXISTS "eyebrow_font_size";`)
}
