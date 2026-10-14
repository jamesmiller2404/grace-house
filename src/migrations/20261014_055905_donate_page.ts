import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
  
  CREATE TABLE "donate" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"paypal_heading" varchar NOT NULL,
  	"paypal_body_start" varchar,
  	"paypal_email" varchar,
  	"paypal_body_end" varchar,
  	"paypal_button_label" varchar NOT NULL,
  	"paypal_button_href" varchar NOT NULL,
  	"venmo_heading" varchar NOT NULL,
  	"venmo_body_start" varchar,
  	"venmo_username" varchar,
  	"venmo_profile_href" varchar NOT NULL,
  	"venmo_body_end" varchar,
  	"venmo_button_label" varchar NOT NULL,
  	"venmo_button_href" varchar NOT NULL,
  	"note_text" varchar,
  	"note_phone" varchar,
  	"note_phone_href" varchar,
  	"ucc_heading" varchar NOT NULL,
  	"ucc_contact_label" varchar,
  	"ucc_contact_phone" varchar,
  	"ucc_contact_email" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "donate_id" integer;
  ALTER TABLE "donate_ucc_paragraphs" ADD CONSTRAINT "donate_ucc_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_ucc_details" ADD CONSTRAINT "donate_ucc_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_ucc_closing_paragraphs" ADD CONSTRAINT "donate_ucc_closing_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "donate_ucc_paragraphs_order_idx" ON "donate_ucc_paragraphs" USING btree ("_order");
  CREATE INDEX "donate_ucc_paragraphs_parent_id_idx" ON "donate_ucc_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "donate_ucc_details_order_idx" ON "donate_ucc_details" USING btree ("_order");
  CREATE INDEX "donate_ucc_details_parent_id_idx" ON "donate_ucc_details" USING btree ("_parent_id");
  CREATE INDEX "donate_ucc_closing_paragraphs_order_idx" ON "donate_ucc_closing_paragraphs" USING btree ("_order");
  CREATE INDEX "donate_ucc_closing_paragraphs_parent_id_idx" ON "donate_ucc_closing_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "donate_updated_at_idx" ON "donate" USING btree ("updated_at");
  CREATE INDEX "donate_created_at_idx" ON "donate" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_donate_fk" FOREIGN KEY ("donate_id") REFERENCES "public"."donate"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_donate_id_idx" ON "payload_locked_documents_rels" USING btree ("donate_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "donate_ucc_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "donate_ucc_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "donate_ucc_closing_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "donate" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "donate_ucc_paragraphs" CASCADE;
  DROP TABLE "donate_ucc_details" CASCADE;
  DROP TABLE "donate_ucc_closing_paragraphs" CASCADE;
  DROP TABLE "donate" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_donate_fk";
  
  DROP INDEX "payload_locked_documents_rels_donate_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "donate_id";`)
}
