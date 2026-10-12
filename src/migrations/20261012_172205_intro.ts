import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_intro_bg_color" AS ENUM('cream', 'sand', 'gold', 'terra', 'lift', 'anchor', 'ink', 'white');
  CREATE TYPE "public"."enum_intro_text_color" AS ENUM('cream', 'sand', 'gold', 'terra', 'lift', 'anchor', 'ink', 'white');
  CREATE TYPE "public"."enum_intro_link_color" AS ENUM('cream', 'sand', 'gold', 'terra', 'lift', 'anchor', 'ink', 'white');
  CREATE TYPE "public"."enum_intro_link_hover_color" AS ENUM('cream', 'sand', 'gold', 'terra', 'lift', 'anchor', 'ink', 'white');
  CREATE TABLE "intro" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"pull_quote" varchar,
  	"link_label" varchar,
  	"link_href" varchar,
  	"bg_color" "enum_intro_bg_color" DEFAULT 'cream',
  	"text_color" "enum_intro_text_color" DEFAULT 'anchor',
  	"link_color" "enum_intro_link_color" DEFAULT 'terra',
  	"link_hover_color" "enum_intro_link_hover_color" DEFAULT 'lift',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "intro_id" integer;
  CREATE INDEX "intro_updated_at_idx" ON "intro" USING btree ("updated_at");
  CREATE INDEX "intro_created_at_idx" ON "intro" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_intro_fk" FOREIGN KEY ("intro_id") REFERENCES "public"."intro"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_intro_id_idx" ON "payload_locked_documents_rels" USING btree ("intro_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "intro" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "intro" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_intro_fk";
  
  DROP INDEX "payload_locked_documents_rels_intro_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "intro_id";
  DROP TYPE "public"."enum_intro_bg_color";
  DROP TYPE "public"."enum_intro_text_color";
  DROP TYPE "public"."enum_intro_link_color";
  DROP TYPE "public"."enum_intro_link_hover_color";`)
}
