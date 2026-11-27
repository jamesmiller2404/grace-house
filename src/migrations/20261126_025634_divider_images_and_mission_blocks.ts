import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_blocks_divider_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_stories_body_divider_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__stories_v_version_body_divider_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_feeding_the_streets_blocks_divider_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_intro_blocks_divider_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_mission_page_blocks_type" AS ENUM('Heading', 'Paragraph', 'Photo', 'Video', 'Divider');
  CREATE TYPE "public"."enum_mission_page_blocks_divider_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_donate_blocks_divider_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_custom_pages_blocks_divider_align" AS ENUM('left', 'center', 'right');
  ALTER TYPE "public"."enum_events_blocks_type" ADD VALUE 'Divider';
  ALTER TYPE "public"."enum_stories_body_type" ADD VALUE 'Divider';
  ALTER TYPE "public"."enum__stories_v_version_body_type" ADD VALUE 'Divider';
  ALTER TYPE "public"."enum_feeding_the_streets_blocks_type" ADD VALUE 'Divider';
  ALTER TYPE "public"."enum_intro_blocks_type" ADD VALUE 'Divider';
  ALTER TYPE "public"."enum_donate_blocks_type" ADD VALUE 'Divider';
  ALTER TYPE "public"."enum_custom_pages_blocks_type" ADD VALUE 'Divider';
  CREATE TABLE "divider_images" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "mission_page_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_mission_page_blocks_type" DEFAULT 'Paragraph' NOT NULL,
  	"divider_image_id" integer,
  	"divider_align" "enum_mission_page_blocks_divider_align" DEFAULT 'center',
  	"text" varchar,
  	"content" jsonb,
  	"image_id" integer,
  	"video_url" varchar,
  	"caption" varchar
  );
  
  ALTER TABLE "events_blocks" ADD COLUMN "divider_image_id" integer;
  ALTER TABLE "events_blocks" ADD COLUMN "divider_align" "enum_events_blocks_divider_align" DEFAULT 'center';
  ALTER TABLE "stories_body" ADD COLUMN "divider_image_id" integer;
  ALTER TABLE "stories_body" ADD COLUMN "divider_align" "enum_stories_body_divider_align" DEFAULT 'center';
  ALTER TABLE "_stories_v_version_body" ADD COLUMN "divider_image_id" integer;
  ALTER TABLE "_stories_v_version_body" ADD COLUMN "divider_align" "enum__stories_v_version_body_divider_align" DEFAULT 'center';
  ALTER TABLE "feeding_the_streets_blocks" ADD COLUMN "divider_image_id" integer;
  ALTER TABLE "feeding_the_streets_blocks" ADD COLUMN "divider_align" "enum_feeding_the_streets_blocks_divider_align" DEFAULT 'center';
  ALTER TABLE "intro_blocks" ADD COLUMN "divider_image_id" integer;
  ALTER TABLE "intro_blocks" ADD COLUMN "divider_align" "enum_intro_blocks_divider_align" DEFAULT 'center';
  ALTER TABLE "donate_blocks" ADD COLUMN "divider_image_id" integer;
  ALTER TABLE "donate_blocks" ADD COLUMN "divider_align" "enum_donate_blocks_divider_align" DEFAULT 'center';
  ALTER TABLE "custom_pages_blocks" ADD COLUMN "divider_image_id" integer;
  ALTER TABLE "custom_pages_blocks" ADD COLUMN "divider_align" "enum_custom_pages_blocks_divider_align" DEFAULT 'center';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "divider_images_id" integer;
  ALTER TABLE "divider_images" ADD CONSTRAINT "divider_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mission_page_blocks" ADD CONSTRAINT "mission_page_blocks_divider_image_id_divider_images_id_fk" FOREIGN KEY ("divider_image_id") REFERENCES "public"."divider_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mission_page_blocks" ADD CONSTRAINT "mission_page_blocks_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mission_page_blocks" ADD CONSTRAINT "mission_page_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."mission_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "divider_images_image_idx" ON "divider_images" USING btree ("image_id");
  CREATE INDEX "divider_images_updated_at_idx" ON "divider_images" USING btree ("updated_at");
  CREATE INDEX "divider_images_created_at_idx" ON "divider_images" USING btree ("created_at");
  CREATE INDEX "mission_page_blocks_order_idx" ON "mission_page_blocks" USING btree ("_order");
  CREATE INDEX "mission_page_blocks_parent_id_idx" ON "mission_page_blocks" USING btree ("_parent_id");
  CREATE INDEX "mission_page_blocks_divider_image_idx" ON "mission_page_blocks" USING btree ("divider_image_id");
  CREATE INDEX "mission_page_blocks_image_idx" ON "mission_page_blocks" USING btree ("image_id");
  ALTER TABLE "events_blocks" ADD CONSTRAINT "events_blocks_divider_image_id_divider_images_id_fk" FOREIGN KEY ("divider_image_id") REFERENCES "public"."divider_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_body" ADD CONSTRAINT "stories_body_divider_image_id_divider_images_id_fk" FOREIGN KEY ("divider_image_id") REFERENCES "public"."divider_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_version_body" ADD CONSTRAINT "_stories_v_version_body_divider_image_id_divider_images_id_fk" FOREIGN KEY ("divider_image_id") REFERENCES "public"."divider_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "feeding_the_streets_blocks" ADD CONSTRAINT "feeding_the_streets_blocks_divider_image_id_divider_images_id_fk" FOREIGN KEY ("divider_image_id") REFERENCES "public"."divider_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "intro_blocks" ADD CONSTRAINT "intro_blocks_divider_image_id_divider_images_id_fk" FOREIGN KEY ("divider_image_id") REFERENCES "public"."divider_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "donate_blocks" ADD CONSTRAINT "donate_blocks_divider_image_id_divider_images_id_fk" FOREIGN KEY ("divider_image_id") REFERENCES "public"."divider_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_pages_blocks" ADD CONSTRAINT "custom_pages_blocks_divider_image_id_divider_images_id_fk" FOREIGN KEY ("divider_image_id") REFERENCES "public"."divider_images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_divider_images_fk" FOREIGN KEY ("divider_images_id") REFERENCES "public"."divider_images"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_blocks_divider_image_idx" ON "events_blocks" USING btree ("divider_image_id");
  CREATE INDEX "stories_body_divider_image_idx" ON "stories_body" USING btree ("divider_image_id");
  CREATE INDEX "_stories_v_version_body_divider_image_idx" ON "_stories_v_version_body" USING btree ("divider_image_id");
  CREATE INDEX "feeding_the_streets_blocks_divider_image_idx" ON "feeding_the_streets_blocks" USING btree ("divider_image_id");
  CREATE INDEX "intro_blocks_divider_image_idx" ON "intro_blocks" USING btree ("divider_image_id");
  CREATE INDEX "donate_blocks_divider_image_idx" ON "donate_blocks" USING btree ("divider_image_id");
  CREATE INDEX "custom_pages_blocks_divider_image_idx" ON "custom_pages_blocks" USING btree ("divider_image_id");
  CREATE INDEX "payload_locked_documents_rels_divider_images_id_idx" ON "payload_locked_documents_rels" USING btree ("divider_images_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "divider_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "mission_page_blocks" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "divider_images" CASCADE;
  DROP TABLE "mission_page_blocks" CASCADE;
  ALTER TABLE "events_blocks" DROP CONSTRAINT "events_blocks_divider_image_id_divider_images_id_fk";
  
  ALTER TABLE "stories_body" DROP CONSTRAINT "stories_body_divider_image_id_divider_images_id_fk";
  
  ALTER TABLE "_stories_v_version_body" DROP CONSTRAINT "_stories_v_version_body_divider_image_id_divider_images_id_fk";
  
  ALTER TABLE "feeding_the_streets_blocks" DROP CONSTRAINT "feeding_the_streets_blocks_divider_image_id_divider_images_id_fk";
  
  ALTER TABLE "intro_blocks" DROP CONSTRAINT "intro_blocks_divider_image_id_divider_images_id_fk";
  
  ALTER TABLE "donate_blocks" DROP CONSTRAINT "donate_blocks_divider_image_id_divider_images_id_fk";
  
  ALTER TABLE "custom_pages_blocks" DROP CONSTRAINT "custom_pages_blocks_divider_image_id_divider_images_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_divider_images_fk";
  
  ALTER TABLE "events_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "events_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_events_blocks_type";
  CREATE TYPE "public"."enum_events_blocks_type" AS ENUM('Heading', 'Paragraph', 'Photo', 'Video');
  ALTER TABLE "events_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_events_blocks_type";
  ALTER TABLE "events_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_events_blocks_type" USING "type"::"public"."enum_events_blocks_type";
  ALTER TABLE "stories_body" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "stories_body" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_stories_body_type";
  CREATE TYPE "public"."enum_stories_body_type" AS ENUM('Heading', 'Paragraph', 'Photo', 'Video');
  ALTER TABLE "stories_body" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_stories_body_type";
  ALTER TABLE "stories_body" ALTER COLUMN "type" SET DATA TYPE "public"."enum_stories_body_type" USING "type"::"public"."enum_stories_body_type";
  ALTER TABLE "_stories_v_version_body" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "_stories_v_version_body" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum__stories_v_version_body_type";
  CREATE TYPE "public"."enum__stories_v_version_body_type" AS ENUM('Heading', 'Paragraph', 'Photo', 'Video');
  ALTER TABLE "_stories_v_version_body" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum__stories_v_version_body_type";
  ALTER TABLE "_stories_v_version_body" ALTER COLUMN "type" SET DATA TYPE "public"."enum__stories_v_version_body_type" USING "type"::"public"."enum__stories_v_version_body_type";
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_feeding_the_streets_blocks_type";
  CREATE TYPE "public"."enum_feeding_the_streets_blocks_type" AS ENUM('Heading', 'Paragraph', 'Photo', 'Video');
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_feeding_the_streets_blocks_type";
  ALTER TABLE "feeding_the_streets_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_feeding_the_streets_blocks_type" USING "type"::"public"."enum_feeding_the_streets_blocks_type";
  ALTER TABLE "intro_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "intro_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_intro_blocks_type";
  CREATE TYPE "public"."enum_intro_blocks_type" AS ENUM('Heading', 'Paragraph', 'Photo', 'Video');
  ALTER TABLE "intro_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_intro_blocks_type";
  ALTER TABLE "intro_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_intro_blocks_type" USING "type"::"public"."enum_intro_blocks_type";
  ALTER TABLE "donate_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "donate_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_donate_blocks_type";
  CREATE TYPE "public"."enum_donate_blocks_type" AS ENUM('Heading', 'Paragraph', 'Photo', 'Video');
  ALTER TABLE "donate_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_donate_blocks_type";
  ALTER TABLE "donate_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_donate_blocks_type" USING "type"::"public"."enum_donate_blocks_type";
  ALTER TABLE "custom_pages_blocks" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "custom_pages_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::text;
  DROP TYPE "public"."enum_custom_pages_blocks_type";
  CREATE TYPE "public"."enum_custom_pages_blocks_type" AS ENUM('Heading', 'Paragraph', 'Photo', 'Video');
  ALTER TABLE "custom_pages_blocks" ALTER COLUMN "type" SET DEFAULT 'Paragraph'::"public"."enum_custom_pages_blocks_type";
  ALTER TABLE "custom_pages_blocks" ALTER COLUMN "type" SET DATA TYPE "public"."enum_custom_pages_blocks_type" USING "type"::"public"."enum_custom_pages_blocks_type";
  DROP INDEX "events_blocks_divider_image_idx";
  DROP INDEX "stories_body_divider_image_idx";
  DROP INDEX "_stories_v_version_body_divider_image_idx";
  DROP INDEX "feeding_the_streets_blocks_divider_image_idx";
  DROP INDEX "intro_blocks_divider_image_idx";
  DROP INDEX "donate_blocks_divider_image_idx";
  DROP INDEX "custom_pages_blocks_divider_image_idx";
  DROP INDEX "payload_locked_documents_rels_divider_images_id_idx";
  ALTER TABLE "events_blocks" DROP COLUMN "divider_image_id";
  ALTER TABLE "events_blocks" DROP COLUMN "divider_align";
  ALTER TABLE "stories_body" DROP COLUMN "divider_image_id";
  ALTER TABLE "stories_body" DROP COLUMN "divider_align";
  ALTER TABLE "_stories_v_version_body" DROP COLUMN "divider_image_id";
  ALTER TABLE "_stories_v_version_body" DROP COLUMN "divider_align";
  ALTER TABLE "feeding_the_streets_blocks" DROP COLUMN "divider_image_id";
  ALTER TABLE "feeding_the_streets_blocks" DROP COLUMN "divider_align";
  ALTER TABLE "intro_blocks" DROP COLUMN "divider_image_id";
  ALTER TABLE "intro_blocks" DROP COLUMN "divider_align";
  ALTER TABLE "donate_blocks" DROP COLUMN "divider_image_id";
  ALTER TABLE "donate_blocks" DROP COLUMN "divider_align";
  ALTER TABLE "custom_pages_blocks" DROP COLUMN "divider_image_id";
  ALTER TABLE "custom_pages_blocks" DROP COLUMN "divider_align";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "divider_images_id";
  DROP TYPE "public"."enum_events_blocks_divider_align";
  DROP TYPE "public"."enum_stories_body_divider_align";
  DROP TYPE "public"."enum__stories_v_version_body_divider_align";
  DROP TYPE "public"."enum_feeding_the_streets_blocks_divider_align";
  DROP TYPE "public"."enum_intro_blocks_divider_align";
  DROP TYPE "public"."enum_mission_page_blocks_type";
  DROP TYPE "public"."enum_mission_page_blocks_divider_align";
  DROP TYPE "public"."enum_donate_blocks_divider_align";
  DROP TYPE "public"."enum_custom_pages_blocks_divider_align";`)
}
