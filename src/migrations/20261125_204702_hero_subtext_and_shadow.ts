import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero" ADD COLUMN "subtext" varchar;
  ALTER TABLE "hero" ADD COLUMN "subtext_color" varchar DEFAULT '#f7f3eb';
  ALTER TABLE "hero" ADD COLUMN "subtext_font_size" numeric DEFAULT 18;
  ALTER TABLE "hero" ADD COLUMN "text_shadow_enabled" boolean DEFAULT false;
  ALTER TABLE "hero" ADD COLUMN "text_shadow_color" varchar DEFAULT '#000000';
  ALTER TABLE "hero" ADD COLUMN "text_shadow_opacity" numeric DEFAULT 75;
  ALTER TABLE "hero" ADD COLUMN "text_shadow_distance" numeric DEFAULT 4;
  ALTER TABLE "hero" ADD COLUMN "text_shadow_angle" numeric DEFAULT 135;
  ALTER TABLE "hero" ADD COLUMN "text_shadow_fuzziness" numeric DEFAULT 6;
  ALTER TABLE "hero" ADD COLUMN "text_shadow_extent" numeric DEFAULT 0;
  ALTER TABLE "media" DROP COLUMN "_objectkey";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "hero" DROP COLUMN "subtext";
  ALTER TABLE "hero" DROP COLUMN "subtext_color";
  ALTER TABLE "hero" DROP COLUMN "subtext_font_size";
  ALTER TABLE "hero" DROP COLUMN "text_shadow_enabled";
  ALTER TABLE "hero" DROP COLUMN "text_shadow_color";
  ALTER TABLE "hero" DROP COLUMN "text_shadow_opacity";
  ALTER TABLE "hero" DROP COLUMN "text_shadow_distance";
  ALTER TABLE "hero" DROP COLUMN "text_shadow_angle";
  ALTER TABLE "hero" DROP COLUMN "text_shadow_fuzziness";
  ALTER TABLE "hero" DROP COLUMN "text_shadow_extent";`)
}
