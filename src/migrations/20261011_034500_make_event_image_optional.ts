import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Event images are optional now — drop the NOT NULL the initial migration
  // put on the events.image_id foreign-key column.
  await db.execute(sql`
   ALTER TABLE "events" ALTER COLUMN "image_id" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ALTER COLUMN "image_id" SET NOT NULL;`)
}
