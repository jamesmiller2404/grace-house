import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_custom_pages_blocks_type" AS ENUM('Paragraph', 'Heading', 'Photo');
  CREATE TABLE "custom_pages_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_custom_pages_blocks_type" DEFAULT 'Paragraph' NOT NULL,
  	"text" varchar,
  	"link_label" varchar,
  	"link_href" varchar,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "custom_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT false,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "custom_pages_id" integer;
  ALTER TABLE "custom_pages_blocks" ADD CONSTRAINT "custom_pages_blocks_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_pages_blocks" ADD CONSTRAINT "custom_pages_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."custom_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "custom_pages_blocks_order_idx" ON "custom_pages_blocks" USING btree ("_order");
  CREATE INDEX "custom_pages_blocks_parent_id_idx" ON "custom_pages_blocks" USING btree ("_parent_id");
  CREATE INDEX "custom_pages_blocks_image_idx" ON "custom_pages_blocks" USING btree ("image_id");
  CREATE INDEX "custom_pages_updated_at_idx" ON "custom_pages" USING btree ("updated_at");
  CREATE INDEX "custom_pages_created_at_idx" ON "custom_pages" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_custom_pages_fk" FOREIGN KEY ("custom_pages_id") REFERENCES "public"."custom_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_custom_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("custom_pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "custom_pages_blocks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "custom_pages" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "custom_pages_blocks" CASCADE;
  DROP TABLE "custom_pages" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_custom_pages_fk";
  
  DROP INDEX "payload_locked_documents_rels_custom_pages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "custom_pages_id";
  DROP TYPE "public"."enum_custom_pages_blocks_type";`)
}
