import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "contact_info_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar NOT NULL
  );
  
  ALTER TABLE "contact_info_addresses" ADD CONSTRAINT "contact_info_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "contact_info_addresses_order_idx" ON "contact_info_addresses" USING btree ("_order");
  CREATE INDEX "contact_info_addresses_parent_id_idx" ON "contact_info_addresses" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "contact_info_addresses" CASCADE;`)
}
