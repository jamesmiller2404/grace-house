import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_donate_blocks_type" AS ENUM('Paragraph', 'Heading');
  CREATE TABLE "donate_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_donate_blocks_type" DEFAULT 'Paragraph' NOT NULL,
  	"text" varchar NOT NULL,
  	"link_label" varchar,
  	"link_href" varchar
  );
  
  DROP TABLE "donate_sections_paragraphs" CASCADE;
  DROP TABLE "donate_sections" CASCADE;
  ALTER TABLE "donate_blocks" ADD CONSTRAINT "donate_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "donate_blocks_order_idx" ON "donate_blocks" USING btree ("_order");
  CREATE INDEX "donate_blocks_parent_id_idx" ON "donate_blocks" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "donate_sections_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"link_label" varchar,
  	"link_href" varchar
  );
  
  CREATE TABLE "donate_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL
  );
  
  DROP TABLE "donate_blocks" CASCADE;
  ALTER TABLE "donate_sections_paragraphs" ADD CONSTRAINT "donate_sections_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_sections" ADD CONSTRAINT "donate_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "donate_sections_paragraphs_order_idx" ON "donate_sections_paragraphs" USING btree ("_order");
  CREATE INDEX "donate_sections_paragraphs_parent_id_idx" ON "donate_sections_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "donate_sections_order_idx" ON "donate_sections" USING btree ("_order");
  CREATE INDEX "donate_sections_parent_id_idx" ON "donate_sections" USING btree ("_parent_id");
  DROP TYPE "public"."enum_donate_blocks_type";`)
}
