import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "board_members" ADD COLUMN "image_position_x" numeric DEFAULT 50;
    ALTER TABLE "board_members" ADD COLUMN "image_position_y" numeric DEFAULT 50;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "board_members" DROP COLUMN "image_position_x";
    ALTER TABLE "board_members" DROP COLUMN "image_position_y";
  `)
}
