import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_events_visibility" AS ENUM('Public', 'Private');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "visibility" "enum_events_visibility";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events" DROP COLUMN IF EXISTS "visibility";
    DROP TYPE IF EXISTS "public"."enum_events_visibility";
  `)
}
