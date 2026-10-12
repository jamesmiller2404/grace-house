import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"eyebrow" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "hero_id" integer;
  ALTER TABLE "hero" ADD CONSTRAINT "hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "hero_image_idx" ON "hero" USING btree ("image_id");
  CREATE INDEX "hero_updated_at_idx" ON "hero" USING btree ("updated_at");
  CREATE INDEX "hero_created_at_idx" ON "hero" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hero_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_hero_id_idx" ON "payload_locked_documents_rels" USING btree ("hero_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "hero" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_hero_fk";
  
  DROP INDEX "payload_locked_documents_rels_hero_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "hero_id";`)
}
