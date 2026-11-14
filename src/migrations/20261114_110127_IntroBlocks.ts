import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_intro_blocks_type" AS ENUM('Heading', 'Paragraph', 'Photo');
  CREATE TABLE "intro_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_intro_blocks_type" DEFAULT 'Paragraph' NOT NULL,
  	"text" varchar,
  	"content" jsonb,
  	"image_id" integer,
  	"caption" varchar
  );
  
  ALTER TABLE "intro" ADD COLUMN "title" varchar;
  UPDATE "intro" SET "title" = 'What is Grace House' WHERE "title" IS NULL;
  ALTER TABLE "intro" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "intro_blocks" ADD CONSTRAINT "intro_blocks_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "intro_blocks" ADD CONSTRAINT "intro_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."intro"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "intro_blocks_order_idx" ON "intro_blocks" USING btree ("_order");
  CREATE INDEX "intro_blocks_parent_id_idx" ON "intro_blocks" USING btree ("_parent_id");
  CREATE INDEX "intro_blocks_image_idx" ON "intro_blocks" USING btree ("image_id");
  ALTER TABLE "intro" DROP COLUMN "heading";
  ALTER TABLE "intro" DROP COLUMN "body";
  ALTER TABLE "intro" DROP COLUMN "pull_quote";
  ALTER TABLE "intro" DROP COLUMN "link_label";
  ALTER TABLE "intro" DROP COLUMN "link_href";
  ALTER TABLE "intro" DROP COLUMN "bg_color";
  ALTER TABLE "intro" DROP COLUMN "text_color";
  ALTER TABLE "intro" DROP COLUMN "link_color";
  ALTER TABLE "intro" DROP COLUMN "link_hover_color";
  ALTER TABLE "custom_pages_blocks" DROP COLUMN "link_label";
  ALTER TABLE "custom_pages_blocks" DROP COLUMN "link_href";
  DROP TYPE "public"."enum_intro_bg_color";
  DROP TYPE "public"."enum_intro_text_color";
  DROP TYPE "public"."enum_intro_link_color";
  DROP TYPE "public"."enum_intro_link_hover_color";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_intro_bg_color" AS ENUM('cream', 'sand', 'gold', 'terra', 'lift', 'anchor', 'ink', 'white');
  CREATE TYPE "public"."enum_intro_text_color" AS ENUM('cream', 'sand', 'gold', 'terra', 'lift', 'anchor', 'ink', 'white');
  CREATE TYPE "public"."enum_intro_link_color" AS ENUM('cream', 'sand', 'gold', 'terra', 'lift', 'anchor', 'ink', 'white');
  CREATE TYPE "public"."enum_intro_link_hover_color" AS ENUM('cream', 'sand', 'gold', 'terra', 'lift', 'anchor', 'ink', 'white');
  DROP TABLE "intro_blocks" CASCADE;
  ALTER TABLE "intro" ADD COLUMN "heading" varchar;
  ALTER TABLE "intro" ADD COLUMN "body" varchar;
  UPDATE "intro" SET "heading" = 'What is Grace House', "body" = '' WHERE "heading" IS NULL OR "body" IS NULL;
  ALTER TABLE "intro" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "intro" ALTER COLUMN "body" SET NOT NULL;
  ALTER TABLE "intro" ADD COLUMN "pull_quote" varchar;
  ALTER TABLE "intro" ADD COLUMN "link_label" varchar;
  ALTER TABLE "intro" ADD COLUMN "link_href" varchar;
  ALTER TABLE "intro" ADD COLUMN "bg_color" "enum_intro_bg_color" DEFAULT 'cream';
  ALTER TABLE "intro" ADD COLUMN "text_color" "enum_intro_text_color" DEFAULT 'anchor';
  ALTER TABLE "intro" ADD COLUMN "link_color" "enum_intro_link_color" DEFAULT 'terra';
  ALTER TABLE "intro" ADD COLUMN "link_hover_color" "enum_intro_link_hover_color" DEFAULT 'lift';
  ALTER TABLE "custom_pages_blocks" ADD COLUMN "link_label" varchar;
  ALTER TABLE "custom_pages_blocks" ADD COLUMN "link_href" varchar;
  ALTER TABLE "intro" DROP COLUMN "title";
  DROP TYPE "public"."enum_intro_blocks_type";`)
}
