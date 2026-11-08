import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stories" ADD COLUMN "show_pull_quote" boolean DEFAULT false;
  ALTER TABLE "stories" ADD COLUMN "show_banner_quote" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stories" DROP COLUMN "show_pull_quote";
  ALTER TABLE "stories" DROP COLUMN "show_banner_quote";`)
}
