import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_custom_pages_columns" AS ENUM('1', '2', '3');
  ALTER TABLE "custom_pages" ADD COLUMN "columns" "enum_custom_pages_columns" DEFAULT '1';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "custom_pages" DROP COLUMN "columns";
  DROP TYPE "public"."enum_custom_pages_columns";`)
}
