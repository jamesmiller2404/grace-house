import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "get_help_now_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "get_help_now_crisis_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "get_help_now" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"show_assessment" boolean DEFAULT true,
  	"assessment_note" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_note" varchar,
  	"phone" varchar NOT NULL,
  	"phone_href" varchar NOT NULL,
  	"hours" varchar NOT NULL,
  	"crisis_title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "get_help_now_id" integer;
  ALTER TABLE "get_help_now_facts" ADD CONSTRAINT "get_help_now_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."get_help_now"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "get_help_now_crisis_lines" ADD CONSTRAINT "get_help_now_crisis_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."get_help_now"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "get_help_now_facts_order_idx" ON "get_help_now_facts" USING btree ("_order");
  CREATE INDEX "get_help_now_facts_parent_id_idx" ON "get_help_now_facts" USING btree ("_parent_id");
  CREATE INDEX "get_help_now_crisis_lines_order_idx" ON "get_help_now_crisis_lines" USING btree ("_order");
  CREATE INDEX "get_help_now_crisis_lines_parent_id_idx" ON "get_help_now_crisis_lines" USING btree ("_parent_id");
  CREATE INDEX "get_help_now_updated_at_idx" ON "get_help_now" USING btree ("updated_at");
  CREATE INDEX "get_help_now_created_at_idx" ON "get_help_now" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_get_help_now_fk" FOREIGN KEY ("get_help_now_id") REFERENCES "public"."get_help_now"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_get_help_now_id_idx" ON "payload_locked_documents_rels" USING btree ("get_help_now_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "get_help_now_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "get_help_now_crisis_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "get_help_now" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "get_help_now_facts" CASCADE;
  DROP TABLE "get_help_now_crisis_lines" CASCADE;
  DROP TABLE "get_help_now" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_get_help_now_fk";
  
  DROP INDEX "payload_locked_documents_rels_get_help_now_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "get_help_now_id";`)
}
