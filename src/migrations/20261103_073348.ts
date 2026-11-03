import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_feeding_the_streets_blocks_type" AS ENUM('Paragraph', 'Heading', 'Photo');
  CREATE TABLE "feeding_the_streets_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_feeding_the_streets_blocks_type" DEFAULT 'Paragraph' NOT NULL,
  	"text" varchar,
  	"link_label" varchar,
  	"link_href" varchar,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "feeding_the_streets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "feeding_the_streets_id" integer;
  ALTER TABLE "feeding_the_streets_blocks" ADD CONSTRAINT "feeding_the_streets_blocks_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "feeding_the_streets_blocks" ADD CONSTRAINT "feeding_the_streets_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."feeding_the_streets"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "feeding_the_streets_blocks_order_idx" ON "feeding_the_streets_blocks" USING btree ("_order");
  CREATE INDEX "feeding_the_streets_blocks_parent_id_idx" ON "feeding_the_streets_blocks" USING btree ("_parent_id");
  CREATE INDEX "feeding_the_streets_blocks_image_idx" ON "feeding_the_streets_blocks" USING btree ("image_id");
  CREATE INDEX "feeding_the_streets_updated_at_idx" ON "feeding_the_streets" USING btree ("updated_at");
  CREATE INDEX "feeding_the_streets_created_at_idx" ON "feeding_the_streets" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_feeding_the_streets_fk" FOREIGN KEY ("feeding_the_streets_id") REFERENCES "public"."feeding_the_streets"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_feeding_the_streets_id_idx" ON "payload_locked_documents_rels" USING btree ("feeding_the_streets_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "feeding_the_streets_blocks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "feeding_the_streets" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "feeding_the_streets_blocks" CASCADE;
  DROP TABLE "feeding_the_streets" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_feeding_the_streets_fk";
  
  DROP INDEX "payload_locked_documents_rels_feeding_the_streets_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "feeding_the_streets_id";
  DROP TYPE "public"."enum_feeding_the_streets_blocks_type";`)
}
