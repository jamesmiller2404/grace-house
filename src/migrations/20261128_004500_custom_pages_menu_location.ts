import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_custom_pages_menu_location" AS ENUM('none', 'life', 'more');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "custom_pages"
      ADD COLUMN IF NOT EXISTS "menu_location" "enum_custom_pages_menu_location" DEFAULT 'none';

    UPDATE "custom_pages"
    SET "menu_location" = CASE
      WHEN "enabled" = true THEN 'more'::"enum_custom_pages_menu_location"
      ELSE 'none'::"enum_custom_pages_menu_location"
    END;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "custom_pages" DROP COLUMN IF EXISTS "menu_location";
    DROP TYPE IF EXISTS "public"."enum_custom_pages_menu_location";
  `)
}
