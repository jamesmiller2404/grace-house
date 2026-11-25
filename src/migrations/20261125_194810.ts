import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "hero" ADD COLUMN "show_card" boolean DEFAULT true;
  ALTER TABLE "hero" ADD COLUMN "card_color" varchar DEFAULT '#0f172a';
  ALTER TABLE "hero" ADD COLUMN "card_opacity" numeric DEFAULT 55;
  ALTER TABLE "hero" ADD COLUMN "heading_color" varchar DEFAULT '#ffffff';
  ALTER TABLE "hero" ADD COLUMN "eyebrow_color" varchar DEFAULT '#c9a45c';
  ALTER TABLE "hero" ADD COLUMN "card_position_x" numeric DEFAULT 50;
  ALTER TABLE "hero" ADD COLUMN "card_position_y" numeric DEFAULT 5;
  ALTER TABLE "hero" ADD COLUMN "card_width" numeric;
  ALTER TABLE "hero" ADD COLUMN "card_height" numeric;
  ALTER TABLE "hero" ADD COLUMN "primary_cta_enabled" boolean DEFAULT true;
  ALTER TABLE "hero" ADD COLUMN "primary_cta_label" varchar DEFAULT 'Get Help';
  ALTER TABLE "hero" ADD COLUMN "primary_cta_href" varchar DEFAULT '#help';
  ALTER TABLE "hero" ADD COLUMN "primary_cta_bg_color" varchar DEFAULT '#9e5640';
  ALTER TABLE "hero" ADD COLUMN "primary_cta_text_color" varchar DEFAULT '#ffffff';
  ALTER TABLE "hero" ADD COLUMN "secondary_cta_enabled" boolean DEFAULT true;
  ALTER TABLE "hero" ADD COLUMN "secondary_cta_label" varchar DEFAULT 'Our Stories';
  ALTER TABLE "hero" ADD COLUMN "secondary_cta_href" varchar DEFAULT '/#stories';
  ALTER TABLE "hero" ADD COLUMN "secondary_cta_bg_color" varchar DEFAULT '#ffffff';
  ALTER TABLE "hero" ADD COLUMN "secondary_cta_text_color" varchar DEFAULT '#242725';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "hero" DROP COLUMN "show_card";
  ALTER TABLE "hero" DROP COLUMN "card_color";
  ALTER TABLE "hero" DROP COLUMN "card_opacity";
  ALTER TABLE "hero" DROP COLUMN "heading_color";
  ALTER TABLE "hero" DROP COLUMN "eyebrow_color";
  ALTER TABLE "hero" DROP COLUMN "card_position_x";
  ALTER TABLE "hero" DROP COLUMN "card_position_y";
  ALTER TABLE "hero" DROP COLUMN "card_width";
  ALTER TABLE "hero" DROP COLUMN "card_height";
  ALTER TABLE "hero" DROP COLUMN "primary_cta_enabled";
  ALTER TABLE "hero" DROP COLUMN "primary_cta_label";
  ALTER TABLE "hero" DROP COLUMN "primary_cta_href";
  ALTER TABLE "hero" DROP COLUMN "primary_cta_bg_color";
  ALTER TABLE "hero" DROP COLUMN "primary_cta_text_color";
  ALTER TABLE "hero" DROP COLUMN "secondary_cta_enabled";
  ALTER TABLE "hero" DROP COLUMN "secondary_cta_label";
  ALTER TABLE "hero" DROP COLUMN "secondary_cta_href";
  ALTER TABLE "hero" DROP COLUMN "secondary_cta_bg_color";
  ALTER TABLE "hero" DROP COLUMN "secondary_cta_text_color";`)
}
