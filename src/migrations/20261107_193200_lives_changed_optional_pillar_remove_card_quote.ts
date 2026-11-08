import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_stories_pillar"
      ADD VALUE 'Select a pillar...';

    ALTER TABLE "stories"
      ADD COLUMN "show_pillar" boolean NOT NULL DEFAULT false;

    ALTER TABLE "stories"
      ALTER COLUMN "pillar" DROP DEFAULT;

    ALTER TABLE "stories"
      DROP COLUMN "excerpt";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "stories"
      ADD COLUMN "excerpt" varchar;

    ALTER TABLE "stories"
      DROP COLUMN "show_pillar";

    UPDATE "stories"
      SET "pillar" = 'Forgive Yourself'
      WHERE "pillar" = 'Select a pillar...';

    ALTER TABLE "stories"
      ALTER COLUMN "pillar" SET DEFAULT 'Forgive Yourself';
  `)
}
