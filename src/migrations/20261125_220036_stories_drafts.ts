import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_stories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stories_v_version_body_type" AS ENUM('Heading', 'Paragraph', 'Photo', 'Video');
  CREATE TYPE "public"."enum__stories_v_version_role" AS ENUM('Graduate', 'Volunteer', 'Staff', 'Other');
  CREATE TYPE "public"."enum__stories_v_version_gender" AS ENUM('Male', 'Female');
  CREATE TYPE "public"."enum__stories_v_version_pillar" AS ENUM('Select a pillar...', 'Forgive Yourself', 'God''s Timing', 'A Giver, Not a Taker', 'Restoration');
  CREATE TYPE "public"."enum__stories_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "_stories_v_version_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__stories_v_version_body_type" DEFAULT 'Paragraph',
  	"text" varchar,
  	"content" jsonb,
  	"image_id" integer,
  	"video_url" varchar,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v_version_closing_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v_version_memories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_role" "enum__stories_v_version_role" DEFAULT 'Graduate',
  	"version_role_label" varchar,
  	"version_gender" "enum__stories_v_version_gender",
  	"version_date" timestamp(3) with time zone,
  	"version_image_id" integer,
  	"version_image_position_x" numeric DEFAULT 50,
  	"version_image_position_y" numeric DEFAULT 50,
  	"version_show_pull_quote" boolean DEFAULT false,
  	"version_pull_quote" varchar,
  	"version_show_banner_quote" boolean DEFAULT false,
  	"version_banner_quote_quote" varchar,
  	"version_banner_quote_attribution" varchar,
  	"version_read_label" varchar,
  	"version_closing_heading" varchar,
  	"version_pronouns_subject" varchar,
  	"version_pronouns_possessive" varchar,
  	"version_show_memories" boolean DEFAULT false,
  	"version_show_pillar" boolean DEFAULT false,
  	"version_pillar" "enum__stories_v_version_pillar" DEFAULT 'Select a pillar...',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__stories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "stories_body" ALTER COLUMN "type" DROP NOT NULL;
  ALTER TABLE "stories_closing_paragraphs" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "stories" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "stories" ADD COLUMN "_status" "enum_stories_status" DEFAULT 'draft';
  UPDATE "stories" SET "_status" = 'published';
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
  ALTER TABLE "_stories_v_version_body" ADD CONSTRAINT "_stories_v_version_body_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_version_body" ADD CONSTRAINT "_stories_v_version_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_version_closing_paragraphs" ADD CONSTRAINT "_stories_v_version_closing_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_version_memories" ADD CONSTRAINT "_stories_v_version_memories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_version_memories" ADD CONSTRAINT "_stories_v_version_memories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_parent_id_stories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_stories_v_version_body_order_idx" ON "_stories_v_version_body" USING btree ("_order");
  CREATE INDEX "_stories_v_version_body_parent_id_idx" ON "_stories_v_version_body" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_version_body_image_idx" ON "_stories_v_version_body" USING btree ("image_id");
  CREATE INDEX "_stories_v_version_closing_paragraphs_order_idx" ON "_stories_v_version_closing_paragraphs" USING btree ("_order");
  CREATE INDEX "_stories_v_version_closing_paragraphs_parent_id_idx" ON "_stories_v_version_closing_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_version_memories_order_idx" ON "_stories_v_version_memories" USING btree ("_order");
  CREATE INDEX "_stories_v_version_memories_parent_id_idx" ON "_stories_v_version_memories" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_version_memories_image_idx" ON "_stories_v_version_memories" USING btree ("image_id");
  CREATE INDEX "_stories_v_parent_idx" ON "_stories_v" USING btree ("parent_id");
  CREATE INDEX "_stories_v_version_version_image_idx" ON "_stories_v" USING btree ("version_image_id");
  CREATE INDEX "_stories_v_version_version_updated_at_idx" ON "_stories_v" USING btree ("version_updated_at");
  CREATE INDEX "_stories_v_version_version_created_at_idx" ON "_stories_v" USING btree ("version_created_at");
  CREATE INDEX "_stories_v_version_version__status_idx" ON "_stories_v" USING btree ("version__status");
  CREATE INDEX "_stories_v_created_at_idx" ON "_stories_v" USING btree ("created_at");
  CREATE INDEX "_stories_v_updated_at_idx" ON "_stories_v" USING btree ("updated_at");
  CREATE INDEX "_stories_v_latest_idx" ON "_stories_v" USING btree ("latest");
  CREATE INDEX "stories__status_idx" ON "stories" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_stories_v_version_body" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_stories_v_version_closing_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_stories_v_version_memories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_stories_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_stories_v_version_body" CASCADE;
  DROP TABLE "_stories_v_version_closing_paragraphs" CASCADE;
  DROP TABLE "_stories_v_version_memories" CASCADE;
  DROP TABLE "_stories_v" CASCADE;
  DROP INDEX "stories__status_idx";
  ALTER TABLE "stories_body" ALTER COLUMN "type" SET NOT NULL;
  ALTER TABLE "stories_closing_paragraphs" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "stories" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "stories" DROP COLUMN "_status";
  ALTER TABLE "media" DROP COLUMN "_objectkey";
  DROP TYPE "public"."enum_stories_status";
  DROP TYPE "public"."enum__stories_v_version_body_type";
  DROP TYPE "public"."enum__stories_v_version_role";
  DROP TYPE "public"."enum__stories_v_version_gender";
  DROP TYPE "public"."enum__stories_v_version_pillar";
  DROP TYPE "public"."enum__stories_v_version_status";`)
}
