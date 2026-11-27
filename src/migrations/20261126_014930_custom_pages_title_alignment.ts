import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_custom_pages_title_alignment" AS ENUM('left', 'center', 'right');
  ALTER TABLE "custom_pages" ADD COLUMN "title_alignment" "enum_custom_pages_title_alignment" DEFAULT 'left';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "custom_pages" DROP COLUMN "title_alignment";
  DROP TYPE "public"."enum_custom_pages_title_alignment";`)
}
