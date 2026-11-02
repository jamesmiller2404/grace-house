import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"order" numeric DEFAULT 100,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faq_id" integer;
  CREATE INDEX "faq_updated_at_idx" ON "faq" USING btree ("updated_at");
  CREATE INDEX "faq_created_at_idx" ON "faq" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_faq_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "faq" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "faq" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faq_fk";
  
  DROP INDEX "payload_locked_documents_rels_faq_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faq_id";`)
}
