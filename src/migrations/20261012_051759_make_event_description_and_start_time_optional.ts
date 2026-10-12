import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // "One-line description" and "Start Time" are no longer required in the
  // admin panel (src/payload/collections/Events.ts), so their columns become
  // nullable. The media focal_x/focal_y drop and the repeated events.image_id
  // DROP NOT NULL clean up drift between the current collections config
  // (Media has focalPoint: false; event images were already made optional in
  // 20261011_034500) and the database — neither affects stored event data.
  await db.execute(sql`
   ALTER TABLE "events" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "start_time" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "media" DROP COLUMN "focal_x";
  ALTER TABLE "media" DROP COLUMN "focal_y";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "start_time" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "media" ADD COLUMN "focal_x" numeric;
  ALTER TABLE "media" ADD COLUMN "focal_y" numeric;`)
}
