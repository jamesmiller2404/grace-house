import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_stories_role" ADD VALUE 'Other';
  ALTER TABLE "stories" ADD COLUMN "role_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stories" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "stories" ALTER COLUMN "role" SET DEFAULT 'Graduate'::text;
  DROP TYPE "public"."enum_stories_role";
  CREATE TYPE "public"."enum_stories_role" AS ENUM('Graduate', 'Volunteer', 'Staff');
  ALTER TABLE "stories" ALTER COLUMN "role" SET DEFAULT 'Graduate'::"public"."enum_stories_role";
  ALTER TABLE "stories" ALTER COLUMN "role" SET DATA TYPE "public"."enum_stories_role" USING "role"::"public"."enum_stories_role";
  ALTER TABLE "stories" DROP COLUMN "role_label";`)
}
