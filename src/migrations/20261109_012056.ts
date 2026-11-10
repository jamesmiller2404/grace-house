import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stories_memories" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "stories" ADD COLUMN "show_memories" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stories_memories" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "stories" DROP COLUMN "show_memories";`)
}
