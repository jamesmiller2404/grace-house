import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Allows Media Alt Text to be omitted or left blank.
 * Existing Alt Text values are preserved.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media"
      ALTER COLUMN "alt" DROP NOT NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media"
      ALTER COLUMN "alt" SET NOT NULL;
  `);
}
