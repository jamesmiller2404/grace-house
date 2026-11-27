import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "get_help_now" ADD COLUMN IF NOT EXISTS "phone_prefix" varchar DEFAULT 'or call';
    ALTER TABLE "get_help_now" ADD COLUMN IF NOT EXISTS "hours_prefix" varchar DEFAULT 'Office hours:';
    ALTER TABLE "get_help_now" ADD COLUMN IF NOT EXISTS "contact_content" jsonb;
    ALTER TABLE "get_help_now" ALTER COLUMN "body" DROP NOT NULL;
    ALTER TABLE "get_help_now" ALTER COLUMN "phone_choice" DROP NOT NULL;
    ALTER TABLE "get_help_now" ALTER COLUMN "hours" DROP NOT NULL;

    UPDATE "get_help_now"
    SET "body_content" = jsonb_build_object(
      'root', jsonb_build_object(
        'type', 'root',
        'format', '',
        'indent', 0,
        'version', 1,
        'direction', 'ltr',
        'children', jsonb_build_array(
          jsonb_build_object(
            'type', 'paragraph',
            'format', '',
            'indent', 0,
            'version', 1,
            'direction', 'ltr',
            'textFormat', 0,
            'textStyle', '',
            'children', jsonb_build_array(
              jsonb_build_object(
                'type', 'text',
                'detail', 0,
                'format', 0,
                'mode', 'normal',
                'style', '',
                'text', COALESCE("body", ''),
                'version', 1
              )
            )
          )
        )
      )
    )
    WHERE "body_content" IS NULL AND COALESCE("body", '') <> '';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "get_help_now" DROP COLUMN IF EXISTS "contact_content";
    ALTER TABLE "get_help_now" DROP COLUMN IF EXISTS "hours_prefix";
    ALTER TABLE "get_help_now" DROP COLUMN IF EXISTS "phone_prefix";
  `)
}
