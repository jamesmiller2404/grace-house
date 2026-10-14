import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
  
  DROP TABLE "donate_ucc_paragraphs" CASCADE;
  DROP TABLE "donate_ucc_details" CASCADE;
  DROP TABLE "donate_ucc_closing_paragraphs" CASCADE;
  ALTER TABLE "donate_sections_paragraphs" ADD CONSTRAINT "donate_sections_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_sections" ADD CONSTRAINT "donate_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "donate_sections_paragraphs_order_idx" ON "donate_sections_paragraphs" USING btree ("_order");
  CREATE INDEX "donate_sections_paragraphs_parent_id_idx" ON "donate_sections_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "donate_sections_order_idx" ON "donate_sections" USING btree ("_order");
  CREATE INDEX "donate_sections_parent_id_idx" ON "donate_sections" USING btree ("_parent_id");
  ALTER TABLE "donate" DROP COLUMN "ucc_heading";
  ALTER TABLE "donate" DROP COLUMN "ucc_contact_label";
  ALTER TABLE "donate" DROP COLUMN "ucc_contact_phone";
  ALTER TABLE "donate" DROP COLUMN "ucc_contact_email";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "donate_ucc_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "donate_ucc_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "donate_ucc_closing_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"link_label" varchar,
  	"link_href" varchar
  );
  
  DROP TABLE "donate_sections_paragraphs" CASCADE;
  DROP TABLE "donate_sections" CASCADE;
  ALTER TABLE "donate" ADD COLUMN "ucc_heading" varchar NOT NULL;
  ALTER TABLE "donate" ADD COLUMN "ucc_contact_label" varchar;
  ALTER TABLE "donate" ADD COLUMN "ucc_contact_phone" varchar;
  ALTER TABLE "donate" ADD COLUMN "ucc_contact_email" varchar;
  ALTER TABLE "donate_ucc_paragraphs" ADD CONSTRAINT "donate_ucc_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_ucc_details" ADD CONSTRAINT "donate_ucc_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_ucc_closing_paragraphs" ADD CONSTRAINT "donate_ucc_closing_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "donate_ucc_paragraphs_order_idx" ON "donate_ucc_paragraphs" USING btree ("_order");
  CREATE INDEX "donate_ucc_paragraphs_parent_id_idx" ON "donate_ucc_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "donate_ucc_details_order_idx" ON "donate_ucc_details" USING btree ("_order");
  CREATE INDEX "donate_ucc_details_parent_id_idx" ON "donate_ucc_details" USING btree ("_parent_id");
  CREATE INDEX "donate_ucc_closing_paragraphs_order_idx" ON "donate_ucc_closing_paragraphs" USING btree ("_order");
  CREATE INDEX "donate_ucc_closing_paragraphs_parent_id_idx" ON "donate_ucc_closing_paragraphs" USING btree ("_parent_id");`)
}
