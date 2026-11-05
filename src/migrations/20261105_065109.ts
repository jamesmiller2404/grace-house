import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "events_blocks_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "events_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL
  );
  
  ALTER TABLE "events_about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_what_to_expect" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "events_about" CASCADE;
  DROP TABLE "events_what_to_expect" CASCADE;
  ALTER TABLE "faq" ALTER COLUMN "order" DROP DEFAULT;
  ALTER TABLE "events_blocks_paragraphs" ADD CONSTRAINT "events_blocks_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks" ADD CONSTRAINT "events_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_blocks_paragraphs_order_idx" ON "events_blocks_paragraphs" USING btree ("_order");
  CREATE INDEX "events_blocks_paragraphs_parent_id_idx" ON "events_blocks_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_order_idx" ON "events_blocks" USING btree ("_order");
  CREATE INDEX "events_blocks_parent_id_idx" ON "events_blocks" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "events_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "events_what_to_expect" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  ALTER TABLE "events_blocks_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_blocks" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "events_blocks_paragraphs" CASCADE;
  DROP TABLE "events_blocks" CASCADE;
  ALTER TABLE "faq" ALTER COLUMN "order" SET DEFAULT 100;
  ALTER TABLE "events_about" ADD CONSTRAINT "events_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_what_to_expect" ADD CONSTRAINT "events_what_to_expect_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_about_order_idx" ON "events_about" USING btree ("_order");
  CREATE INDEX "events_about_parent_id_idx" ON "events_about" USING btree ("_parent_id");
  CREATE INDEX "events_what_to_expect_order_idx" ON "events_what_to_expect" USING btree ("_order");
  CREATE INDEX "events_what_to_expect_parent_id_idx" ON "events_what_to_expect" USING btree ("_parent_id");`)
}
