import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "contact_info_phone_numbers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "contact_info_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "contact_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "contact_info_phone_numbers" ADD CONSTRAINT "contact_info_phone_numbers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_info_emails" ADD CONSTRAINT "contact_info_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "contact_info_phone_numbers_order_idx" ON "contact_info_phone_numbers" USING btree ("_order");
  CREATE INDEX "contact_info_phone_numbers_parent_id_idx" ON "contact_info_phone_numbers" USING btree ("_parent_id");
  CREATE INDEX "contact_info_emails_order_idx" ON "contact_info_emails" USING btree ("_order");
  CREATE INDEX "contact_info_emails_parent_id_idx" ON "contact_info_emails" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "contact_info_phone_numbers" CASCADE;
  DROP TABLE "contact_info_emails" CASCADE;
  DROP TABLE "contact_info" CASCADE;`)
}
