import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_header_top_bar_icons_icon" AS ENUM(
      'facebook',
      'instagram',
      'youtube',
      'x',
      'linkedin',
      'tiktok',
      'phone',
      'mail',
      'location',
      'clock',
      'heart',
      'info'
    );

    CREATE TABLE "header" (
      "id" serial PRIMARY KEY NOT NULL,
      "top_bar_enabled" boolean DEFAULT true,
      "top_bar_background_color" varchar DEFAULT '#624e92',
      "top_bar_text_color" varchar DEFAULT '#ffffff',
      "top_bar_content" jsonb,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE "header_top_bar_icons" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon" "enum_header_top_bar_icons_icon" DEFAULT 'facebook' NOT NULL,
      "label" varchar NOT NULL,
      "href" varchar NOT NULL,
      "open_in_new_tab" boolean DEFAULT true
    );

    CREATE TABLE "header_top_bar_buttons" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "href" varchar NOT NULL,
      "bg_color" varchar DEFAULT '#9e5640',
      "text_color" varchar DEFAULT '#ffffff',
      "open_in_new_tab" boolean DEFAULT false
    );

    ALTER TABLE "header_top_bar_icons" ADD CONSTRAINT "header_top_bar_icons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "header_top_bar_buttons" ADD CONSTRAINT "header_top_bar_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "header_top_bar_icons_order_idx" ON "header_top_bar_icons" USING btree ("_order");
    CREATE INDEX "header_top_bar_icons_parent_id_idx" ON "header_top_bar_icons" USING btree ("_parent_id");
    CREATE INDEX "header_top_bar_buttons_order_idx" ON "header_top_bar_buttons" USING btree ("_order");
    CREATE INDEX "header_top_bar_buttons_parent_id_idx" ON "header_top_bar_buttons" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "header_top_bar_buttons" CASCADE;
    DROP TABLE IF EXISTS "header_top_bar_icons" CASCADE;
    DROP TABLE IF EXISTS "header" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_header_top_bar_icons_icon";
  `)
}
