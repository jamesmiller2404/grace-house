import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_stories_gender" AS ENUM('Male', 'Female');
  ALTER TABLE "stories" ADD COLUMN "gender" "enum_stories_gender";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stories" DROP COLUMN "gender";
  DROP TYPE "public"."enum_stories_gender";`)
}
