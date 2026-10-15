import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" ADD COLUMN "address_choice" varchar;
  ALTER TABLE "footer" ADD COLUMN "address_custom" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" DROP COLUMN "address_choice";
  ALTER TABLE "footer" DROP COLUMN "address_custom";`)
}
