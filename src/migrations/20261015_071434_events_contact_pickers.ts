import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ADD COLUMN "contact_phone_choice" varchar;
  ALTER TABLE "events" ADD COLUMN "contact_phone_custom" varchar;
  ALTER TABLE "events" ADD COLUMN "contact_email_choice" varchar;
  ALTER TABLE "events" ADD COLUMN "contact_email_custom" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" DROP COLUMN "contact_phone_choice";
  ALTER TABLE "events" DROP COLUMN "contact_phone_custom";
  ALTER TABLE "events" DROP COLUMN "contact_email_choice";
  ALTER TABLE "events" DROP COLUMN "contact_email_custom";`)
}
