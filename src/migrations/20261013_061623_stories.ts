import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_stories_body_type" AS ENUM('Paragraph', 'Heading');
  CREATE TYPE "public"."enum_stories_role" AS ENUM('Graduate', 'Volunteer', 'Staff');
  CREATE TYPE "public"."enum_stories_pillar" AS ENUM('Forgive Yourself', 'God''s Timing', 'A Giver, Not a Taker', 'Restoration');
  CREATE TABLE "stories_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_stories_body_type" DEFAULT 'Paragraph' NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "stories_closing_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "stories_memories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"alt" varchar,
  	"caption" varchar
  );
  
  CREATE TABLE "stories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_stories_role" DEFAULT 'Graduate' NOT NULL,
  	"image_id" integer,
  	"image_position_x" numeric DEFAULT 50,
  	"image_position_y" numeric DEFAULT 50,
  	"pull_quote" varchar,
  	"banner_quote_quote" varchar,
  	"banner_quote_attribution" varchar,
  	"pillar" "enum_stories_pillar" DEFAULT 'Forgive Yourself' NOT NULL,
  	"date" varchar,
  	"excerpt" varchar,
  	"read_label" varchar,
  	"closing_heading" varchar,
  	"pronouns_subject" varchar,
  	"pronouns_possessive" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "stories_id" integer;
  ALTER TABLE "stories_body" ADD CONSTRAINT "stories_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_closing_paragraphs" ADD CONSTRAINT "stories_closing_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_memories" ADD CONSTRAINT "stories_memories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_memories" ADD CONSTRAINT "stories_memories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "stories_body_order_idx" ON "stories_body" USING btree ("_order");
  CREATE INDEX "stories_body_parent_id_idx" ON "stories_body" USING btree ("_parent_id");
  CREATE INDEX "stories_closing_paragraphs_order_idx" ON "stories_closing_paragraphs" USING btree ("_order");
  CREATE INDEX "stories_closing_paragraphs_parent_id_idx" ON "stories_closing_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "stories_memories_order_idx" ON "stories_memories" USING btree ("_order");
  CREATE INDEX "stories_memories_parent_id_idx" ON "stories_memories" USING btree ("_parent_id");
  CREATE INDEX "stories_memories_image_idx" ON "stories_memories" USING btree ("image_id");
  CREATE INDEX "stories_image_idx" ON "stories" USING btree ("image_id");
  CREATE INDEX "stories_updated_at_idx" ON "stories" USING btree ("updated_at");
  CREATE INDEX "stories_created_at_idx" ON "stories" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_stories_id_idx" ON "payload_locked_documents_rels" USING btree ("stories_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stories_body" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stories_closing_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stories_memories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stories" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "stories_body" CASCADE;
  DROP TABLE "stories_closing_paragraphs" CASCADE;
  DROP TABLE "stories_memories" CASCADE;
  DROP TABLE "stories" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_stories_fk";
  
  DROP INDEX "payload_locked_documents_rels_stories_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "stories_id";
  DROP TYPE "public"."enum_stories_body_type";
  DROP TYPE "public"."enum_stories_role";
  DROP TYPE "public"."enum_stories_pillar";`)
}
