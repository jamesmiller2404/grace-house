import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stories" ADD COLUMN "image_zoom" numeric DEFAULT 100;
  ALTER TABLE "_stories_v" ADD COLUMN "version_image_zoom" numeric DEFAULT 100;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stories" DROP COLUMN "image_zoom";
  ALTER TABLE "_stories_v" DROP COLUMN "version_image_zoom";`)
}
