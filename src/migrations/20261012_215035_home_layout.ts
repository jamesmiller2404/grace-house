import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_layout_sections_section" AS ENUM('hero', 'help-strip', 'welcome', 'four-pillars', 'stories', 'upcoming-events');
  CREATE TABLE "home_layout_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section" "enum_home_layout_sections_section" NOT NULL,
  	"enabled" boolean DEFAULT true
  );
  
  CREATE TABLE "home_layout" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "home_layout_sections" ADD CONSTRAINT "home_layout_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_layout"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_layout_sections_order_idx" ON "home_layout_sections" USING btree ("_order");
  CREATE INDEX "home_layout_sections_parent_id_idx" ON "home_layout_sections" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_layout_sections" CASCADE;
  DROP TABLE "home_layout" CASCADE;
  DROP TYPE "public"."enum_home_layout_sections_section";`)
}
